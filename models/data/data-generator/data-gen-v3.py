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
            # Create account lookup dict for efficiency
            self.account_lookup = {acc['AccountId']: acc for acc in self.accounts}
            self.fraud_scenarios = {
                'fraud_rings': 0.05,
                'smurfing': 0.03,
                'account_takeover': 0.02
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
                'AccountType': random.choice(account_types),
                'AccountHolderFullName': self.generate_malaysian_name(),
                'IdType': 'NRIC',
                'IdValue': self.generate_malaysian_nric(),
                'AccountHolderEmailAddress': self.generate_email(),
                'AccountHolderMobileNumber': f"60{random.randint(100000000, 999999999)}",
                'ProductType': 'Conventional',
                'ShariaCompliance': 'False',
                'ProviderType': random.choice(providers)
            }
            accounts.append(account)
        
        return accounts

    def generate_malaysian_name(self):
        """
        Generate realistic Malaysian names that respect cultural naming conventions
        across Malay, Chinese, Indian, and other ethnic groups in Malaysia.
        """
        # Malay naming conventions
        malay_first_names_male = [
            'Ahmad', 'Muhammad', 'Ali', 'Abdul', 'Mohd', 'Azman', 'Ismail', 
            'Razak', 'Hafiz', 'Hakim', 'Farid', 'Zain', 'Hassan', 'Omar'
        ]
        malay_first_names_female = [
            'Siti', 'Nur', 'Aminah', 'Fatimah', 'Zarina', 'Aisyah', 'Ramlah', 
            'Halimah', 'Mariam', 'Noraini', 'Zaleha', 'Rosmah'
        ]
        malay_last_names = [
            'Abdullah', 'Ahmad', 'Mahmood', 'Razali', 'Hassan', 'Ibrahim', 
            'Ismail', 'Yusof', 'Said', 'Ali'
        ]

        # Chinese naming conventions
        chinese_first_names_male = [
            'Ah Hock', 'Chee Keong', 'Mei Fong', 'Boon', 'Kai', 'Wei', 'Jian'
        ]
        chinese_first_names_female = [
            'Mei Ling', 'Li Hua', 'Xiu Ying', 'Jing', 'Yan', 'Hui'
        ]
        chinese_last_names = [
            'Tan', 'Lee', 'Wong', 'Chong', 'Ng', 'Lim', 'Chen', 'Ho'
        ]

        # Indian naming conventions
        indian_first_names_male = [
            'Rajesh', 'Kumar', 'Suresh', 'Ravi', 'Prakash', 'Vijay', 'Anand', 
            'Mohan', 'Srinivas'
        ]
        indian_first_names_female = [
            'Priya', 'Lakshmi', 'Deepa', 'Anita', 'Sarita', 'Indira', 'Maya'
        ]
        indian_last_names = [
            'Singh', 'Krishnan', 'Nair', 'Patel', 'Raman', 'Gopal'
        ]

        # Determine ethnic group
        ethnic_group = random.choice(['malay', 'chinese', 'indian'])

        if ethnic_group == 'malay':
            gender = random.choice(['male', 'female'])
            if gender == 'male':
                first_name = random.choice(malay_first_names_male)
                last_name = f"bin {random.choice(malay_last_names)}"
            else:
                first_name = random.choice(malay_first_names_female)
                last_name = f"binti {random.choice(malay_last_names)}"

        elif ethnic_group == 'chinese':
            gender = random.choice(['male', 'female'])
            if gender == 'male':
                first_name = random.choice(chinese_first_names_male)
            else:
                first_name = random.choice(chinese_first_names_female)
            last_name = random.choice(chinese_last_names)

        else:  # indian
            gender = random.choice(['male', 'female'])
            if gender == 'male':
                first_name = random.choice(indian_first_names_male)
            else:
                first_name = random.choice(indian_first_names_female)
            last_name = random.choice(indian_last_names)

        return f"{first_name} {last_name}"

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
                # Determine fraud type
                fraud_type = None
                if random.random() < sum(self.fraud_scenarios.values()):
                    fraud_type = random.choices(fraud_categories, 
                        weights=list(self.fraud_scenarios.values()))[0]
                
                # Select sender and receiver accounts using lookup
                sender_id = random.choice(list(self.account_lookup.keys()))
                sender = self.account_lookup[sender_id]
                
                # Select receiver excluding sender
                receiver_id = random.choice([aid for aid in self.account_lookup.keys() if aid != sender_id])
                receiver = self.account_lookup[receiver_id]
                
                # Base transaction details
                transaction_amount = round(random.uniform(10, 5000), 2)
                booking_datetime = self.generate_realistic_datetime()
                
                # Fraud-specific modifications
                if fraud_type == 'fraud_rings':
                    transaction_amount = round(random.uniform(500, 2000), 2)
                    receiver = self.find_fraud_ring_account(sender)
                elif fraud_type == 'smurfing':
                    transaction_amount = round(random.uniform(50, 500), 2)
                elif fraud_type == 'account_takeover':
                    transaction_amount = round(random.uniform(1000, 5000), 2)
                
                # Create transaction with consistent account data
                transaction = {
                    'AccountId': sender['AccountId'],
                    'AccountNumber': sender['AccountNumber'],
                    'AccountType': sender['AccountType'],
                    'PaymentScheme': 'DuitNow Transfer',
                    'CreditDebitIndicator': 'DEBIT',
                    'TransactionID': str(uuid.uuid4()),
                    'TransactionType': 'TRANSFER',
                    'CategoryPurposeCode': 'BONU',
                    'Status': 'Completed',
                    'BookingDateTime': booking_datetime,
                    'ValueDateTime': booking_datetime,
                    'TransactionAmount': transaction_amount,
                    'AccountCurrencyAmount': transaction_amount,
                    'AccountCurrency': 'MYR',
                    'CreditorAccount': {
                        'AccountId': receiver['AccountId'],
                        'AccountNumber': receiver['AccountNumber'],
                        'AccountHolderFullName': receiver['AccountHolderFullName']
                    },
                    'FraudType': fraud_type
                }
                
                transactions.append(transaction)

            # Convert to DataFrame and save both accounts and transactions
            transactions_df = pd.DataFrame(transactions)
            accounts_df = pd.DataFrame(self.accounts)
            
            return transactions_df, accounts_df

    def find_fraud_ring_account(self, sender):
        """Find an account potentially part of a fraud ring"""
        # Simple simulation: find accounts with similar characteristics
        similar_accounts = [
            a for a in self.accounts 
            if (a['AccountType'] == sender['AccountType'] and 
                a['ProviderType'] != sender['ProviderType'])
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

    def generate_balances(self):
        """Generate balances for each account"""
        balances = []
        for account in self.accounts:
            balance = {
                'AccountId': account['AccountId'],
                'AccountNumber': account['AccountNumber'],
                'AccountType': account['AccountType'],
                'AccountBalanceDateTime': self.generate_realistic_datetime(),
                'PendingBalance': round(random.uniform(0, 10000), 2),
                'AvailableBalance': round(random.uniform(0, 10000), 2),
                'AccountCurrency': 'MYR'
            }
            balances.append(balance)
        return pd.DataFrame(balances)

    def split_dataset(self, transactions_df):
        """Split dataset into train/validation/test"""
        train_size = int(0.7 * len(transactions_df))
        val_size = int(0.15 * len(transactions_df))
        
        train_df = transactions_df.iloc[:train_size]
        val_df = transactions_df.iloc[train_size:train_size+val_size]
        test_df = transactions_df.iloc[train_size+val_size:]
        
        return train_df, val_df, test_df

# Generate the dataset (keep existing code)
generator = FraudDatasetGenerator(total_transactions=250000)
transactions_df, accounts_df = generator.generate_transactions()
balances_df = generator.generate_balances()
train_df, val_df, test_df = generator.split_dataset(transactions_df)

# Get script's directory and construct paths relative to it
script_dir = os.path.dirname(os.path.abspath(__file__))
base_path = os.path.normpath(os.path.join(script_dir, "../../data/"))

# Modified path handling
try:
    version = "v3.1"
    datasets_path = os.path.join(base_path, version)
    
    print(f"Script directory: {script_dir}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Attempting to create/use directory: {datasets_path}")
    
    # Print current working directory and target path
    print(f"Current working directory: {os.getcwd()}")
    print(f"Attempting to create/use directory: {datasets_path}")
    
    # Create directory with verbose feedback
    if not os.path.exists(datasets_path):
        os.makedirs(datasets_path, exist_ok=True)
        print(f"Created directory: {datasets_path}")
    else:
        print(f"Directory already exists: {datasets_path}")

    # Define file paths
    train_path = os.path.join(datasets_path, 'train_transactions.csv')
    val_path = os.path.join(datasets_path, 'validation_transactions.csv')
    test_path = os.path.join(datasets_path, 'test_transactions.csv')
    balances_path = os.path.join(datasets_path, 'balances.csv')
    accounts_path = os.path.join(datasets_path, 'accounts.csv')

    # Save with error handling
    accounts_df.to_csv(accounts_path, index=False)
    train_df.to_csv(train_path, index=False)
    val_df.to_csv(val_path, index=False)
    test_df.to_csv(test_path, index=False)
    balances_df.to_csv(balances_path, index=False)

    # Verify all files
    for path in [accounts_path, train_path, val_path, test_path, balances_path]:
        if os.path.exists(path):
            print(f"Successfully saved: {path}")
            print(f"File size: {os.path.getsize(path)} bytes")
        else:
            print(f"Failed to save: {path}")

except Exception as e:
    print(f"Error occurred: {str(e)}")

# Print statistics (keep existing code)
print("\nDataset Generation Complete:")
print(f"Total Transactions: {len(transactions_df)}")
print(f"Train Set Size: {len(train_df)}")
print(f"Validation Set Size: {len(val_df)}")
print(f"Test Set Size: {len(test_df)}")
print(f"Total Balances: {len(balances_df)}")