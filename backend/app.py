from flask import Flask, request, jsonify
import pandas as pd
from feature_engineering import add_combined_frequency_risk, add_address_risk, add_amount_risk
import json
import joblib
import shap

intervals = ['5min', '10min', '30min', '1h']
fixed_thresholds = {'5min': 3, '10min': 5, '30min': 8, '1h': 15}
app = Flask(__name__)

@app.route('/')
@app.route('/predict-fraud', methods=['POST'])
def predict_fraud():
    transaction = pd.DataFrame([request.json])
    transaction['timestamp'] = pd.to_datetime(transaction['timestamp'])
    transaction['amount'] = transaction['amount'].astype(float)
    transaction = add_combined_frequency_risk(transaction, intervals, fixed_thresholds)
    transaction = add_address_risk(transaction)
    transaction = add_amount_risk(transaction)

    X = transaction[['tx_count_last_5min', 'avg_tx_last_5min', 'risk_fixed_5min', 'risk_combined_5min', 'tx_count_last_10min', 'avg_tx_last_10min', 'risk_fixed_10min', 'risk_combined_10min', 'tx_count_last_30min', 'avg_tx_last_30min', 'risk_fixed_30min', 'risk_combined_30min', 'tx_count_last_1h', 'avg_tx_last_1h', 'risk_fixed_1h', 'risk_combined_1h', 'combined_frequency_risk', 'is_fake_street', 'is_fake_city', 'fake_address_score', 'addr_change_score', 'combined_address_risk', 'avg_amount', 'amount_risk_score']]

    model = joblib.load('model/fraud.pkl')
    print(model.classes_)
    prediction = model.predict_proba(X)
    print(prediction[0])

    response_data = {
        "predicted_risk": "low", 
        "probabilities": {
            "low": round(float(prediction[0][0]), 2),
            "medium": round(float(prediction[0][1]), 2),
            "high": round(float(prediction[0][2]), 2)
        }
    }

    return jsonify(response_data)


if __name__ == '__main__':
    app.run(debug=True, port=5000)