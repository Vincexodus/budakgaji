# random_forest.py
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from cuml.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# Create a synthetic dataset
def create_dataset(n_samples=1000):
    np.random.seed(42)
    X = np.random.rand(n_samples, 10)
    y = np.random.randint(0, 2, n_samples)
    return X, y

# Load dataset
X, y = create_dataset()

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize the Random Forest classifier with cuML
clf = RandomForestClassifier(n_estimators=100, random_state=42)

# Train the model
clf.fit(X_train, y_train)

# Make predictions
y_pred = clf.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)

print(f"Accuracy: {accuracy:.2f}")
print("Classification Report:")
print(report)