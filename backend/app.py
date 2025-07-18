
import pandas as pd
import joblib
import shap
import os 
from feature_engineering import add_combined_frequency_risk, add_address_risk, add_amount_risk
from flask import Flask, request, jsonify

from index_utils import create_transaction_documents
from llama_index.core import Settings
from llama_index.embeddings.openai import OpenAIEmbedding

from dotenv import load_dotenv
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.supabase import SupabaseVectorStore
from supabase import create_client, Client

load_dotenv()

openai_api_key = os.getenv('OPENAI_API_KEY')
url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

supabase = create_client(url, key)

Settings.embed_model = OpenAIEmbedding(api_key=openai_api_key)

vector_store = SupabaseVectorStore(
    postgres_connection_string = f"postgresql://{os.environ['CONNECTION_STRING_USER']}:{os.environ['CONNECTION_STRING_PASSWORD']}@{os.environ['CONNECTION_STRING_HOST']}.supabase.co:{os.environ['CONNECTION_STRING_PORT']}/postgres",
    collection_name='transactions_embeddings',
)

storage_context = StorageContext.from_defaults(vector_store=vector_store)

pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)

intervals = ['5min', '10min', '30min', '1h']
fixed_thresholds = {'5min': 3, '10min': 5, '30min': 8, '1h': 15}
app = Flask(__name__)
index = None

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
    #print(transactions)
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
    global index
    try:
    
        transactions = request.json
        
        docs = create_transaction_documents(transactions)
        index = VectorStoreIndex.from_documents(documents=docs, storage_context=storage_context, embed_model=Settings.embed_model)
        storage_context.persist()
        print("Docs in index after from_documents:", len(index.docstore.docs))
        print("Stored doc keys:", index.docstore.docs.keys())
        print(f"Number of docs indexed: {len(index.docstore.docs)}")
        return jsonify({'message': 'Embedded and Indexed to LlamaIndex'}), 200
    except Exception as e: 
        print("Indexing error: ", e)

if __name__ == '__main__':
    app.run(debug=True, port=5000)