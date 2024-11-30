# import pandas as pd
# from catboost import CatBoostRegressor, Pool
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import mean_squared_error

# # Load datasets
# balances = pd.read_csv('data\v3.2\balances.csv')
# accounts = pd.read_csv('data\v3.2\accounts.csv')
# transactions = pd.read_csv('data\v3.2\train_transactions.csv')
# test_data = pd.read_csv('data\v3.2\test_transactions.csv')
# validation_data = pd.read_csv('data\v3.2\validation_transactions.csv')

# # Merge datasets
# data = transactions.merge(accounts, on='AccountId', how='left')
# data = data.merge(balances, on='AccountId', how='left')

# # Feature engineering
# data['TransactionDateTime'] = pd.to_datetime(data['TransactionDateTime'])
# data['AccountBalanceDateTime'] = pd.to_datetime(data['AccountBalanceDateTime'])
# data['TransactionAmount'] = data['TransactionAmount'].astype(float)
# data['PendingBalance'] = data['PendingBalance'].astype(float)
# data['AvailableBalance'] = data['AvailableBalance'].astype(float)

# # Create features
# data['TransactionHour'] = data['TransactionDateTime'].dt.hour
# data['TransactionDay'] = data['TransactionDateTime'].dt.day
# data['TransactionMonth'] = data['TransactionDateTime'].dt.month
# data['TransactionYear'] = data['TransactionDateTime'].dt.year
# data['BalanceDifference'] = data['AvailableBalance'] - data['PendingBalance']

# # Drop unnecessary columns
# data = data.drop(['TransactionDateTime', 'AccountBalanceDateTime', 'AccountId', 'AccountNumber', 'AccountHolderFullName', 'IdType', 'IdValue', 'AccountHolderEmailAddress', 'AccountHolderMobileNumber'], axis=1)

# # Handle missing values
# data = data.fillna(0)

# # Define target and features
# target = 'BehaviorScore'
# features = data.drop(target, axis=1).columns

# # Train-test split
# X_train, X_test, y_train, y_test = train_test_split(data[features], data[target], test_size=0.2, random_state=42)

# # Create CatBoost Pool
# train_pool = Pool(X_train, y_train)
# test_pool = Pool(X_test, y_test)

# # Define and train the model
# model = CatBoostRegressor(
#     iterations=1000,
#     learning_rate=0.05,
#     depth=6,
#     eval_metric='RMSE',
#     random_seed=42,
#     use_best_model=True,
#     task_type='GPU'  # Use GPU acceleration
# )

# model.fit(train_pool, eval_set=test_pool, early_stopping_rounds=100, verbose=100)

# # Predict and evaluate
# y_pred = model.predict(test_pool)
# rmse = mean_squared_error(y_test, y_pred, squared=False)
# print(f'RMSE: {rmse}')