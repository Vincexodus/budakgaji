import pandas as pd
import numpy as np
import networkx as nx
import node2vec
from gensim.models import Word2Vec
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.utils import resample
import optuna
import ast
import logging
import json
import os

class GraphModel:
    def __init__(self, embedding_dim=16):
        # Initialize basic attributes
        self.embedding_dim = embedding_dim
        self.graph = None
        self.model = None
        self.node_embeddings = None
        self.account_map = {}
        self.feature_matrix = None  # Store feature matrix for later use


    def build_graph(self, transactions_df):
            """Build directed graph from transaction data with cached metrics"""
            self.graph = nx.DiGraph()
            
            # Add edges from transactions
            for _, row in transactions_df.iterrows():
                self.graph.add_edge(row['AccountId'], row['ToAccountId'])
            
            # Pre-compute and cache network metrics for better performance
            logging.info("Pre-computing network metrics...")
            self.cached_metrics = {
                'pagerank': nx.pagerank(self.graph),
                'betweenness': nx.betweenness_centrality(self.graph),
            }
            logging.info("Network metrics computed successfully")

    def get_network_features(self, account_id):
        """Extract network features with proper error handling"""
        try:
            network_features = {
                'in_degree': float(self.graph.in_degree(account_id) or 0),
                'out_degree': float(self.graph.out_degree(account_id) or 0),
                'total_degree': float(self.graph.degree(account_id) or 0),
                'pagerank': float(self.cached_metrics['pagerank'].get(account_id, 0)),
                'betweenness': float(self.cached_metrics['betweenness'].get(account_id, 0))
            }
            
            # Ensure all values are scalar floats
            for k, v in network_features.items():
                if not np.isscalar(v):
                    network_features[k] = 0.0
                    
            return network_features
            
        except Exception as e:
            logging.error(f"Error computing network features for {account_id}: {str(e)}")
            return {
                'in_degree': 0.0,
                'out_degree': 0.0,
                'total_degree': 0.0,
                'pagerank': 0.0,
                'betweenness': 0.0
            }

    
    def generate_embeddings(self):
        """Generate node2vec embeddings for graph nodes"""
        try:
            # Convert node IDs to strings for node2vec
            for n in self.graph.nodes():
                self.graph.nodes[n]['id'] = str(n)
            
            # Initialize node2vec with reasonable parameters
            node2vec_model = node2vec.Node2Vec(
                self.graph,
                dimensions=self.embedding_dim,
                walk_length=5,
                num_walks=3,  # Reduced for MVP
                workers=4,
                p=1,
                q=1
            )
            
            model = node2vec_model.fit(window=3, min_count=1, epochs=1)
            
            # Safely store embeddings
            self.node_embeddings = {}
            for node in self.graph.nodes():
                try:
                    self.node_embeddings[node] = model.wv[str(node)]
                except KeyError:
                    logging.warning(f"No embedding found for node {node}")
                    self.node_embeddings[node] = np.zeros(self.embedding_dim)
                    
        except Exception as e:
            logging.error(f"Error generating embeddings: {str(e)}")
            self.node_embeddings = None


    def get_node_features(self, account_id, accounts_df, balances_df):
        """Extract account, balance and network features"""
        try:
            # Account features
            account_info = accounts_df[accounts_df['AccountId'] == account_id].iloc[0]
            account_features = {
                'account_type': float(account_info.get('AccountType') == 'E-Wallet (Individual)'),
                'account_age_days': float((pd.Timestamp.now() - pd.to_datetime(account_info['CreatedDate'])).days)
            }

            # Balance features 
            balances = balances_df[balances_df['AccountId'] == account_id]
            balance_features = {
                'avg_balance': float(balances['AvailableBalance'].fillna(0).mean()),
                'balance_std': float(balances['AvailableBalance'].fillna(0).std()),
                'pending_ratio': float(balances['PendingBalance'].fillna(0).sum() / 
                                    max(balances['AvailableBalance'].fillna(0).sum(), 1))
            }

            # Network features
            network_features = self.get_network_features(account_id)

            # Combine all features
            features = {**account_features, **balance_features, **network_features}

            # Add embeddings if available
            if self.node_embeddings and account_id in self.node_embeddings:
                embedding = self.node_embeddings[account_id]
                for i, value in enumerate(embedding):
                    features[f'embedding_{i}'] = float(value)
            else:
                for i in range(self.embedding_dim):
                    features[f'embedding_{i}'] = 0.0

            return features

        except Exception as e:
            logging.error(f"Error extracting features for {account_id}: {str(e)}")
            # Return default features for graceful failure
            default_features = {
                'account_type': 0.0,
                'account_age_days': 0.0,
                'avg_balance': 0.0,
                'balance_std': 0.0,
                'pending_ratio': 0.0,
                'in_degree': 0.0,
                'out_degree': 0.0,
                'total_degree': 0.0,
                'pagerank': 0.0,
                'betweenness': 0.0
            }
            # Add zero embeddings
            for i in range(self.embedding_dim):
                default_features[f'embedding_{i}'] = 0.0
            return default_features
        
    def train_model(self, features, labels, validation_df=None):
        try:
            # Undersample the majority class
            features_df = pd.DataFrame(features)
            
            # Separate majority and minority classes
            features_majority = features_df[labels == 0]
            labels_majority = labels[labels == 0]
            features_minority = features_df[labels == 1]
            labels_minority = labels[labels == 1]
            
            # Undersample majority class
            features_majority_downsampled = resample(
                features_majority, 
                replace=False,    # sample without replacement
                n_samples=len(features_minority) * 5,  # sample to have 5x minority class
                random_state=42   # reproducible results
            )
            labels_majority_downsampled = resample(
                labels_majority, 
                replace=False,    # sample without replacement
                n_samples=len(features_minority) * 5,  # sample to have 5x minority class
                random_state=42   # reproducible results
            )
            
            # Combine minority and downsampled majority classes
            features_resampled = pd.concat([features_majority_downsampled, features_minority])
            labels_resampled = np.concatenate([labels_majority_downsampled, labels_minority])
            
            # Log class distribution after resampling
            logging.info(f"Resampled class distribution: {np.bincount(labels_resampled)}")
            
            # Prepare DMatrix
            dtrain = xgb.DMatrix(features_resampled, label=labels_resampled)
            
            # Prepare validation data if provided
            evals = [(dtrain, 'train')]
            if validation_df is not None:
                # Process validation same as before
                validation_features = []
                validation_labels = []
                
                for _, row in validation_df.iterrows():
                    try:
                        val_features = self.get_node_features(
                            row['AccountId'], 
                            accounts_df, 
                            balances_df
                        )
                        if val_features:
                            validation_features.append(val_features)
                            is_fraud = pd.notna(row.get('FraudType'))
                            validation_labels.append(1 if is_fraud else 0)
                    except Exception as e:
                        continue

                val_feature_matrix = pd.DataFrame(validation_features)
                y_val = np.array(validation_labels)
                logging.info(f"Validation class distribution: {np.bincount(y_val)}")
                
                dvalid = xgb.DMatrix(val_feature_matrix, label=y_val)
                evals.append((dvalid, 'validation'))

            # Improved parameters for balanced data
            best_params = {
                'max_depth': 3,
                'learning_rate': 0.3,
                'objective': 'binary:logistic',
                'eval_metric': ['auc', 'error'],
                # 'scale_pos_weight': 1,  # Since we've balanced the dataset
                # 'min_child_weight': 1,
                'subsample': 0.8,
                'colsample_bytree': 0.8,
                'verbosity': 2
            }

            # Train the model
            self.model = xgb.train(
                params=best_params,
                dtrain=dtrain,
                num_boost_round=20,  # Increased rounds
                evals=evals,
                early_stopping_rounds=50,  # Increased patience
                verbose_eval=True
            )

            # Store feature matrix for later use
            self.feature_matrix = features_resampled

            return True

        except Exception as e:
            logging.error(f"Error in model training: {str(e)}")
            return False

    def save_model(self, filename):
        """Save model and feature info for inference"""
        try:
            # Create models directory if not exists
            os.makedirs('models', exist_ok=True)
            
            # Save XGBoost model
            model_path = f"models/{filename}.json"
            self.model.save_model(model_path)
            
            # Save feature info
            feature_info = {
                'embedding_dim': self.embedding_dim,
                'feature_names': list(self.feature_matrix.columns) if self.feature_matrix is not None else None
            }
            
            with open(f"models/{filename}_features.json", 'w') as f:
                json.dump(feature_info, f)
                
            logging.info(f"Model saved to {model_path}")
            return True
        except Exception as e:
            logging.error(f"Error saving model: {str(e)}")
            return False

def load_data(data_path="data/v3.2/"):
    """Load data with error handling"""
    try:
        transactions_df = pd.read_csv(f"{data_path}train_transactions.csv")
        balances_df = pd.read_csv(f"{data_path}balances.csv")
        accounts_df = pd.read_csv(f"{data_path}accounts.csv")
        
        return transactions_df, balances_df, accounts_df
    except Exception as e:
        logging.error(f"Error loading data: {str(e)}")
        return None, None, None
    
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    try:
        model = GraphModel(embedding_dim=16)
        
        logging.info("Loading data...")
        transactions_df, balances_df, accounts_df = load_data()
        validation_df = pd.read_csv(r'data\v3.2\validation_transactions.csv')

        # Validate DataFrames
        if any(df is None or df.empty for df in [transactions_df, balances_df, accounts_df]):
            logging.error("Failed to load required data")
            exit(1)

        # Parse CreditorAccount JSON strings to get recipient AccountIds
        logging.info("Processing transaction data...")
        transactions_df['ToAccountId'] = transactions_df['CreditorAccount'].apply(
            lambda x: ast.literal_eval(x)['AccountId'] if pd.notna(x) else None
        )

        logging.info("Building graph...")
        model.build_graph(transactions_df)
        
        logging.info("Generating embeddings...")
        model.generate_embeddings()

        logging.info("Extracting features...")
        features = []
        labels = []
        

        if not features:
            logging.error("No valid features extracted")
            exit(1)

        # Create feature matrix 
        feature_matrix = pd.DataFrame(features)
        labels = np.array(labels)

        # Diagnostics before training
        logging.info(f"Feature matrix shape: {feature_matrix.shape}")
        logging.info(f"Labels shape: {labels.shape}")
        logging.info(f"Original class distribution: {np.bincount(labels)}")

        # Train model with undersampling
        if model.train_model(features, labels, validation_df=validation_df):
            logging.info("Saving model...")
            model.save_model("fraud_detection_model_undersampled")
        else:
            logging.error("Model training failed")
            exit(1)
            
    except Exception as e:
        logging.error(f"Error in main execution: {str(e)}")
        exit(1)