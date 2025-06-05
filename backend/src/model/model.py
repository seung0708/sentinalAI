import pandas as pd
import joblib
import matplotlib.pyplot as plt
from sklearn.metrics import (
    confusion_matrix,
    ConfusionMatrixDisplay, 
    roc_curve,
    auc,
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


#load dataset from file
# df = pd.read_csv("/Users/magsz/Documents/VS Code/Projects/sentinalAI/backend/sample_transactions.csv")

# load full_transactions_processed.csv
df1 = pd.read_csv("/Users/magsz/Documents/VS Code/Projects/sentinalAI/backend/full_transactions_processed.csv")

def compute_risk_scores(df, weights=None):
    if weights is None:
        weights = {"amount": 0.4, "frequency": 0.3, "location": 0.3}

    us_states = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ]

    def amount_risk(amount):
        if amount > 1000:
            return 1.0
        elif amount >= 100:
            return 0.5
        else:
            return 0.1

    def frequency_risk(count):
        if count > 10:
            return 1.0
        elif count >= 3:
            return 0.5
        else:
            return 0.1

    def location_risk(state_code):
        return 0.1 if state_code in us_states else 1.0

    df = df.copy()
    df['amount_score'] = df['amount'].apply(amount_risk)
    df['frequency_score'] = df['transaction_count'].apply(frequency_risk)
    df['location_score'] = df['billing_state'].apply(location_risk)  # Make sure you're using a state field

    df['risk_score'] = (
        df['amount_score'] * weights['amount'] +
        df['frequency_score'] * weights['frequency'] +
        df['location_score'] * weights['location']
    )

    return df

# Call the function and print the result
scored_df = compute_risk_scores(df1)
print(scored_df[['amount', 'transaction_count', 'billing_state', 'risk_score']].head())

# print(df.head())
# print(df['is_fraud'].value_counts())

# # encode categorical columns - 
# # converting columns that contain strings into numerical inputs for the model to read
# df = pd.get_dummies(df, columns=['payment_method', 'currency', 'fraud_reason'], drop_first=True)


# # drop non-numeric and irrelevant columns
# columns_to_drop = ['stripe_id', 'user_id', 'created', 'is_fraud']
# features_to_scale = df.drop(columns=columns_to_drop)


# #splitting data
# X = df.drop(['is_fraud','stripe_id', 'user_id', 'created'], axis=1) # all columns that do not contain numeric values
# y = df['is_fraud'] # Class columns which contains fraud values

# #Scale features
# scaler = StandardScaler()
# scaled_array = scaler.fit_transform(features_to_scale)
# df_scaled = pd.DataFrame(scaled_array, columns=features_to_scale.columns)

# # Split data into test and training samples
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

# # Applying SMOTE on training data
# smote = SMOTE(random_state=42, sampling_strategy=1.0)
# X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# # sample for faster tuning
# X_sample,_,y_sample,_ = train_test_split(X_train_resampled, y_train_resampled, train_size=0.3, random_state=42)


# # hyperparameter grid for xboost
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

# #fit model for grid search
# random_search.fit(X_sample, y_sample)

# #print best parameter after tuning
# print("Best parameters:", random_search.best_params_)

# #Retrain final model on full resampled data
# final_model = XGBClassifier(**random_search.best_params_, eval_metric='logloss', random_state=42)
# final_model.fit(X_train_resampled, y_train_resampled)

# # print classification
# y_pred_proba = final_model.predict_proba(X_test)[:, 1]
# y_pred = (y_pred_proba > 0.3).astype(int)
# print(classification_report(y_test, y_pred))

# #1.CONFUSION MATRIX
# cm = confusion_matrix(y_test, y_pred)
# disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=['Not Fraud','Fraud'])
# disp.plot(cmap=plt.cm.Blues)
# plt.title("Confusion Matrix")
# plt.show()

# # ROC CURVE
# fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
# roc_auc = roc_auc_score(y_test, y_pred_proba)

# plt.figure()
# plt.plot(fpr, tpr, color='darkorange', label=f'ROC Curve (AUC = {roc_auc:.2f})')
# plt.plot([0, 1], [0, 1], color='navy', linestyle='--', label='Random Guess')
# plt.xlabel('False Positive Rate')
# plt.ylabel('True Positive Rate (Recall)')
# plt.title('ROC Curve')
# plt.legend(loc='lower right')
# plt.grid(True)
# plt.show()

# # PRECISION RECALL CURVE
# precision, recall, _ = precision_recall_curve(y_test, y_pred_proba)
# ap_score = average_precision_score(y_test, y_pred_proba)

# plt.figure()
# plt.plot(recall, precision, color='green', label=f'PR Curve (AP = {ap_score:.2f})')
# plt.xlabel("Recall")
# plt.ylabel('Precision')
# plt.title('Precision-Recall Curve')
# plt.legend(loc='lower left')
# plt.grid(True)
# plt.show()

# # # joblib.dump(model, 'fraud_model_smote.pkl')
# # joblib.dump(final_model, 'xgboost_fraud_model_optimized.pkl')