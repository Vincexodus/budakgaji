import xgboost as xgb
import json

# Load the model from JSON
with open('fraud_detection_model_20241130_051759.json', 'r') as f:
    model_json = json.load(f)
    
# Convert JSON to XGBoost Booster
model = xgb.Booster()
model = model.load_model_from_buffer(json.dumps(model_json).encode())

# To make predictions
def predict(features):
    # Convert features to DMatrix
    dmat = xgb.DMatrix(features)
    return model.predict(dmat)