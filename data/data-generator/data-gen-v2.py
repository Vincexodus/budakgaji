import pandas as pd
import numpy as np
import uuid
from datetime import datetime, timedelta
import random
import os

class FraudDatasetGenerator:
    def __init__(self, total_transactions=250000, seed=42):
        np.random.seed(seed)
        self.total_transactions = total_transactions
        self.accounts = self.generate_accounts()
        self.fraud_scenarios = {
            'fraud_rings': 0.05,  # 5% of transactions
            'smurfing': 0.03,     # 3% of transactions
            'account_takeover': 0.02  # 2% of transactions
        }

    def generate_accounts(self):
        """Generate a pool of realistic Malaysian bank accounts"""
        account_types = ['Savings', 'E-Wallet (Individual)']
        providers = ['Maybank', 'CIMB', 'Public Bank', 'RHB Bank', 'Touch n Go', "HSBC Bank", "Alliance Bank"]
        
        accounts = []
        for _ in range(5000):  # Generate 5000 unique accounts
            account_id = str(uuid.uuid4())[:12].upper()
            account_number = f"{random.randint(10, 99)}{''.join([str(random.randint(0,9)) for _ in range(9)])}"
            
            account = {
                'AccountId': account_id,
                'AccountNumber': account_number,
                'AccountCategory': 'Personal',
                'AccountTypeCode': random.choice(account_types),
                'ProductType': 'Conventional',
                'ShariaCompliance': 'False',
                'ProviderType': 'Bank' if 'Bank' in providers else 'E-wallet',
                'AccountHolder': {
                    'AccountHolderFullName': self.generate_malaysian_name(),
                    'AccountHolderEmail': self.generate_email(),
                    'Identification': {
                        'SchemeName': 'NRIC',
                        'Identification': self.generate_malaysian_nric()
                    }
                },
                'Provider': random.choice(providers)
            }
            accounts.append(account)
        
        return accounts

    def generate_malaysian_name(self):
        """Generate realistic Malaysian names"""
        first_names = ['Ahmad', 'Muhammad', 'Ali', 'Siti', 'Nur', 'Aminah', 
                       'Lee', 'Tan', 'Wong', 'Chong', 'Ng', 'Lim', 
                       'Rajesh', 'Priya', 'Kumar']
        last_names = ['bin Abdullah', 'binti Mahmood', 'Tan', 'Lee', 'Wong', 
                      'Singh', 'Krishnan', 'Chen']
        return f"{random.choice(first_names)} {random.choice(last_names)}"

    def generate_email(self):
        """Generate realistic email addresses"""
        domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
        name_part = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=8))
        return f"{name_part}@{random.choice(domains)}"

    def generate_malaysian_nric(self):
        """Generate a realistic Malaysian NRIC number"""
        year = str(random.randint(50, 99))  # Birth years from 1950-1999
        month = f"{random.randint(1, 12):02d}"
        day = f"{random.randint(1, 28):02d}"
        unique = f"{random.randint(1000, 9999)}"
        return f"{year}{month}{day}-{unique}"

    def generate_transactions(self):
        """Generate transactions with fraud scenarios"""
        transactions = []
        fraud_categories = list(self.fraud_scenarios.keys())
        
        for _ in range(self.total_transactions):
            # Determine if this transaction is fraudulent
            fraud_type = None
            if random.random() < sum(self.fraud_scenarios.values()):
                fraud_type = random.choices(fraud_categories, 
                    weights=list(self.fraud_scenarios.values()))[0]
            
            # Select sender and receiver accounts
            sender = random.choice(self.accounts)
            receiver = random.choice([a for a in self.accounts if a != sender])
            
            # Base transaction details
            transaction_amount = round(random.uniform(10, 5000), 2)
            booking_datetime = self.generate_realistic_datetime()
            
            # Fraud-specific modifications
            if fraud_type == 'fraud_rings':
                # Coordinated transfers between linked suspicious accounts
                transaction_amount = round(random.uniform(500, 2000), 2)
                receiver = self.find_fraud_ring_account(sender)
            elif fraud_type == 'smurfing':
                # Break large amount into smaller transfers
                transaction_amount = round(random.uniform(50, 500), 2)
            elif fraud_type == 'account_takeover':
                # Unusual transfer behavior
                transaction_amount = round(random.uniform(1000, 5000), 2)
            
            transaction = {
                'AccountId': sender['AccountId'],
                'AccountNumber': sender['AccountNumber'],
                'AccountType': sender['AccountTypeCode'],
                'PaymentScheme': 'DuitNow Transfer',
                'CreditDebitIndicator': 'DEBIT',
                'TransactionID': str(uuid.uuid4()),
                'CategoryPurposeCode': 'BONU',
                'Status': 'Completed',
                'BookingDateTime': booking_datetime,
                'ValueDateTime': booking_datetime,
                'TransactionAmount': transaction_amount,
                'AccountCurrencyAmount': transaction_amount,
                'AccountCurrency': 'MYR',
                'CreditorAccount': {
                    'Identification': receiver['AccountNumber'],
                    'Name': receiver['AccountHolder']['AccountHolderFullName']
                },
                'FraudType': fraud_type
            }
            
            transactions.append(transaction)
        
        return pd.DataFrame(transactions)

    def find_fraud_ring_account(self, sender):
        """Find an account potentially part of a fraud ring"""
        # Simple simulation: find accounts with similar characteristics
        similar_accounts = [
            a for a in self.accounts 
            if (a['AccountTypeCode'] == sender['AccountTypeCode'] and 
                a['Provider'] != sender['Provider'])
        ]
        return random.choice(similar_accounts) if similar_accounts else sender

    def generate_realistic_datetime(self):
        """Generate a realistic datetime within recent years"""
        start = datetime(2020, 1, 1)
        end = datetime(2024, 1, 1)
        time_between_dates = end - start
        days_between_dates = time_between_dates.days
        random_number_of_days = random.randrange(days_between_dates)
        random_date = start + timedelta(days=random_number_of_days)
        return random_date.strftime('%Y-%m-%dT%H:%M:%S+00:00')

    def split_dataset(self, transactions_df):
        """Split dataset into train/validation/test"""
        train_size = int(0.7 * len(transactions_df))
        val_size = int(0.15 * len(transactions_df))
        
        train_df = transactions_df.iloc[:train_size]
        val_df = transactions_df.iloc[train_size:train_size+val_size]
        test_df = transactions_df.iloc[train_size+val_size:]
        
        return train_df, val_df, test_df

# Generate the dataset
generator = FraudDatasetGenerator(total_transactions=250000)
transactions_df = generator.generate_transactions()

# Split the dataset
train_df, val_df, test_df = generator.split_dataset(transactions_df)

# Save datasets
# Define the datasets path
datasets_path = "/models/data/"
version = "v2.0"
datasets_path = os.path.join(datasets_path, version)

# Ensure the directory exists
os.makedirs(datasets_path, exist_ok=True)

# Save datasets
train_df.to_csv(os.path.join(datasets_path, 'train_transactions.csv'), index=False)
val_df.to_csv(os.path.join(datasets_path, 'validation_transactions.csv'), index=False)
test_df.to_csv(os.path.join(datasets_path, 'test_transactions.csv'), index=False)

# Print some statistics
print("Dataset Generation Complete:")
print(f"Total Transactions: {len(transactions_df)}")
print(f"Train Set Size: {len(train_df)}")
print(f"Validation Set Size: {len(val_df)}")
print(f"Test Set Size: {len(test_df)}")