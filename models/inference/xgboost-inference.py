import joblib
import pandas as pd
import numpy as np

class FraudDetectionPipeline:
    def __init__(self, model_path, scaler_path, encoder_path):
        """Initialize the pipeline with saved model artifacts"""
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)
        self.label_encoder = joblib.load(encoder_path)
        
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

# Example usage:
def load_fraud_detection_pipeline(model_dir='models'):
    """Load latest model files"""
    import glob
    import os
    
    # Get latest model files
    model_files = glob.glob(os.path.join(model_dir, 'xgb_model_*.joblib'))
    scaler_files = glob.glob(os.path.join(model_dir, 'scaler_*.joblib'))
    encoder_files = glob.glob(os.path.join(model_dir, 'label_encoder_*.joblib'))
    
    latest_model = max(model_files, key=os.path.getctime)
    latest_scaler = max(scaler_files, key=os.path.getctime)
    latest_encoder = max(encoder_files, key=os.path.getctime)
    
    return FraudDetectionPipeline(latest_model, latest_scaler, latest_encoder)

def main():
    # Load pipeline
    pipeline = load_fraud_detection_pipeline()
    
    # Example transaction
    transaction = {
        'TransactionAmount': 250.0,      # Smaller amount, typical of smurfing
        'in_degree': 15,                 # High number of incoming connections
        'out_degree': 12,                # High number of outgoing connections
        'in_weight': 15000.0,            # High total incoming amount
        'out_weight': 12000.0,           # High total outgoing amount
        'AvailableBalance': 1200.0       # Relatively low balance (quick turnover)
    }
    
    # Get prediction
    result = pipeline.predict(transaction)
    print("Prediction:", result['prediction'])
    print("Confidence:", result['confidence'])
    print("\nClass Probabilities:")
    for class_name, prob in result['probabilities'].items():
        print(f"{class_name}: {prob:.3f}")

if __name__ == "__main__":
    main()
