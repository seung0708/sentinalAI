import pandas as pd
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
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
from xgboost import XGBClassifier

'''
    Supervised Learning 
        Classification problem
'''


#create DataFrame from csv
df = pd.read_csv("D:\programming\projects\sentinel-ai\\backend\sample_transactions.csv")

#previews the first n rows of df, default rows is 5
#print(df.head(10))
#print(df.info())
#getting the count of all transactions that are fraud
print(df['is_fraud'].value_counts())

# encode categorical columns - 
# converting columns that contain strings into numeerical inputs for the model to read
df = pd.get_dummies(df, columns=['payment_method', 'currency', 'fraud_reason'], drop_first=True)


# drop non-numeric and irrelevant columns
columns_to_drop = ['stripe_id', 'user_id', 'created', 'is_fraud']
#print(columns_to_drop)
features_to_scale = df.drop(columns=columns_to_drop)


#splitting data
X = df.drop('Class', axis=1) # all columns except Class which contains fraud values
y = df['Class'] # Class columns which contains fraud values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

# Applying SMOTE on training data
smote = SMOTE(random_state=42, sampling_strategy=1.0)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# sample for faster tuning
X_sample,_,y_sample,_ = train_test_split(X_train_resampled, y_train_resampled, train_size=0.3, random_state=42)


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