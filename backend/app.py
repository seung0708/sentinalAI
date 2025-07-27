import os 
import pandas as pd
import joblib
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from pathlib import Path
from supabase import create_client
from flask_cors import CORS 

from transaction_processing import process_stripe_transaction, generate_explanation
from llama_indexing import TransactionProcessor
from lang_chain import TransactionChatBot

load_dotenv(dotenv_path="../.env.local")

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
openai_api_key= os.getenv('OPENAI_API_KEY')


supabase = create_client(url, key)

app = Flask(__name__)
CORS(app)

transaction_processor = TransactionProcessor(supabase, openai_api_key)
chatbot = TransactionChatBot(supabase, openai_api_key)

# response = supabase.table('transactions').select('*').execute()
# data=response.data
# print(data)

@app.route('/')
@app.route('/predict-fraud', methods=['POST'])
def predict_fraud():
    X, latest_tx = process_stripe_transaction(request.json)
    model = joblib.load('model/fraud.pkl')

    prediction = model.predict_proba(X)

    pred_class_index = prediction.argmax()
    response_data = generate_explanation(X, latest_tx, model, pred_class_index, prediction)

    return jsonify(response_data)

@app.route('/index-transaction', methods=['POST'])
def index_transaction():
    transaction = request.json
    customer_id = transaction['customer_id']
    transaction_processor.index_transactions([transaction], customer_id)
    return jsonify({"message": "Indexed transaction"}), 200



@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():

    if request.method == 'OPTIONS':
        # CORS preflight request
        return jsonify({}), 200

    data = request.json
    query = data.get("query")
    account_id = data.get("account_id")
    
    if not query:
        return jsonify({"error": "Query missing"}), 400
    if not account_id:
        return jsonify({"error": "Account ID missing"}), 400
        
    return chatbot.chat(query, account_id)

if __name__ == '__main__':
    app.run(debug=True, port=8000)