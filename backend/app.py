
import pandas as pd
import joblib
import shap
import os 

from feature_engineering import add_combined_frequency_risk, add_address_risk, add_amount_risk
from flask import Flask, request, jsonify
from llama_index.core import Document, Settings, StorageContext, VectorStoreIndex
from llama_index.vector_stores.supabase import SupabaseVectorStore

from llama_index.embeddings.openai import OpenAIEmbedding
from supabase import create_client, Client

Settings.embed_model = OpenAIEmbedding()

vector_store = SupabaseVectorStore(
    postgres_connection_string = f'postgresql://{os.environ['CONNECTION_STRING_USER']}:{os.environ['CONNECTION_STRING_PASSWORD']}@{os.environ['CONNECTION_STRING_HOST']}.supabase.co:{os.environ['CONNECTION_STRING_PORT']}/postgres', 
    collection_name='transactions_embeddings'
)

openai_api_key = os.getenv('OPENAI_API_KEY')

url = os.environ['NEXT_PUBLIC_SUPABASE_URL']
key = os.environ['NEXT_PUBLIC_SUPABASE_ANON_KEY']
supabase = create_client(url, key)


pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)

intervals = ['5min', '10min', '30min', '1h']
fixed_thresholds = {'5min': 3, '10min': 5, '30min': 8, '1h': 15}
app = Flask(__name__)

feature_columns = ['tx_count_last_5min', 'avg_tx_last_5min', 'risk_fixed_5min', 'risk_combined_5min', 'tx_count_last_10min', 'avg_tx_last_10min', 'risk_fixed_10min', 'risk_combined_10min', 'tx_count_last_30min', 'avg_tx_last_30min', 'risk_fixed_30min', 'risk_combined_30min', 'tx_count_last_1h', 'avg_tx_last_1h', 'risk_fixed_1h', 'risk_combined_1h', 'combined_frequency_risk', 'is_fake_street', 'is_fake_city', 'fake_address_score', 'addr_change_score', 'combined_address_risk', 'avg_amount', 'amount_risk_score', 'overall_risk']

@app.route('/')
@app.route('/predict-fraud', methods=['POST'])
def predict_fraud():
    transactions = pd.DataFrame(request.json)
    transactions['timestamp'] = pd.to_datetime(transactions['timestamp'])
    transactions['amount'] = transactions['amount'].astype(float)
    transactions = add_combined_frequency_risk(transactions, intervals, fixed_thresholds)
    transactions = add_address_risk(transactions)
    transactions = add_amount_risk(transactions)
    transactions['overall_risk'] = (
        0.5 * transactions['combined_frequency_risk'] +
        0.3 * transactions['combined_address_risk'] +
        0.2 * transactions['amount_risk_score']
    )
    print(transactions)
    transactions = transactions.sort_values('timestamp', ascending=False).reset_index(drop=True)
    latest_tx = transactions.iloc[0]  # newest transaction

    int_features = [
    'tx_count_last_5min', 'risk_fixed_5min', 'risk_combined_5min',
    'tx_count_last_10min', 'risk_fixed_10min', 'risk_combined_10min',
    'tx_count_last_30min', 'risk_fixed_30min', 'risk_combined_30min',
    'tx_count_last_1h', 'risk_fixed_1h', 'risk_combined_1h',
    'is_fake_street', 'is_fake_city'
]

    float_features = [
        'avg_tx_last_5min', 'avg_tx_last_10min', 'avg_tx_last_30min', 'avg_tx_last_1h',
        'combined_frequency_risk', 'fake_address_score', 'addr_change_score',
        'combined_address_risk', 'avg_amount', 'amount_risk_score', 'overall_risk'
    ]

    for col in int_features:
        val = pd.to_numeric(latest_tx[col], errors='coerce')
        latest_tx[col] = int(0 if pd.isna(val) else val)

    for col in float_features:
        val = pd.to_numeric(latest_tx[col], errors='coerce')
        latest_tx[col] = float(0.0 if pd.isna(val) else val)

    X = pd.DataFrame([latest_tx[feature_columns]])

    model = joblib.load('model/fraud.pkl')
    #print(model.get_booster().feature_names)
    prediction = model.predict_proba(X)

    pred_class_index = prediction.argmax()
    #print(prediction[0])

    # Get SHAP explanation
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X)
    #print(shap_values)
    row_values = shap_values[0, :, pred_class_index]
    base_value = explainer.expected_value[pred_class_index]

    explanation_parts = []
    for feature, shap_val in sorted(zip(X.columns, row_values), key=lambda x: abs(x[1]), reverse=True)[:3]:
        sign = "+" if shap_val >= 0 else "-"
        explanation_parts.append(f"{feature} contributed {sign}{abs(shap_val):.3f}")

    explanation_text = (
        f"Model prediction (probabilities): {prediction.tolist()}\n"
        f"Base value: {base_value:.4f}\n"
        f"Top contributing features:\n- " + "\n- ".join(explanation_parts)
    )

    response_data = {
        "predicted_risk": max(
            zip(["low", "medium", "high"], prediction[0]), key=lambda x: x[1]
        )[0],
        "probabilities": {
            "low": round(float(prediction[0][0]), 2),
            "medium": round(float(prediction[0][1]), 2),
            "high": round(float(prediction[0][2]), 2),
        },
        "explanation": explanation_text,
        "derived_features": {col: latest_tx[col] for col in feature_columns}
    }

    return jsonify(response_data)

@app.route('/index-transactions', methods=['post'])
def index_transactions():
    transactions = request.json
    documents = []
    for transaction in transactions: 
        text = f'Transaction {transaction['stripe_id']} for {transaction['billing_name']} has a {transaction['predicted_risk']} risk of being fraud because '
        if transaction['predicted_risk'] == 'high' or transaction['predicted_risk']  == 'medium':
            if transaction['combined_frequency_risk'] >= 0.5: 
                if transaction['tx_count_last_5min'] >= 3:
                    text += f'customer made {transaction['tx_count_last_5min']} purchases within 5 minutes. '
                elif transaction['tx_count_last_10min'] >= 4:
                    text += f'customer made {transaction['tx_count_last_10min']} purchases within 10 minutes. '
                elif transaction['tx_count_last_30min'] >= 5: 
                    text += f'customer made {transaction['tx_count_last_30min']} purchases within 30 minutes. '
                elif transaction['tx_count_last_1hr'] >= 7:
                    text += f'customer made {transaction['tx_count_last_1hr']} purchases within 1 hour. '
            if transaction['amount_risk_score'] >= 0.5:
                if transaction['amount'] > transaction['avg_amount']: 
                    text += f'amount is significantlly higher than normal. '
                elif transaction['amount']  < transaction['avg_amount']:
                    text += f'amount is significantaly lower than normal. '
            if transaction['addr_change_score'] >= 0.5 or transaction['fake_address_score'] >= 0.5:
                if transaction['is_fake_street'] or transaction['is_fake_city']:
                    text += f'the street or city appears to be fake or invalid. '
                else:
                    text += f'the billing address used for this transaction is different from previous ones. '
        documents.append( 
            Document(
                text=text,
                metadata={
                    'file_name': f'transaction_{transaction['transaction_id']}', 
                    'tx_count_last_5min': transaction['tx_count_last_5min'], 
                    'tx_count_last_10min': transaction['tx_count_last_10min'], 
                    'tx_count_last_30min': transaction['tx_count_last_30min'],
                    'tx_count_last_1hr': transaction['tx_count_last_1hr'], 
                    'combined_frequency_risk': transaction['combined_frequency_risk'], 
                    'amount_risk_score': transaction['amount_risk_score'], 
                    'avg_amount': transaction['avg_amount'], 
                    'addr_change_score': transaction['addr_change_score'],
                    'fake_address_score':  transaction['fake_address_score'],
                    'is_fake_street': transaction['is_fake_street'], 
                    'is_fake_city': transaction['is_fake_city']
                }
            )
        )
    
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    VectorStoreIndex.from_documents(documents, storage_context)

    return jsonify({'message': 'Embedded and Indexed to LlamaIndex'}), 200



if __name__ == '__main__':
    app.run(debug=True, port=5000)