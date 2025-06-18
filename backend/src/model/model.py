import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt 
from sklearn.metrics import (
    confusion_matrix,
    ConfusionMatrixDisplay, 
    roc_curve,
    roc_auc_score,
    precision_recall_curve,
    average_precision_score
)
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split,RandomizedSearchCV 
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
from xgboost import XGBClassifier

# load csv
transactions_raw = pd.read_csv("D:\\programming\\projects\\sentinel-ai\\backend\\sample_transactions.csv")
transactions_fe = transactions_raw.copy()

# convert timestamps
transactions_fe['timestamp'] = pd.to_datetime(transactions_fe['timestamp'])

# create transaction count per customer per interval
transactions_fe["5min"] = transactions_fe["timestamp"].dt.floor('5min')
transactions_fe['tx_count_last_5_min'] = transactions_fe.groupby(['customer_id', '5min'])['timestamp'].transform("count")
transactions_fe['avg_5min'] = np.floor(transactions_fe.groupby('customer_id')['tx_count_last_5_min'].transform('mean'))

transactions_fe["10min"] = transactions_fe["timestamp"].dt.floor('10min')
transactions_fe['tx_count_last_10_min'] = transactions_fe.groupby(['customer_id', '10min'])['timestamp'].transform("count")
transactions_fe['avg_10min'] = np.floor(transactions_fe.groupby('customer_id')['tx_count_last_10_min'].transform('mean'))

transactions_fe["30min"] = transactions_fe["timestamp"].dt.floor('30min')
transactions_fe['tx_count_last_30_min'] = transactions_fe.groupby(['customer_id', '30min'])['timestamp'].transform("count")
transactions_fe['avg_30min'] = np.floor(transactions_fe.groupby('customer_id')['tx_count_last_30_min'].transform('mean'))

transactions_fe['hour'] = transactions_fe['timestamp'].dt.floor('h')  
transactions_fe['tx_count_last_hour'] = transactions_fe.groupby(['customer_id', 'hour'])['timestamp'].transform("count")
transactions_fe['avg_hour'] = np.floor(transactions_fe.groupby('customer_id')['tx_count_last_hour'].transform('mean'))
#print(transactions_fe.head())

def risk_level_per_interval_transaction(count, avg, weighted=3): 
    if count > avg * weighted:
        return 0.8  # High risk
    elif count > avg:
        return 0.5  # Medium risk
    else:
        return 0.2  # Low risk
    
transactions_fe['risk_level_5_min'] = transactions_fe.apply(lambda row: risk_level_per_interval_transaction(row['tx_count_last_5_min'], row['avg_5min']), axis=1 )
transactions_fe['risk_level_10_min'] = transactions_fe.apply(lambda row: risk_level_per_interval_transaction(row['tx_count_last_10_min'], row['avg_10min']), axis=1 )
transactions_fe['risk_level_30_min'] = transactions_fe.apply(lambda row: risk_level_per_interval_transaction(row['tx_count_last_30_min'], row['avg_30min']), axis=1 )
transactions_fe['risk_level_hour'] = transactions_fe.apply(lambda row: risk_level_per_interval_transaction(row['tx_count_last_5_min'], row['avg_hour']), axis=1 )
print(transactions_fe[transactions_fe['risk_level_5_min'] > 0.5])

    


# # count failed payments per customer per hour (failed payments heuristic)
# failed_payments = transactions[transactions['status'] == 'failed']
# failed_count = failed_payments.groupby(['customer_id', 'hour']).size().reset_index(name='failed_count')
# transactions = transactions.merge(failed_count, on=['customer_id', 'hour'], how='left')
# transactions['failed_count'] = transactions['failed_count'].fillna(0)


# def amount_risk(amount):
#     if amount > 1000:
#         return 1.0
#     elif amount > 500:
#         return 0.5
#     else:
#         return 0.1

# def frequency_risk(tx_count):
#     if tx_count > 5:
#         return 'high'
#     elif tx_count > 2:
#         return 'medium'
#     else:
#         return 'low'
    
# def failed_payment_risk(failed_count, amount):
#     if failed_count >= 2 and amount > 500:
#         return 'high'
#     elif failed_count >= 1:
#         return 'medium'
#     else:
#         return 'low'

# def location_risk(city, street, postal_code):
#     fake_street_addresses = ['123 Fake Street, Faketown', 'PO Box 4567', '0 Null Avenue', '999 Unknown Blvd', '321 Imaginary Rd']
#     fake_cities = ['Faketown', 'Anytown', 'Nowhere', 'Mystery', 'Fakesville']
#     fake_postals = ['99999', '12345','00000' ] 

#     if (city in fake_cities) or (street in fake_street_addresses) or (postal_code in fake_postals):
#         return 'high'
#     else:
#         return 'low'


# transactions['amount_risk'] = transactions['amount'].apply(amount_risk)
# transactions['frequency_risk'] = transactions['transaction_count'].apply(frequency_risk)
# transactions['failed_risk'] = transactions.apply(lambda x: failed_payment_risk(x['failed_count'], x['amount']), axis=1)
# transactions['location_risk'] = transactions.apply(lambda row: location_risk(row['billing_city'], row['billing_line1'], str(row['billing_postal_code'])), axis=1)

# def combined_risk(row):
#     risks = [row['amount_risk'], row['frequency_risk'], row['failed_risk'], row['location_risk']]
#     if 'high' in risks:
#         return 'high'
#     elif 'medium' in risks:
#         return 'medium'
#     else:
#         return 'low'

# transactions['risk_level'] = transactions.apply(combined_risk, axis=1)

# #transactions.to_csv('full_transactions_processed.csv', index=False)

# transactions_train = transactions[transactions["risk_level"] != "medium"].copy()
# transactions_train["amount_risk"] = transactions_train["amount_risk"].apply(lambda row: 1 if row == "high" else 0)
# transactions_train["frequency_risk"] = transactions_train["frequency_risk"].apply(lambda row: 1 if row == "high" else 0)
# transactions_train["location_risk"] = transactions_train["location_risk"].apply(lambda row: 1 if row == "high" else 0)
# transactions_train["failed_risk"] = transactions_train["failed_risk"].apply(lambda row: 1 if row == "high" else 0)
# transactions_train["is_fraud"] = transactions_train["risk_level"].apply(lambda row: 1 if row == "high" else 0)

# #print(transactions_train.head())

# X = transactions_train[["amount_risk", "frequency_risk", "location_risk", "failed_risk"]]
# y = transactions_train["is_fraud"]

# X_train, X_test, y_train, y_test = train_test_split(X, y ,test_size=0.2, random_state=42)

# smote = SMOTE(random_state=42, sampling_strategy=1.0)

# X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# lr = LogisticRegression()
# lr.fit(X_train_resampled, y_train_resampled)

# y_pred = lr.predict(X_test)

# print(confusion_matrix(y_test, y_pred))

# encode categorical columns - 
# converting columns that contain strings into numeerical inputs for the model to read
#df = pd.get_dummies(transactions, columns=["city", "state"], drop_first=True)



# drop non-numeric and irrelevant columns
#columns_to_drop = ['stripe_id', 'user_id', 'created', 'is_fraud']
#print(columns_to_drop)
#features_to_scale = df.drop(columns=columns_to_drop)


#splitting data
#X = df.drop(['is_fraud','stripe_id', 'user_id', 'created'], axis=1) # all columns that do not contain numeric values
#y = df['is_fraud'] # Class columns which contains fraud values

#Scale features
# scaler = StandardScaler()
# scaled_array = scaler.fit_transform(features_to_scale)
# df_scaled = pd.DataFrame(scaled_array, columns=features_to_scale.columns)

# Split data into test and training samples
#X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

# Applying SMOTE on training data
#smote = SMOTE(random_state=42, sampling_strategy=1.0)
#X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# sample for faster tuning
#X_sample,_,y_sample,_ = train_test_split(X_train_resampled, y_train_resampled, train_size=0.3, random_state=42)


# hyperparameter grid for xboost
# param_dist = {
#     'n_estimators': [50, 100],
#     'max_depth': [3, 6, 10],
#     'learning_rate': [0.01, 0.1, 0.2],
#     'subsample': [0.8, 1.0],
#     'colsample_bytree': [0.8, 1.0],
#     'scale_pos_weight': [10]
# }

# xgb = XGBClassifier( eval_metric='logloss', random_state=42)
# random_search = RandomizedSearchCV(
#     XGBClassifier(random_state=42), 
#     param_distributions=param_dist, 
#     n_iter=5, 
#     scoring='recall',
#     refit= True, 
#     verbose = 1, 
#     n_jobs= 1, 
#     cv=2
#     )

#fit model for grid search
#random_search.fit(X_sample, y_sample)

#print best parameter after tuning
#print("Best parameters:", random_search.best_params_)

#Retrain final model on full resampled data
#final_model = XGBClassifier(**random_search.best_params_, eval_metric='logloss', random_state=42)
#final_model.fit(X_train_resampled, y_train_resampled)

# print classification
#y_pred_proba = final_model.predict_proba(X_test)[:, 1]
#y_pred = (y_pred_proba > 0.3).astype(int)
#print(classification_report(y_test, y_pred))

# joblib.dump(model, 'fraud_model_smote.pkl')
#joblib.dump(final_model, 'xgboost_fraud_model_optimized.pkl')