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
	@@ -9,15 +19,31 @@


#load dataset from file
df = pd.read_csv("/Users/magsz/Documents/VS Code/Projects/sentinalAI/backend/sample_transactions.csv")

# print(df.head())
# print(df['is_fraud'].value_counts())

# encode categorical columns - 
# converting columns that contain strings into numeerical inputs for the model to read
df = pd.get_dummies(df, columns=['payment_method', 'currency', 'fraud_reason'], drop_first=True)


# drop non-numeric and irrelevant columns
columns_to_drop = ['stripe_id', 'user_id', 'created', 'is_fraud']
features_to_scale = df.drop(columns=columns_to_drop)


#splitting data
X = df.drop(['is_fraud','stripe_id', 'user_id', 'created'], axis=1) # all columns that do not contain numeric values
y = df['is_fraud'] # Class columns which contains fraud values

#Scale features
scaler = StandardScaler()
scaled_array = scaler.fit_transform(features_to_scale)
df_scaled = pd.DataFrame(scaled_array, columns=features_to_scale.columns)

# Split data into test and training samples
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

# Applying SMOTE on training data
smote = SMOTE(random_state=42, sampling_strategy=1.0)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)
# sample for faster tuning
X_sample,_,y_sample,_ = train_test_split(X_train_resampled, y_train_resampled, train_size=0.3, random_state=42)
# hyperparameter grid for xboost
param_dist = {
    'n_estimators': [50, 100],
    'max_depth': [3, 6, 10],
    'learning_rate': [0.01, 0.1, 0.2],
    'subsample': [0.8, 1.0],
    'colsample_bytree': [0.8, 1.0],
    'scale_pos_weight': [10]
}

xgb = XGBClassifier( eval_metric='logloss', random_state=42)
	@@ -65,5 +91,39 @@
y_pred = (y_pred_proba > 0.3).astype(int)
print(classification_report(y_test, y_pred))

#1.CONFUSION MATRIX
cm = confusion_matrix(y_test, y_pred)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=['Not Fraud','Fraud'])
disp.plot(cmap=plt.cm.Blues)
plt.title("Confusion Matrix")
plt.show()

# ROC CURVE
fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
roc_auc = roc_auc_score(y_test, y_pred_proba)

plt.figure()
plt.plot(fpr, tpr, color='darkorange', label=f'ROC Curve (AUC = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], color='navy', linestyle='--', label='Random Guess')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate (Recall)')
plt.title('ROC Curve')
plt.legend(loc='lower right')
plt.grid(True)
plt.show()

# PRECISION RECALL CURVE
precision, recall, _ = precision_recall_curve(y_test, y_pred_proba)
ap_score = average_precision_score(y_test, y_pred_proba)

plt.figure()
plt.plot(recall, precision, color='green', label=f'PR Curve (AP = {ap_score:.2f})')
plt.xlabel("Recall")
plt.ylabel('Precision')
plt.title('Precision-Recall Curve')
plt.legend(loc='lower left')
plt.grid(True)
plt.show()

# # joblib.dump(model, 'fraud_model_smote.pkl')
# joblib.dump(final_model, 'xgboost_fraud_model_optimized.pkl')
