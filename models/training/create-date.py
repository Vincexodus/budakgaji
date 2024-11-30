import pandas as pd
import random
from datetime import datetime, timedelta

# Read the CSV
df = pd.read_csv(r'data\v3.2\accounts.csv')

# Define date ranges
ewallet_start = datetime(2021, 1, 1)  # E-wallets more recent
savings_start = datetime(2020, 1, 1)  # Savings accounts can be older
end_date = datetime(2023, 12, 31)

def generate_random_date(account_type):
    start = ewallet_start if 'E-Wallet' in account_type else savings_start
    days_between = (end_date - start).days
    random_days = random.randint(0, days_between)
    return start + timedelta(days=random_days)

# Generate CreatedDate based on AccountType
df['CreatedDate'] = df['AccountType'].apply(generate_random_date)

# Sort by CreatedDate for better readability
df = df.sort_values('CreatedDate')

# Save back to CSV
df.to_csv(r'data\v3.2\accounts.csv', index=False)

print("Sample of generated dates:")
print(df[['AccountId', 'AccountType', 'CreatedDate']].head())