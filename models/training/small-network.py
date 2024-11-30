import pandas as pd
import numpy as np
import networkx as nx
import xgboost as xgb
from sklearn.model_selection import train_test_split

class SimpleFraudDetector:
    def __init__(self, embedding_dim=16):
        self.graph = None
        self.model = None
        self.network_metrics = {}

    def build_graph(self, transactions_df):
        """Build a simple directed graph from transactions"""
        self.graph = nx.DiGraph()
        
        # Add edges from transactions
        for _, row in transactions_df.iterrows():
            self.graph.add_edge(row['AccountId'], row['ToAccountId'])
        
        # Compute basic network metrics
        self.network_metrics = {
            'pagerank': nx.pagerank(self.graph),
            'in_degree': dict(self.graph.in_degree()),
            'out_degree': dict(self.graph.out_degree())
        }

    def extract_network_features(self, account_id):
        """Extract basic network features for an account"""
        return {
            'in_degree': self.network_metrics['in_degree'].get(account_id, 0),
            'out_degree': self.network_metrics['out_degree'].get(account_id, 0),
            'pagerank': self.network_metrics['pagerank'].get(account_id, 0)
        }

    def prepare_features(self, transactions_df, accounts_df):
        """Prepare features for training"""
        features = []
        labels = []

        for account_id in self.graph.nodes():
            # Extract network features
            network_features = self.extract_network_features(account_id)
            
            # Check if account was involved in fraud
            account_txns = transactions_df[
                (transactions_df['AccountId'] == account_id) | 
                (transactions_df['ToAccountId'] == account_id)
            ]
            is_fraud = account_txns['FraudType'].notna().any()

            features.append(network_features)
            labels.append(1 if is_fraud else 0)

        return np.array(features), np.array(labels)

    def train(self, features, labels):
        """Train a simple XGBoost model"""
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            features, labels, test_size=0.2, random_state=42
        )

        # Prepare XGBoost parameters
        params = {
            'objective': 'binary:logistic',
            'max_depth': 3,
            'learning_rate': 0.1
        }

        # Create DMatrix
        dtrain = xgb.DMatrix(X_train, label=y_train)
        dtest = xgb.DMatrix(X_test, label=y_test)

        # Train the model
        self.model = xgb.train(
            params, 
            dtrain, 
            num_boost_round=100,
            evals=[(dtest, 'eval')]
        )

        return self.model

def main():
    # Load data
    transactions_df = pd.read_csv('transactions.csv')
    accounts_df = pd.read_csv('accounts.csv')

    # Initialize and build graph
    detector = SimpleFraudDetector()
    detector.build_graph(transactions_df)

    # Prepare features
    features, labels = detector.prepare_features(transactions_df, accounts_df)

    # Train model
    model = detector.train(features, labels)

    print("Model training completed!")

if __name__ == "__main__":
    main()