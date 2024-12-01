import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import glob
import os
from fastapi.middleware.cors import CORSMiddleware

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
    # Convert the request to a dictionary
    transaction_dict = transaction.dict()
    
    # Get prediction
    result = pipeline.predict(transaction_dict)
    
    # Return the prediction
    return {
        "prediction": result['prediction'],
        "confidence": result['confidence'],
        "probabilities": result['probabilities']
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
