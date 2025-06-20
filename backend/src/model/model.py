import pandas as pd
import numpy as np
import re
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

pd.set_option('display.max_columns', None)

# load csv
transactions_raw = pd.read_csv("D:\\programming\\projects\\sentinel-ai\\backend\\sample_transactions_small.csv")
transactions_fe = transactions_raw.copy()

#convert timestamp column to datetime object
transactions_fe['timestamp'] = pd.to_datetime(transactions_fe['timestamp'])

intervals = ['5min', '10min', '30min', '1h']
fixed_thresholds = {'5min': 3, '10min': 5, '30min': 8, '1h': 15}

def add_combined_frequency_risk(df, intervals, fixed_thresholds, weight=3):
    # sorts the intervals list to shortest first
    # Timedelta converts the string into actual time objects in order to sort the list (i.e. 5min -> 0 days 00:05:00)
    # doing this so we can catch suspicious activity as soon as they happen
    intervals_sorted = sorted(intervals, key=lambda x: pd.Timedelta(x))

    # keep a list of all risk scores from every time interval to combine them later
    risk_cols = []

    for interval in intervals_sorted:
        # adding interval column (i.e. '5min') and rounding down each transaction's timestamp to the current interval
        df[interval] = df['timestamp'].dt.floor(interval)

        count_col = f'tx_count_last_{interval}'
        avg_col = f'avg_tx_last_{interval}'
        risk_fixed_col = f'risk_fixed_{interval}'
        risk_relative_col = f'risk_relative_{interval}'
        combined_risk_col = f'risk_combined_{interval}'

        # actual number of transactions in each time interval
        df[count_col] = df.groupby(['customer_id', interval])['timestamp'].transform('count')

        # customer's average transaction count for each interval (to capture typical behavior)
        df[avg_col] = df.groupby('customer_id')[count_col].transform('mean')

        # lags when transaction count exceeds an absolute threshold (e.g., 3 transactions in 5 min)
        threshold = fixed_thresholds.get(interval, None)
        if threshold is not None:
            df[risk_fixed_col] = df[count_col].apply(lambda c: 0.9 if c >= threshold else 0.0)
        else:
            df[risk_fixed_col] = 0.0

        # flags when count significantly exceeds customer's average behavior (using a weight multiplier)
        def relative_risk(count, avg):
            if pd.isna(avg) or avg == 0:
                return 0.2  # Low risk if no average
            if count > avg * weight:
                return 0.9
            elif count > avg * 1.5:
                return 0.7
            elif count > avg:
                return 0.5
            else:
                return 0.2

        df[risk_relative_col] = df.apply(lambda row: relative_risk(row[count_col], row[avg_col]), axis=1)

        # Combine fixed and relative risks for this interval by taking the maximum,
        # so the highest risk signal from either method is used to flag suspicious activity.
        df[combined_risk_col] = df[[risk_fixed_col, risk_relative_col]].max(axis=1)

        risk_cols.append(combined_risk_col)

    # For each row, return the highest risk from the shortest interval flagged
    def shortest_interval_risk(row):
        for col in risk_cols:
            if row[col] >= 0.5:  # threshold to consider flagged, adjust as needed
                return row[col]
        return 0.2  # low risk if none flagged

    df['combined_frequency_risk'] = df.apply(shortest_interval_risk, axis=1)

    return df

def add_address_risk_score(df):
    fraud_city = {'Faketown', 'Anytown', 'Nowhere', 'Mystery', 'Fakesville'}
    pattern = r'(?i)\b(fake|null|test|unknown|imaginary|p\.?\s?o\.?\s?box)\b'

    df['is_fake_street'] = df['billing_line1'].apply(lambda row: 1 if isinstance(row, str) and isinstance(re.search(pattern, row), re.Match) else 0)
    df['is_fake_city'] = df['billing_city'].apply(lambda city: 1 if isinstance(city, str) and city.strip() in fraud_city else 0)

    df['fake_address_score'] = df[['is_fake_street', 'is_fake_city']].max(axis=1).apply(lambda x: 0.9 if x == 1 else 0.2)

    df['street_counts'] = df.groupby('customer_id')['billing_line1'].transform('nunique')
    df['city_counts'] = df.groupby('customer_id')['billing_city'].transform('nunique')
    df['state_counts'] = df.groupby('customer_id')['billing_state'].transform('nunique')
    df['zip_counts'] = df.groupby('customer_id')['billing_postal_code'].transform('nunique')

    def calc_risk_score(row):
        if row['street_counts'] == 1 and row['city_counts'] == 1 and row['state_counts'] == 1 and row['zip_counts'] == 1:
            return 0.2
        elif row['street_counts'] >= 4 or row['city_counts'] >= 4 or row['state_counts'] >= 4 or row['zip_counts'] >= 4:
            return 0.9
        else:
            return 0.5
        
    df['addr_change_score'] = df.apply(calc_risk_score, axis=1)

    df['combined_address_risk'] = df[['fake_address_score', 'addr_change_score']].max(axis=1)

    return df

transactions_fe = add_combined_frequency_risk(transactions_fe, intervals, fixed_thresholds)
transactions_fe = add_address_risk_score(transactions_fe)
print(transactions_fe['combined_address_risk'].value_counts())


    


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

#1.CONFUSION MATRIX


# joblib.dump(model, 'fraud_model_smote.pkl')
#joblib.dump(final_model, 'xgboost_fraud_model_optimized.pkl')