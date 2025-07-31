import os 
import pandas as pd
import joblib
from flask import Flask, request, jsonify
from dotenv import load_dotenv

from index_utils import create_transaction_document
from transaction_processing import process_stripe_transaction, generate_explanation
#from prompt_builder import response_to_user_message
from llama_index.core import VectorStoreIndex,StorageContext
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.supabase import SupabaseVectorStore
from llama_index.core.storage.docstore import SimpleDocumentStore

from supabase import create_client

load_dotenv()

openai_api_key = os.getenv('OPENAI_API_KEY')
url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

supabase = create_client(url, key)

embed_model = OpenAIEmbedding(api_key=openai_api_key)

app = Flask(__name__)

@app.route('/')
@app.route('/predict-fraud', methods=['POST'])
def predict_fraud():
    X, latest_tx = process_stripe_transaction(request.json)
    model = joblib.load('model/fraud.pkl')

    #print(model.get_booster().feature_names)
    prediction = model.predict_proba(X)

    pred_class_index = prediction.argmax()
    #print(prediction[0])

    # Get SHAP explanation
    response_data = generate_explanation(X, latest_tx, model, pred_class_index, prediction)

    return jsonify(response_data)

@app.route('/index-transaction', methods=['post'])
def index_transaction():
    new_transaction = request.json
    customer_id = new_transaction['customer_id']
    stripe_id = new_transaction['stripe_id']

    persist_dir = f'./storage/{customer_id}'
    os.makedirs(persist_dir, exist_ok=True)
    docstore_path = os.path.join(persist_dir, "docstore.json")

    vector_store = SupabaseVectorStore(
        supabase_url=os.getenv('NEXT_PUBLIC_SUPABASE_URL'),
        supabase_key=os.getenv('SUPABASE_SERVICE_KEY'),
        collection_name="transactions_embeddings",
        # The postgres_connection_string is still needed for the pgvector extension.
        postgres_connection_string=f"postgresql://{os.environ['CONNECTION_STRING_USER']}:{os.environ['CONNECTION_STRING_PASSWORD']}@{os.environ['CONNECTION_STRING_HOST']}:{os.environ['CONNECTION_STRING_PORT']}/postgres"
    )

    if os.path.exists(docstore_path):
        print(f"[INFO] Loading existing docstore from {docstore_path}")
        docstore = SimpleDocumentStore.from_persist_path(persist_path=docstore_path)
    else:
        print("[INFO] No existing docstore found. Creating a new one.")
        docstore = SimpleDocumentStore()

    storage_context = StorageContext.from_defaults(
        vector_store=vector_store,
        docstore=docstore
    )

    index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        storage_context=storage_context
    )

    if stripe_id not in docstore.docs:
        new_doc = create_transaction_document(new_transaction)
        
        embedding = embed_model.get_text_embedding(new_doc.get_content())
        new_doc.embedding = embedding

        record = {
            "id": new_doc.doc_id,
            "embedding": new_doc.embedding,
            "content": new_doc.get_content(),
            "metadata": new_doc.metadata or {}
        }
        try:
            insert_response = supabase.table("transactions_embeddings").insert(record).execute()
            if insert_response.data:
                docstore.add_documents([new_doc])
                docstore.persist(persist_path=docstore_path)
                print(f"[SUCCESS] Local docstore updated and persisted for {stripe_id}.")
            else:
                print(f"[ERROR] Supabase insert failed for {stripe_id}. Response: {insert_response}")
        except Exception as e:
            print(f"[FATAL] An exception occurred during Supabase insert for {stripe_id}: {e}")

    else:
        print(f"[INFO] Document with stripe_id {stripe_id} already exists in docstore. Skipping insertion.")

    try:
        response = supabase.table("transactions_embeddings").select("id", count='exact').eq("id", stripe_id).execute()
        print(f"Supabase final check for {stripe_id}: count={response.count}")
    except Exception as e:
        print(f"[ERROR] Failed to query inserted doc {stripe_id}: {e}")

    return jsonify({'message': 'Embedded and Indexed to LlamaIndex'}), 200

# @app.route('/chat', method=['post'])
# def chat():
#     data = request.json()
#     message = data.get('message')
#     chat_history = data.get('chat_history', [])
#     response, updated_chat_history = response_to_user_message(message, chat_history)


if __name__ == '__main__':
    app.run(debug=True, port=5000)