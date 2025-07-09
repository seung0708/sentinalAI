import pandas as pd
from feature_engineering import add_combined_frequency_risk, add_address_risk, add_amount_risk
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

pd.set_option('display.max_columns', None)

# load csv
transactions_raw = pd.read_csv("D:\\programming\\projects\\sentinel-ai\\backend\\sample_transactions_small.csv")
transactions_fe = transactions_raw.copy()

#convert timestamp column to datetime object
transactions_fe['timestamp'] = pd.to_datetime(transactions_fe['timestamp'], format='ISO8601')

intervals = ['5min', '10min', '30min', '1h']
fixed_thresholds = {'5min': 3, '10min': 5, '30min': 8, '1h': 15}
        
transactions_fe = add_combined_frequency_risk(transactions_fe, intervals, fixed_thresholds)
transactions_fe = add_address_risk(transactions_fe)
transactions_fe = add_amount_risk(transactions_fe)

transactions_fe['overall_risk'] = (0.5 * transactions_fe['combined_frequency_risk'] + 0.3 * transactions_fe['combined_address_risk'] + 0.2 * transactions_fe['amount_risk_score'])
#print(transactions_fe['overall_risk'].mean())

print(transactions_fe) 

def is_fraud(row):
    if row['overall_risk'] >= 0.5:
        return 2
    elif row['overall_risk'] >= 0.35 and row['overall_risk'] < 0.5:
        return 1
    else:
        return 0
    
transactions_fe['is_fraud'] = transactions_fe.apply(is_fraud, axis=1)
#print(transactions_fe.head())

X = transactions_fe[['tx_count_last_5min', 'avg_tx_last_5min', 'risk_fixed_5min', 'risk_combined_5min', 'tx_count_last_10min', 'avg_tx_last_10min', 'risk_fixed_10min', 'risk_combined_10min', 'tx_count_last_30min', 'avg_tx_last_30min', 'risk_fixed_30min', 'risk_combined_30min', 'tx_count_last_1h', 'avg_tx_last_1h', 'risk_fixed_1h', 'risk_combined_1h', 'combined_frequency_risk', 'is_fake_street', 'is_fake_city', 'fake_address_score', 'addr_change_score', 'combined_address_risk', 'avg_amount', 'amount_risk_score']]
y = transactions_fe["is_fraud"]

X_train, X_test, y_train, y_test = train_test_split(X, y ,test_size=0.2, random_state=42)

# hyperparameter grid for xboost
param_dist = {
    'n_estimators': [50, 100],
    'max_depth': [3, 6, 10],
    'learning_rate': [0.01, 0.1, 0.2],
    'subsample': [0.8, 1.0],
    'colsample_bytree': [0.8, 1.0],
}

xgb = XGBClassifier(objective='multi:softprob', num_class=3, eval_metric='logloss', random_state=42)
random_search = RandomizedSearchCV(
    xgb, 
    param_distributions=param_dist, 
    n_iter=5, 
    scoring='f1_macro',
    refit= True, 
    verbose = 1, 
    n_jobs= 1, 
    cv=5
    )

#fit model for grid search
random_search.fit(X_train, y_train)

#print best parameter after tuning
best_model = random_search.best_estimator_
print(best_model)
y_pred = best_model.predict(X_test)

print(classification_report(y_test, y_pred))
print(confusion_matrix(y_test, y_pred))

joblib.dump(best_model, 'fraud.pkl')