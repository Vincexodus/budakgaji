# Fraud Detection Datasets

## Data Under v1.1 to Be Used

### Description:
This section describes the datasets provided in version 1.1 of the fraud detection dataset. The data includes transaction details, account information, and network data.

#### 1. Data Structure and Relationships

##### Transaction Data Table
- **Primary Key:** `Transaction ID` (unique for each transaction)
- **Columns:**
  - `Transaction ID`: String, unique identifier for a transaction, Primary Key (PK)
  - `Sender Account ID`: String, Identifier for the sender's account, Foreign Key (FK) linked to `Account ID` in `Account Data`
  - `Receiver Account ID`: String, Identifier for the receiver's account, Foreign Key (FK) linked to `Account ID` in `Account Data`
  - `Amount`: Float, Transaction amount in currency
  - `Timestamp`: DateTime, Date and time of the transaction
  - `IP Address`: String, IP address from which the transaction was initiated
  - `Geolocation`: Tuple(Float, Float), Latitude and longitude of the transaction's origin
  - `Is Fraud`: Integer, Binary flag indicating whether the transaction is fraudulent (0: No, 1: Yes)

##### Account Data Table
- **Primary Key:** `Account ID` (unique for each account)
- **Columns:**
  - `Account ID`: String, Identifier for an account (personal or business), Primary Key (PK)
  - `Account Type`: String, Type of account
  - `Account Age`: Integer, Number of days since the account was created
  - `KYC Status`: Integer, Whether the account has passed KYC checks (0: No, 1: Yes)
  - `Historical Fraud Involvement`: Integer, Indicates if the account was involved in fraudulent transactions (0: No, 1: Yes)

##### Network Data Table
- **Primary Key:** Combination of `Source Node ID`, `Destination Node ID`, and `Timestamp`
- **Columns:**
  - `Source Node ID`: String, Sender account ID (links to `Account Data`)
  - `Destination Node ID`: String, Receiver account ID (links to `Account Data`)
  - `Total Transactions`: Integer, Number of transactions between the sender and receiver accounts
  - `Total Amount`: Float, Cumulative amount transferred between the sender and receiver accounts
  - `Average Amount`: Float, Average transaction amount between the sender and receiver accounts
  - `Last Transaction Time`: DateTime, Timestamp of the most recent transaction between the accounts
  - `Is Fraud`: Integer, Binary indicator if any transaction in the relationship is fraudulent (0/1)
  - `Community_ID`: Integer, ID of the community/cluster the sender account belongs to
  - `Edge_Risk_Score`: Float, Computed risk score for the relationship based on graph features

#### 2. Data Constraints

- **Primary Key Constraints:**
  - Each combination of `Transaction ID`, `Account ID`, and `(Source Node ID, Destination Node ID, Timestamp)` must be unique.

- **Foreign Key Constraints:**
  - `Sender Account ID` and `Receiver Account ID` in the `Transaction Data` table must match `Account ID` in the `Account Data` table.

- **Null Constraints:**
  - Critical fields like `Transaction ID`, `Amount`, `Timestamp`, `Sender Account ID`, and `Receiver Account ID` must not contain null values.

- **Unique Constraints:**
  - Each combination of `Source Node ID`, `Destination Node ID`, and `Timestamp` in the `Network Data` table must be unique.

#### 3. Dataset Specifications

- **Size:**
  - 100,000 transactions in the `Transaction Data` table
  - 200 unique accounts in the `Account Data` table
  - Network graph with 200 nodes and 10,000 edges in the `Network Data` table

- **Fraudulent Cases:**
  - At least 5% of transactions should be labeled as fraud (Is Fraud = 1)
  - Fraudulent transactions should involve suspicious account behaviors or connections (e.g., smurfing, fraud rings)

- **Risk Distribution Reflection:**

  ##### High Risk Users (10):
  - `Transaction Data Table`: High fraud involvement (Is Fraud = 1) in their transactions, unusual patterns in Amount, Timestamp, IP Address, and Geolocation
  - `Account Data Table`: Likely new accounts, incomplete KYC, or previous fraud involvement (Historical Fraud Involvement = 1)
  - `Network Data Table`: Higher Edge_Risk_Score, clustered in high-risk Community_ID, elevated Total_Transactions or Total_Amount

  ##### Medium Risk Users (10):
  - `Transaction Data Table`: Mixed fraudulent and legitimate transactions, with suspicious Amount and Timestamp patterns
  - `Account Data Table`: Might have completed KYC but show moderate risk in transaction behaviors
  - `Network Data Table`: Moderate Edge_Risk_Score, some clustering, and variability in interaction frequency or transaction size

  ##### Low Risk Users (180):
  - `Transaction Data Table`: Few to no flagged transactions, consistent and low-risk patterns in Amount and Geolocation
  - `Account Data Table`: Older accounts with completed KYC and no historical fraud involvement
  - `Network Data Table`: Low Edge_Risk_Score, dispersed Community_ID, low-volume interactions with stable averages

#### 4. Data Format

- Tabular data format for `Transaction Data` and `Account Data` (CSV or Parquet)
- Edge list or JSON format for `Network Data`, compatible with graph databases like Neo4j

#### 5. Additional Requirements

- Ensure realistic patterns in fraud detection, such as:
  - Transactions split into smaller amounts (smurfing)
  - High-frequency transactions between certain accounts (fraud rings)
  - Suspiciously high-risk scores on specific edges in the graph
- Data must be free from duplicates, logically consistent, and scalable for real-time fraud detection use cases.