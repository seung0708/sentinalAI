import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

#load dataset from file
df = pd.read_csv("creditcard.csv")
# # print(df.head()) # check first rows of data

# # checking basic info - columns names, non-null counts, and data types
# print(df.info())

# #Display statistical summary of numerical columns
# print(df.describe())

# #Check for missing values
# print(df.isnull().sum())

scaler = StandardScaler()
df_scaled = pd.DataFrame(scaler.fit_transform(df), columns=df.columns)

#splitting data
X = df.drop('Class', axis=1) # all columns except Class which contains fraud values
y = df['Class'] # Class columns which contains fraud values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#Training model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

#predict on the test set
y_pred = model.predict(X_test)

#evaluate model
print(accuracy_score(y_test,y_pred))
print(classification_report(y_test,y_pred))

joblib.dump(model, 'fraud_model.pkl')