import pandas as pd
import numpy as np
import json
from tqdm import tqdm
import xgboost as xgb
from sklearn.model_selection import KFold
import joblib
from datetime import datetime
import optuna
from sklearn.metrics import roc_auc_score
import os
import ast

class GraphModel:
    def __init__(self):
        self.account_map = {}
        self.edges = []
        self.model = None
        
    def build_graph(self, edges_df):
        """Build graph from edges DataFrame"""
        unique_sources = edges_df['source'].unique()
        unique_targets = edges_df['target'].unique()
        unique_accounts = pd.Series(list(set(unique_sources) | set(unique_targets)))
        
        self.account_map = {acc: idx for idx, acc in enumerate(unique_accounts)}
        
        self.edges = edges_df.apply(lambda row: [
            self.account_map[row['source']], 
            self.account_map[row['target']], 
            row['amount'],
            pd.Timestamp(row['timestamp']).timestamp()
        ], axis=1).tolist()
        
    def get_node_features(self, account_id, transactions_df):
        """Extract features for given account"""
        # Get all transactions for this account
        sent = transactions_df[transactions_df['AccountId'] == account_id]
        
        # Get received transactions by parsing CreditorAccount
        received = transactions_df[
            transactions_df['CreditorAccount'].apply(
                lambda x: ast.literal_eval(x)['AccountId'] == account_id
            )
        ]
        
        features = {
            'num_sent': len(sent),
            'num_received': len(received),
            'total_sent': sent['TransactionAmount'].sum(),
            'total_received': received['TransactionAmount'].sum(),
            'avg_sent': sent['TransactionAmount'].mean() if len(sent) > 0 else 0,
            'avg_received': received['TransactionAmount'].mean() if len(received) > 0 else 0,
            'max_sent': sent['TransactionAmount'].max() if len(sent) > 0 else 0,
            'max_received': received['TransactionAmount'].max() if len(received) > 0 else 0,
            'std_sent': sent['TransactionAmount'].std() if len(sent) > 0 else 0,
            'std_received': received['TransactionAmount'].std() if len(received) > 0 else 0
        }
        
        return list(features.values())

    def train_model(self, features, labels, n_folds=5, n_trials=100):
        """Train XGBoost model with Optuna optimization and cross-validation"""
        print("Optimizing hyperparameters with Optuna...")

        def objective(trial):
            # Define hyperparameter search space
            params = {
                'objective': 'binary:logistic',
                'eval_metric': 'auc',
                'max_depth': trial.suggest_int('max_depth', 3, 9),
                'eta': trial.suggest_float('eta', 0.01, 0.3),
                'subsample': trial.suggest_float('subsample', 0.6, 1.0),
                'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
                'min_child_weight': trial.suggest_int('min_child_weight', 1, 7),
                'gamma': trial.suggest_float('gamma', 0, 1)
            }

            # Cross-validation
            kf = KFold(n_splits=n_folds, shuffle=True, random_state=42)
            cv_scores = []

            for train_idx, val_idx in kf.split(features):
                X_train, X_val = features[train_idx], features[val_idx]
                y_train, y_val = labels[train_idx], labels[val_idx]
                
                dtrain = xgb.DMatrix(X_train, label=y_train)
                dval = xgb.DMatrix(X_val, label=y_val)
                
                model = xgb.train(
                    params,
                    dtrain,
                    num_boost_round=100,
                    evals=[(dval, 'val')],
                    early_stopping_rounds=10,
                    verbose_eval=False
                )
                
                val_preds = model.predict(dval)
                cv_scores.append(roc_auc_score(y_val, val_preds))

            return np.mean(cv_scores)

        # Create study and optimize
        study = optuna.create_study(direction='maximize')
        study.optimize(objective, n_trials=n_trials, show_progress_bar=True)

        print("\nBest trial:")
        print(f"  Value: {study.best_trial.value:.4f}")
        print("  Params: ")
        for key, value in study.best_trial.params.items():
            print(f"    {key}: {value}")

        # Train final model with best parameters
        print("\nTraining final model with best parameters...")
        best_params = {
            'objective': 'binary:logistic',
            'eval_metric': 'auc',
            **study.best_trial.params
        }
        
        dtrain_full = xgb.DMatrix(features, label=labels)
        self.model = xgb.train(best_params, dtrain_full, num_boost_round=100)
        
        # Save model
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        model_path = f"fraud_detection_model_{timestamp}.json"
        self.model.save_model(model_path)
        print(f"Model saved to {model_path}")

        # Save optimization results
        study_path = f"optuna_study_{timestamp}.pkl"
        joblib.dump(study, study_path)
        print(f"Optimization study saved to {study_path}")
        
    def predict_risk(self, features):
        """Predict risk score for account"""
        if self.model is None:
            raise Exception("Model not trained yet")
            
        dtest = xgb.DMatrix([features])
        risk_score = self.model.predict(dtest)[0]
        
        # Get feature importance
        feature_names = [
            'num_sent', 'num_received', 'total_sent', 'total_received',
            'avg_sent', 'avg_received', 'max_sent', 'max_received',
            'std_sent', 'std_received'
        ]
        importance_scores = self.model.get_score(importance_type='gain')
        signature = {name: importance_scores.get(f"f{i}", 0) 
                    for i, name in enumerate(feature_names)}
        
        return risk_score, signature

# Load and preprocess transactions data
def load_transactions():
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        data_path = os.path.join(script_dir, '..', 'data', 'v3.1', 'train_transactions.csv')
        transactions_df = pd.read_csv(data_path)
                
        # Convert date columns to datetime
        date_columns = ['BookingDateTime', 'ValueDateTime']
        for col in date_columns:
            transactions_df[col] = pd.to_datetime(transactions_df[col])
            
        # Convert amount to numeric, handling any currency symbols
        transactions_df['TransactionAmount'] = pd.to_numeric(
            transactions_df['TransactionAmount'].replace('[\$,£,€]', '', regex=True), 
            errors='coerce'
        )
        
        print(f"Loaded {len(transactions_df)} transactions")
        return transactions_df
        
    except FileNotFoundError:
        raise Exception("transactions.csv not found in data directory")
    except Exception as e:
        raise Exception(f"Error loading transactions: {str(e)}")

def parse_creditor_account(json_str):
    try:
        return ast.literal_eval(json_str)['AccountId']
    except:
        return None
    
# Load transactions
transactions_df = load_transactions()

# Create edges DataFrame with correct JSON parsing
edges_df = pd.DataFrame({
    'source': transactions_df['AccountId'],
    'target': transactions_df['CreditorAccount'].apply(parse_creditor_account),
    'amount': transactions_df['TransactionAmount'],
    'timestamp': transactions_df['BookingDateTime']
})

# Remove any rows where parsing failed
edges_df = edges_df.dropna()

print(f"Created graph with {len(edges_df)} valid edges")

# Initialize and train model
model = GraphModel()
model.build_graph(edges_df)

# Extract features
features = []
labels = []

print("Extracting features...")
for account_id in tqdm(model.account_map.keys()):
    node_features = model.get_node_features(account_id, transactions_df)
    features.append(node_features)
    
    is_fraud = transactions_df[
        transactions_df['AccountId'] == account_id
    ]['FraudType'].notna().any()
    labels.append(int(is_fraud))

# Convert to numpy arrays
features = np.array(features)
labels = np.array(labels)

# Train model
model.train_model(features, labels)

# Example prediction
test_account = list(model.account_map.keys())[0]
test_features = model.get_node_features(test_account, transactions_df)
risk_score, signature = model.predict_risk(test_features)

print(f"\nExample prediction for account {test_account}:")
print(f"Risk score: {risk_score:.3f}")
print("Feature importance:")
print(json.dumps(signature, indent=2))