import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import glob
import os
from fastapi.middleware.cors import CORSMiddleware
import shap 

class FraudDetectionPipeline:
    def __init__(self, model_path, scaler_path, encoder_path):
        """Initialize the pipeline with saved model artifacts"""
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)
        self.label_encoder = joblib.load(encoder_path)
        # Initialize SHAP explainer
        self.explainer = shap.TreeExplainer(self.model)
        self.feature_names = [
            'TransactionAmount', 'in_degree', 'out_degree',
            'in_weight', 'out_weight', 'AvailableBalance'
        ]
        
    def preprocess_transaction(self, transaction_data):
        """Preprocess single transaction"""
        # Expected features in correct order
        required_features = [
            'TransactionAmount', 'in_degree', 'out_degree',
            'in_weight', 'out_weight', 'AvailableBalance'
        ]
        
        # Ensure all features exist
        for feature in required_features:
            if feature not in transaction_data:
                transaction_data[feature] = 0
                
        # Create feature vector
        X = pd.DataFrame([transaction_data])[required_features]
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        return X_scaled
    
    def predict(self, transaction_data):
        """Make prediction for single transaction"""
        # Preprocess
        X_processed = self.preprocess_transaction(transaction_data)
        
        # Predict
        pred_encoded = self.model.predict(X_processed)[0]
        
        # Decode prediction
        pred_label = self.label_encoder.inverse_transform([pred_encoded])[0]
        
        # Get prediction probabilities
        pred_proba = self.model.predict_proba(X_processed)[0]
        
        return {
            'prediction': pred_label,
            'confidence': float(max(pred_proba)),
            'probabilities': {
                self.label_encoder.inverse_transform([i])[0]: float(p)
                for i, p in enumerate(pred_proba)
            }
        }
    
    def explain_prediction(self, transaction_data):
        """Generate SHAP explanation for highest probability fraud class"""
        try:
            # Get prediction and probabilities
            result = self.predict(transaction_data)
            X_processed = self.preprocess_transaction(transaction_data)
            
            # Ensure X_processed is 2D
            if len(X_processed.shape) == 1:
                X_processed = X_processed.reshape(1, -1)
                
            # Get SHAP values with shape validation
            shap_values = self.explainer.shap_values(X_processed)
            
            # Debug logging
            print(f"SHAP values shape: {np.array(shap_values).shape}")
            print(f"Available classes: {self.label_encoder.classes_}")
            
            # Find highest probability non-legitimate class
            fraud_classes = [cls for cls in result['probabilities'].keys() if cls != 'legitimate']
            if not fraud_classes:
                return result
                
            fraud_probs = {cls: result['probabilities'][cls] for cls in fraud_classes}
            highest_fraud_class = max(fraud_probs.items(), key=lambda x: x[1])[0]
            
            # Safe class index extraction
            class_idx = int(self.label_encoder.transform([highest_fraud_class])[0])
            
            # Handle different SHAP value formats
            if isinstance(shap_values, list):
                # Multi-class case
                if class_idx >= len(shap_values):
                    print(f"Warning: class_idx {class_idx} out of bounds, using first class")
                    class_idx = 0
                class_shap_values = shap_values[class_idx]
                if len(class_shap_values.shape) > 1:
                    class_shap_values = class_shap_values[0]
            else:
                # Binary case
                class_shap_values = shap_values[0] if len(shap_values.shape) > 1 else shap_values
                
            # Safe feature importance calculation
            feature_importance = {}
            for feature, value in zip(self.feature_names, class_shap_values):
                if isinstance(value, np.ndarray):
                    value = float(value.item()) if value.size == 1 else float(value[0])
                else:
                    value = float(value)
                feature_importance[feature] = value
            
            # Update risk factors with context
            explanation = {
                **result,
                'fraud_class_explained': highest_fraud_class,
                'fraud_probability': float(result['probabilities'][highest_fraud_class]),
                'risk_factors': [
                    {
                        'feature': feature,
                        'impact': float(value),
                        'interpretation': self._get_feature_interpretation(
                            feature, 
                            float(value),
                            transaction_data
                        )
                    }
                    for feature, value in sorted(
                        feature_importance.items(),
                        key=lambda x: abs(x[1]),
                        reverse=True
                    )[:3]
                ]
            }
            
            return explanation
            
        except Exception as e:
            print(f"Error in explain_prediction: {str(e)}")
            print(f"SHAP values type: {type(shap_values)}")
            if isinstance(shap_values, list):
                print(f"Number of classes in SHAP values: {len(shap_values)}")
            raise
            
    def _get_feature_interpretation(self, feature, shap_value, transaction_data):
        """Generate context-aware interpretation of SHAP values"""
        impact = "increases" if shap_value > 0 else "decreases"
        magnitude = "significantly" if abs(shap_value) > 0.5 else "somewhat"
        
        # Define thresholds and typical ranges
        thresholds = {
            'TransactionAmount': 1000.0,  # Threshold for large transactions
            'in_degree': 10,    # Typical incoming transactions
            'out_degree': 10,   # Typical outgoing transactions
            'in_weight': 10000.0,  # Typical incoming amount
            'out_weight': 10000.0,  # Typical outgoing amount
            'AvailableBalance': 5000.0  # Typical balance threshold
        }
        
        # Context-aware interpretations
        value = transaction_data[feature]
        threshold = thresholds[feature]
        
        interpretations = {
            'TransactionAmount': (
                f"Transaction amount of ${value:,.2f} {impact} risk {magnitude}. "
                f"{'This is above' if value > threshold else 'This is below'} "
                f"the typical threshold of ${threshold:,.2f}"
            ),
            'in_degree': (
                f"Number of incoming transactions ({value}) {impact} risk {magnitude}. "
                f"{'This is higher than' if value > threshold else 'This is lower than'} "
                f"the typical frequency of {threshold} transactions"
            ),
            'out_degree': (
                f"Number of outgoing transactions ({value}) {impact} risk {magnitude}. "
                f"{'This is higher than' if value > threshold else 'This is lower than'} "
                f"the typical frequency of {threshold} transactions"
            ),
            'in_weight': (
                f"Total incoming amount of ${value:,.2f} {impact} risk {magnitude}. "
                f"{'This exceeds' if value > threshold else 'This is within'} "
                f"typical incoming volume of ${threshold:,.2f}"
            ),
            'out_weight': (
                f"Total outgoing amount of ${value:,.2f} {impact} risk {magnitude}. "
                f"{'This exceeds' if value > threshold else 'This is within'} "
                f"typical outgoing volume of ${threshold:,.2f}"
            ),
            'AvailableBalance': (
                f"Account balance of ${value:,.2f} {impact} risk {magnitude}. "
                f"{'This is above' if value > threshold else 'This is below'} "
                f"the typical balance threshold of ${threshold:,.2f}"
            )
        }
        
        return interpretations.get(feature, f"Feature {impact} risk {magnitude}")


# Example usage:
def load_fraud_detection_pipeline(model_dir='models'):
    """Load latest model files"""
    
    # Get latest model files
    # model_files = glob.glob(os.path.join(model_dir, 'xgb_model_*.joblib'))
    # scaler_files = glob.glob(os.path.join(model_dir, 'scaler_*.joblib'))
    # encoder_files = glob.glob(os.path.join(model_dir, 'label_encoder_*.joblib'))
    model_files = glob.glob(r"C:\Users\ILLEGEAR\Desktop\Projects\duitguard\models\xgb_model_20241201_083843.joblib")
    scaler_files = glob.glob(r"C:\Users\ILLEGEAR\Desktop\Projects\duitguard\models\scaler_20241201_083843.joblib")
    encoder_files = glob.glob(r"C:\Users\ILLEGEAR\Desktop\Projects\duitguard\models\label_encoder_20241201_083843.joblib")
    
    if not model_files:
        raise FileNotFoundError("No model files found in the specified directory.")
    if not scaler_files:
        raise FileNotFoundError("No scaler files found in the specified directory.")
    if not encoder_files:
        raise FileNotFoundError("No encoder files found in the specified directory.")
    
    latest_model = max(model_files, key=os.path.getctime)
    latest_scaler = max(scaler_files, key=os.path.getctime)
    latest_encoder = max(encoder_files, key=os.path.getctime)
    
    return FraudDetectionPipeline(latest_model, latest_scaler, latest_encoder)

# Load the pipeline
pipeline = load_fraud_detection_pipeline()

# Define the request body
class Transaction(BaseModel):
    TransactionAmount: float
    in_degree: int
    out_degree: int
    in_weight: float
    out_weight: float
    AvailableBalance: float

def explain_prediction(self, transaction_data):
        result = self.predict(transaction_data)
        X_processed = self.preprocess_transaction(transaction_data)
        shap_values = self.explainer.shap_values(X_processed)
        explanation = self.explainer.explain(X_processed)
        risk_factors = [factor['interpretation'] for factor in explanation['risk_factors']]
        return {
            'prediction': result['prediction'],
            'confidence': result['confidence'],
            'probabilities': result['probabilities'],
            'risk_factors': risk_factors
        }

# Initialize FastAPI
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the fraud detection API"}

@app.post("/predict")
def predict(transaction: Transaction):
    transaction_dict = transaction.dict()
    result = pipeline.explain_prediction(transaction_dict)
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
def main():
    pipeline = load_fraud_detection_pipeline()
    
    transaction = {
        'TransactionAmount': 250.0,
        'in_degree': 15,
        'out_degree': 12,
        'in_weight': 15000.0,
        'out_weight': 12000.0,
        'AvailableBalance': 1200.0
    }
    
    explanation = pipeline.explain_prediction(transaction)
    
    print(f"\nPrediction: {explanation['prediction']}")
    print(f"Confidence: {explanation['confidence']:.3f}")
    
    if 'fraud_class_explained' in explanation:
        print(f"\nDetailed explanation for {explanation['fraud_class_explained']}:")
        print(f"Fraud probability: {explanation['fraud_probability']:.3f}")
        print("\nRisk Analysis:")
        for factor in explanation['risk_factors']:
            print(f"• {factor['interpretation']}")

if __name__ == "__main__":
    main()
