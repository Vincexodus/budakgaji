import networkx as nx
import logging
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import xgboost as xgb
from sklearn.metrics import classification_report, confusion_matrix
import time
import joblib
from datetime import datetime
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

def investigate_data(transactions):
    """
    Comprehensive data investigation
    """
    print("\n--- DATA INVESTIGATION ---")
    print(f"Total transactions: {len(transactions)}")
    
    # Check unique fraud types
    print("\nFraud Type Distribution:")
    print(transactions['FraudType'].value_counts())
    
    # Check column names
    print("\nColumn Names:")
    print(transactions.columns.tolist())
    
    # Check for any NaN or null values
    print("\nNull Values:")
    print(transactions.isnull().sum())
    
    # Detailed fraud type analysis
    print("\nDetailed Fraud Type Analysis:")
    fraud_breakdown = transactions.groupby('FraudType').size()
    print(fraud_breakdown)
    
    return fraud_breakdown


def load_and_preprocess_data(train_path, val_path, accounts_path, balances_path):
    """
    Optimized data loading and initial preprocessing
    """
    try:
        # Load data with optimized reading
        logger.info("Loading data files...")
        train_transactions = pd.read_csv(train_path, low_memory=False)
        val_transactions = pd.read_csv(val_path, low_memory=False)
        accounts = pd.read_csv(accounts_path, low_memory=False)
        balances = pd.read_csv(balances_path, low_memory=False)
        
        # Basic preprocessing
        train_transactions['CreditorAccount'] = train_transactions['CreditorAccount'].apply(eval)
        val_transactions['CreditorAccount'] = val_transactions['CreditorAccount'].apply(eval)
        
        return train_transactions, val_transactions, accounts, balances
    
    except Exception as e:
        logger.error(f"Data loading error: {e}")
        raise

def create_fast_graph_features(transactions):
    """
    Faster graph feature extraction with corrected edge weight handling
    """
    logger.info("Creating graph features...")
    start_time = time.time()
    
    # Create directed graph
    G = nx.DiGraph()
    
    # Efficient graph building
    for _, row in transactions.iterrows():
        from_account = row['AccountId']
        to_account = row['CreditorAccount']['AccountId']
        amount = row['TransactionAmount']
        
        # Add or update edge
        if G.has_edge(from_account, to_account):
            G[from_account][to_account]['weight'] = G[from_account][to_account].get('weight', 0) + amount
        else:
            G.add_edge(from_account, to_account, weight=amount)
    
    # Compute graph features more efficiently
    features = {}
    for node in G.nodes():
        # Calculate in and out weights safely
        in_weights = [d['weight'] for _, _, d in G.in_edges(node, data=True)]
        out_weights = [d['weight'] for _, _, d in G.out_edges(node, data=True)]
        
        features[node] = {
            'in_degree': G.in_degree(node),
            'out_degree': G.out_degree(node),
            'in_weight': sum(in_weights) if in_weights else 0,
            'out_weight': sum(out_weights) if out_weights else 0
        }
    
    graph_df = pd.DataFrame.from_dict(features, orient='index').reset_index()
    graph_df.columns = ['AccountId'] + list(graph_df.columns[1:])
    
    logger.info(f"Graph features created in {time.time() - start_time:.2f} seconds")
    return graph_df



def downsample_majority_class(X, y, threshold=0.1):
    """
    Downsample majority classes while preserving minority classes
    """
    class_counts = pd.Series(y).value_counts()
    min_class_size = class_counts.min()
    balanced_data = []
    
    for class_label in class_counts.index:
        mask = y == class_label
        X_class = X[mask]
        y_class = y[mask]
        
        # If class is larger than threshold * smallest class, downsample
        if len(y_class) > min_class_size * (1 + threshold):
            idx = np.random.choice(len(X_class), size=int(min_class_size * (1 + threshold)), replace=False)
            X_class = X_class[idx]
            y_class = y_class[idx]
            
        balanced_data.append((X_class, y_class))
    
    X_balanced = np.vstack([x[0] for x in balanced_data])
    y_balanced = np.concatenate([x[1] for x in balanced_data])
    
    # Shuffle the data
    shuffle_idx = np.random.permutation(len(y_balanced))
    return X_balanced[shuffle_idx], y_balanced[shuffle_idx]

def prepare_model_data(transactions, accounts, balances, graph_features):
    """
    Prepare and balance data for model training
    """
    # Standardize FraudType
    transactions['FraudType'] = transactions['FraudType'].fillna('no_fraud')
    transactions['FraudType'] = transactions['FraudType'].astype(str).str.lower()
    
    # Create feature set
    features = transactions.merge(accounts, on='AccountId', how='left')
    features = features.merge(balances, on='AccountId', how='left')
    features = features.merge(graph_features, on='AccountId', how='left')
    
    # Select and prepare features with correct column name
    numeric_features = [
        'TransactionAmount', 'in_degree', 'out_degree', 
        'in_weight', 'out_weight', 'AvailableBalance'  # Changed from 'Balance' to 'AvailableBalance'
    ]
    
    # Fill missing values
    features[numeric_features] = features[numeric_features].fillna(0)
    
    # Scale features
    scaler = StandardScaler()
    X = scaler.fit_transform(features[numeric_features])
    
    # Encode target
    le = LabelEncoder()
    y = le.fit_transform(features['FraudType'])
    
    # Balance dataset
    X_balanced, y_balanced = downsample_majority_class(X, y)
    
    return X_balanced, y_balanced, le, scaler

def train_improved_model(X, y):
    """
    Train model with improved parameters
    """
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    model_params = {
        'objective': 'multi:softmax',
        'num_class': len(np.unique(y)),
        'learning_rate': 0.01,
        'max_depth': 8,
        'n_estimators': 200,
        'min_child_weight': 5,
        'subsample': 0.8,
        'colsample_bytree': 0.8,
        'eval_metric': 'mlogloss',
        'early_stopping_rounds': 20,
        'random_state': 42
    }
    
    model = xgb.XGBClassifier(**model_params)
    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=False
    )
    
    # Evaluate
    y_pred = model.predict(X_test)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    return model, X_test, y_test


def save_models(model, scaler, label_encoder, base_path='models'):
    """
    Save trained model, scaler and encoder
    """
    # Create timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Create models directory if it doesn't exist
    if not os.path.exists(base_path):
        os.makedirs(base_path)
    
    # Save files with timestamp
    model_path = os.path.join(base_path, f'xgb_model_{timestamp}.joblib')
    scaler_path = os.path.join(base_path, f'scaler_{timestamp}.joblib')
    encoder_path = os.path.join(base_path, f'label_encoder_{timestamp}.joblib')
    
    # Save the objects
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    joblib.dump(label_encoder, encoder_path)
    
    print(f"Models saved in {base_path} directory")
    return model_path, scaler_path, encoder_path

def main():
    # Paths
    train_path = 'data/v3.2/train_transactions.csv'
    val_path = 'data/v3.2/validation_transactions.csv'
    accounts_path = 'data/v3.2/accounts.csv'
    balances_path = 'data/v3.2/balances.csv'
    
    # Load and preprocess data
    train_transactions, val_transactions, accounts, balances = load_and_preprocess_data(
        train_path, val_path, accounts_path, balances_path
    )
    
    # Create graph features
    train_graph_features = create_fast_graph_features(train_transactions)
    
    # Prepare balanced data
    X, y, label_encoder, scaler = prepare_model_data(
        train_transactions, accounts, balances, train_graph_features
    )
    
       # Train and evaluate model
    model, X_test, y_test = train_improved_model(X, y)
    
    # Save models
    model_path, scaler_path, encoder_path = save_models(model, scaler, label_encoder)
    
    return model, label_encoder, scaler

if __name__ == "__main__":
    model, label_encoder, scaler = main()