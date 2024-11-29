import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
import os

# Helper functions for generating data
def generate_account_ids(num_accounts):
    return [f"A{str(i).zfill(5)}" for i in range(1, num_accounts + 1)]

def random_geolocation():
    return (random.uniform(-90, 90), random.uniform(-180, 180))

def random_ip():
    return ".".join(str(random.randint(0, 255)) for _ in range(4))

def generate_timestamps(start_date, num_days, num_records):
    start = datetime.strptime(start_date, "%Y-%m-%d")
    return [start + timedelta(seconds=random.randint(0, num_days * 24 * 3600)) for _ in range(num_records)]

# Specifications
num_transactions = 100000
num_accounts = 200
num_edges = 10000
fraud_percentage = 0.05

# Generate account data
account_ids = generate_account_ids(num_accounts)
account_data = pd.DataFrame({
    "Account ID": account_ids,
    "Account Type": np.random.choice(["personal", "business"], num_accounts, p=[0.7, 0.3]),
    "Account Age": np.random.randint(1, 3650, num_accounts),
    "KYC Status": np.random.choice([0, 1], num_accounts, p=[0.2, 0.8]),
    "Historical Fraud Involvement": np.random.choice([0, 1], num_accounts, p=[0.95, 0.05])
})

# Generate transaction data
transaction_ids = [f"T{str(i).zfill(7)}" for i in range(1, num_transactions + 1)]
timestamps = generate_timestamps("2022-01-01", 730, num_transactions)
senders = np.random.choice(account_ids, num_transactions)
receivers = np.random.choice(account_ids, num_transactions)
amounts = np.random.uniform(1, 10000, num_transactions)
is_fraud = np.random.choice([0, 1], num_transactions, p=[1 - fraud_percentage, fraud_percentage])

transaction_data = pd.DataFrame({
    "Transaction ID": transaction_ids,
    "Sender Account ID": senders,
    "Receiver Account ID": receivers,
    "Amount": amounts,
    "Timestamp": timestamps,
    "IP Address": [random_ip() for _ in range(num_transactions)],
    "Geolocation": [random_geolocation() for _ in range(num_transactions)],
    "Is Fraud": is_fraud
})

# Generate network data
edges = random.sample([(s, r) for s in account_ids for r in account_ids if s != r], num_edges)
timestamps = generate_timestamps("2022-01-01", 730, num_edges)
total_transactions = np.random.randint(1, 100, num_edges)
total_amounts = np.random.uniform(100, 50000, num_edges)
average_amounts = total_amounts / total_transactions
is_fraud_edges = np.random.choice([0, 1], num_edges, p=[1 - fraud_percentage, fraud_percentage])
community_ids = np.random.randint(1, 50, num_edges)
edge_risk_scores = np.random.uniform(0, 1, num_edges)

network_data = pd.DataFrame({
    "Source Node ID": [e[0] for e in edges],
    "Destination Node ID": [e[1] for e in edges],
    "Total_Transactions": total_transactions,
    "Total_Amount": total_amounts,
    "Average_Amount": average_amounts,
    "Last_Transaction_Time": timestamps,
    "Is_Fraud": is_fraud_edges,
    "Community_ID": community_ids,
    "Edge_Risk_Score": edge_risk_scores
})

# Save datasets
# Define the datasets path
datasets_path = "data/fraud_detection_datasets/"
version = "v1.3"
datasets_path =  os.path.join(datasets_path, version)

# Ensure the directory exists
os.makedirs(datasets_path, exist_ok=True)

# Save datasets
transaction_data.to_csv(datasets_path + "transaction_data.csv", index=False)
account_data.to_csv(datasets_path + "account_data.csv", index=False)
network_data.to_csv(datasets_path + "network_data.csv", index=False)