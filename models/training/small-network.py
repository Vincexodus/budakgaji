import networkx as nx
import logging
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import xgboost as xgb
from sklearn.metrics import classification_report, confusion_matrix
from datetime import datetime
import time
from xgboost.callback import EarlyStopping

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

# 1. Load and preprocess data
def load_data():
    logger = logging.getLogger(__name__)
    logger.info("Starting data loading process")
    
    try:
        # Load CSVs
        logger.info("Loading CSV files")
        train_transactions = pd.read_csv(r'data\v3.2\train_transactions.csv')
        val_transactions = pd.read_csv(r'data\v3.2\validation_transactions.csv')
        accounts = pd.read_csv(r'data\v3.2\accounts.csv')
        balances = pd.read_csv(r'data\v3.2\balances.csv')
        
        logger.info(f"Loaded {len(train_transactions)} train transactions, "
                    f"{len(val_transactions)} validation transactions, "
                    f"{len(accounts)} accounts, {len(balances)} balances")
        
        return train_transactions, val_transactions, accounts, balances
        
    except FileNotFoundError as e:
        logger.error(f"File not found: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error loading data: {str(e)}")
        raise


# 2. Feature Engineering
def create_graph_features(transactions):
    logger = logging.getLogger(__name__)
    logger.info("Starting graph feature calculation")
    start_time = time.time()
    
    try:
        G = nx.DiGraph()
        total_rows = len(transactions)
        
        # Batch process transactions
        batch_size = 1000
        for i in range(0, total_rows, batch_size):
            batch = transactions.iloc[i:i+batch_size]
            
            for _, row in batch.iterrows():
                try:
                    from_account = row['AccountId']
                    to_account = eval(row['CreditorAccount'])['AccountId']
                    amount = row['TransactionAmount']
                    
                    if G.has_edge(from_account, to_account):
                        G[from_account][to_account]['weight'] += amount
                    else:
                        G.add_edge(from_account, to_account, weight=amount)
                except Exception as e:
                    logger.warning(f"Error processing transaction: {str(e)}")
                    continue
            
            logger.info(f"Processed {min(i+batch_size, total_rows)}/{total_rows} transactions")

        logger.info(f"Graph created with {G.number_of_nodes()} nodes and {G.number_of_edges()} edges")
        
        # Calculate features in batches
        features = {}
        nodes = list(G.nodes())
        pagerank = nx.pagerank(G)
        betweenness = nx.betweenness_centrality(G)
        
        for i, node in enumerate(nodes):
            try:
                features[node] = {
                    'in_degree': G.in_degree(node),
                    'out_degree': G.out_degree(node),
                    'pagerank': pagerank.get(node, 0),
                    'betweenness': betweenness.get(node, 0)
                }
                
                if (i + 1) % 100 == 0:
                    logger.info(f"Processed features for {i+1}/{len(nodes)} nodes")
                    
            except Exception as e:
                logger.error(f"Error calculating features for node {node}: {str(e)}")
                continue
        
        df = pd.DataFrame.from_dict(features, orient='index')
        logger.info(f"Created graph features dataframe with shape {df.shape}")
        logger.info(f"Graph feature calculation completed in {time.time() - start_time:.2f} seconds")
        return df
        
    except Exception as e:
        logger.error(f"Error in create_graph_features: {str(e)}", exc_info=True)
        raise

def prepare_features(transactions, accounts, balances, graph_features, sample_size=10000):
    """Prepare balanced dataset with fraud and non-fraud transactions"""
    
    if transactions.empty or accounts.empty or balances.empty:
        raise ValueError("Input DataFrames cannot be empty")
        
    logging.info(f"Starting feature preparation with {len(transactions)} transactions")
    
    # Split fraud and non-fraud
    fraud_transactions = transactions[transactions['FraudType'] != 'no_fraud']
    non_fraud_transactions = transactions[transactions['FraudType'] == 'no_fraud']
    
    # Validate minimum sample size
    min_sample_size = max(len(fraud_transactions), 100)  # At least 100 samples
    sample_size = max(sample_size, min_sample_size)
    
    # Calculate balanced sampling sizes
    fraud_ratio = 0.3  # 30% fraud cases
    fraud_samples = max(min(int(sample_size * fraud_ratio), len(fraud_transactions)), 1)
    non_fraud_samples = max(sample_size - fraud_samples, 1)
    
    logging.info(f"Sampling {fraud_samples} fraud and {non_fraud_samples} non-fraud transactions")
    
    try:
        # Sample with replacement if needed
        sampled_fraud = fraud_transactions.sample(
            n=fraud_samples,
            replace=len(fraud_transactions) < fraud_samples,
            random_state=42
        )
        
        sampled_non_fraud = non_fraud_transactions.sample(
            n=non_fraud_samples,
            replace=len(non_fraud_transactions) < non_fraud_samples, 
            random_state=42
        )
        
        # Combine samples
        features = pd.concat([sampled_fraud, sampled_non_fraud])
        
        # Add features
        features = features.merge(accounts, on='AccountID', how='left')
        features = features.merge(balances, on='AccountID', how='left')
        features = features.merge(graph_features, on='TransactionID', how='left')
        
        features = features.fillna(0)
        
        logging.info(f"Final features shape: {features.shape}")
        logging.info(f"Class distribution:\n{features['FraudType'].value_counts()}")
        
        return features
        
    except Exception as e:
        logging.error(f"Error in feature preparation: {str(e)}")
        raise




# 3. Model Training
def train_model(features, target, test_size=0.2):
    """
    Train XGBoost model with proper validation and error handling
    """
    # Validate inputs
    if features is None or features.empty or target is None or len(target) == 0:
        raise ValueError("Features or target data is empty")
        
    if features.shape[0] != len(target):
        raise ValueError(f"Features ({features.shape[0]} rows) and target ({len(target)} rows) must have same length")
    
    try:
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            features, 
            target, 
            test_size=test_size, 
            random_state=42,
            stratify=target  # Ensure balanced split
        )
        
        logging.info(f"Train set shape: {X_train.shape}, Test set shape: {X_test.shape}")
        logging.info(f"Class distribution in train set:\n{pd.Series(y_train).value_counts()}")
        
        # Model parameters
        model_params = {
            'objective': 'multi:softmax',
            'num_class': len(target.unique()),
            'learning_rate': 0.1,
            'max_depth': 6,
            'n_estimators': 100,
            'min_child_weight': 1,
            'subsample': 0.8,
            'colsample_bytree': 0.8,
            'eval_metric': ['mlogloss', 'merror'],
            'tree_method': 'hist',  # Faster training
            'random_state': 42
        }
        
        logging.info(f"Initializing XGBoost with parameters: {model_params}")
        
        # Initialize model
        model = xgb.XGBClassifier(**model_params)
        
        # Prepare evaluation set
        eval_set = [(X_train, y_train), (X_test, y_test)]
        
        # Train model
        model.fit(
            X_train,
            y_train,
            eval_set=eval_set,
            verbose=True,
            early_stopping_rounds=10
        )
        
        # Log training results
        logging.info("Training completed")
        logging.info(f"Best iteration: {model.best_iteration}")
        
        return model, X_test, y_test
        
    except Exception as e:
        logging.error(f"Error in model training: {str(e)}")
        raise



# Main execution
def main():
    # Load data
    train_transactions, val_transactions, accounts, balances = load_data()
    
    # Create graph features on training data
    train_graph_features = create_graph_features(train_transactions)
    
    # Prepare training features
    train_features = prepare_features(train_transactions, accounts, balances, train_graph_features)
    
    # Create graph features on validation data
    val_graph_features = create_graph_features(val_transactions)
    
    # Prepare validation features
    val_features = prepare_features(val_transactions, accounts, balances, val_graph_features)
    
    # Prepare targets
    train_target = train_features['FraudType'].fillna('no_fraud')
    val_target = val_features['FraudType'].fillna('no_fraud')
    
    # Train model
    model = train_model(train_features, train_target, val_features, val_target)
    
    return model, train_features, val_features, train_target, val_target

if __name__ == "__main__":
    model, train_features, val_features, train_target, val_target = main()