import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GroupShuffleSplit, RandomizedSearchCV
from sklearn.metrics import classification_report
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
import xgboost as xgb
import joblib

from feature_engineering import (add_combined_frequency_risk, add_address_risk, add_amount_risk, feature_columns)
from training import (train_frequency_model, train_amount_model, train_address_model, create_meta_features)

pd.set_option('display.max_columns', None)

# Read and preprocess data with proper dtypes
dtype_map = {
    'customer_id': str,
    'payment_intent_id': str,
    'billing_line1': str,
    'billing_city': str,
    'billing_state': str,
    'billing_postal_code': str, # force zip code to be string
    'amount': float
}

# Read and preprocess data
transactions = pd.read_csv("./sample_transactions_small.csv", dtype=dtype_map)
# convert timestamp to datetime
transactions['timestamp'] = pd.to_datetime(transactions['timestamp'], format='ISO8601')

# calculate all risk features
intervals = ['5min', '10min', '30min', '1h']
fixed_thresholds = {'5min': 3, '10min': 5, '30min': 8, '1h': 15}

#print("Columns in DataFrame:", transactions.columns.tolist())

transactions = add_combined_frequency_risk(transactions, intervals, fixed_thresholds)
transactions = add_address_risk(transactions)
transactions = add_amount_risk(transactions)

# add fraud labels based on risk factors
transactions['is_fraud'] = 0  # Start everyone at low risk

# high risk and medium risk conditions
for idx, row in transactions.iterrows():
    if row['fake_component_count'] == 4:
        transactions.at[idx, 'is_fraud'] = 2
    elif row['fake_component_count'] >= 3 and row['amount_risk_score'] >= 0.7:
        transactions.at[idx, 'is_fraud'] = 2
    elif row['amount_risk_score'] >= 0.9:
        transactions.at[idx, 'is_fraud'] = 2
    elif row['tx_count_last_1h'] >= 10:
        transactions.at[idx, 'is_fraud'] = 2
    elif row['fake_component_count'] >= 2 and row['amount_risk_score'] >= 0.7:
        transactions.at[idx, 'is_fraud'] = 1
    elif row['amount_risk_score'] >= 0.7:
        transactions.at[idx, 'is_fraud'] = 1
    elif row['tx_count_last_1h'] >= 5:
        transactions.at[idx, 'is_fraud'] = 1
    else:
        transactions.at[idx, 'is_fraud'] = 0

# Split features and target
X = transactions[feature_columns]
y = transactions['is_fraud']

X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train specialized models
freq_model, freq_features = train_frequency_model(pd.DataFrame(X_train_scaled, columns=X.columns), y_train)
amount_model, amount_features = train_amount_model(pd.DataFrame(X_train_scaled, columns=X.columns), y_train)
address_model, address_features = train_address_model(pd.DataFrame(X_train_scaled, columns=X.columns), y_train)

# Create meta-features
train_meta_features = create_meta_features(pd.DataFrame(X_train_scaled, columns=X.columns), freq_model, amount_model, address_model, freq_features, amount_features, address_features)
test_meta_features = create_meta_features(pd.DataFrame(X_test_scaled, columns=X.columns), freq_model, amount_model, address_model, freq_features, amount_features, address_features)

# Train final model
final_model = xgb.XGBClassifier(
    objective='multi:softprob',
    num_class=3,
    max_depth=4,
    learning_rate=0.1,
    n_estimators=100,
    min_child_weight=2,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)

final_model.fit(train_meta_features, y_train)

# Save models and scaler
models = {
    'scaler': scaler,
    'frequency': freq_model,
    'amount': amount_model,
    'address': address_model,
    'final': final_model,
    'scaler_features': feature_columns
}

joblib.dump(models, 'fraud_models.joblib')

y_pred_test = final_model.predict(test_meta_features)

print("\nPredicted class distribution on test set:")
print(pd.Series(y_pred_test).value_counts())

print("\nClassification report on test set:")
print(classification_report(y_test, y_pred_test, target_names=['low', 'medium', 'high']))

# --- Feature importance ---
importance = pd.DataFrame({
    'feature': train_meta_features.columns,
    'importance': final_model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nFeature Importance:")
print(importance)

# --- Save models and scaler ---
models = {
    'scaler': scaler,
    'frequency': freq_model,
    'amount': amount_model,
    'address': address_model,
    'final': final_model,
    'scaler_features': feature_columns
}

joblib.dump(models, 'fraud_models.joblib')