from llama_index.core import Document, VectorStoreIndex, StorageContext
from llama_index.vector_stores.supabase import SupabaseVectorStore
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.storage.docstore import SimpleDocumentStore
import os 

class TransactionProcessor:
    def __init__(self, supabase_client, openai_api_key):
        self.supabase = supabase_client
        self.embed_model = OpenAIEmbedding(api_key=openai_api_key)
        
    def create_document(self, transaction):
        """Create a document from a transaction with risk assessment"""
        text = f"""
        Transaction {transaction['stripe_id']} for ${transaction['amount']} {transaction['currency']}
        Customer name: {transaction['billing_name']}
        Customer email: {transaction['billing_email']}
        Location: {transaction['billing_city']}, {transaction['billing_state']}
        Risk level: {transaction['predicted_risk']}
        """

        if transaction['predicted_risk'] in ('high', 'medium'):
            if transaction['combined_frequency_risk'] >= 0.5:
                if transaction['tx_count_last_5min'] >= 3:
                    text += f"customer made {transaction['tx_count_last_5min']} purchases within 5 minutes. "
                elif transaction['tx_count_last_10min'] >= 4:
                    text += f"customer made {transaction['tx_count_last_10min']} purchases within 10 minutes. "
            elif transaction['tx_count_last_30min'] >= 5:
                text += f"customer made {transaction['tx_count_last_30min']} purchases within 30 minutes. "
            elif transaction['tx_count_last_1h'] >= 7:
                text += f"customer made {transaction['tx_count_last_1h']} purchases within 1 hour. "
            
            if transaction['amount_risk_score'] >= 0.5:
                if transaction['amount'] > transaction['avg_amount']:
                    text += f"amount is significantly higher than normal. "
                elif transaction['amount'] < transaction['avg_amount']:
                    text += f"amount is significantly lower than normal. "
            
            if transaction['combined_address_risk'] >= 0.5:
                if transaction['fake_address_score'] >= 0.5:
                    text += f"suspicious address components detected. "
                elif transaction['addr_change_score'] >= 0.5:
                    text += f"the billing address used for this transaction is different from previous ones. "

        doc = Document(
            id_=transaction['stripe_id'],
            text=text,
            metadata={
                'account_id': transaction['account_id'],
                'avg_amount': transaction.get('avg_amount'),
                'combined_address_risk': transaction.get('combined_address_risk'),
                'fake_address_score': transaction.get('fake_address_score'),
                'addr_change_score': transaction.get('addr_change_score'),
                'combined_frequency_risk': transaction.get('combined_frequency_risk'),
                'amount_risk_score': transaction.get('amount_risk_score'),
                'tx_count_last_5min': transaction.get('tx_count_last_5min'),
                'tx_count_last_10min': transaction.get('tx_count_last_10min'),
                'tx_count_last_30min': transaction.get('tx_count_last_30min'),
                'tx_count_last_1h': transaction.get('tx_count_last_1h'),
                'fake_component_count': transaction.get('fake_component_count'),
                'predicted_risk': transaction.get('predicted_risk'),
                'probabilities': transaction.get('probabilities', {})
            }
        )
        return doc
        
    def index_transactions(self, transactions, customer_id):
        for transaction in transactions:
            persist_dir = f'./storage/{customer_id}'
            os.makedirs(persist_dir, exist_ok=True)
            docstore_path = os.path.join(persist_dir, "docstore.json")
            stripe_id = transaction['stripe_id']

            if os.path.exists(docstore_path):
                print(f"[INFO] Loading existing docstore from {docstore_path}")
                docstore = SimpleDocumentStore.from_persist_path(persist_path=docstore_path)
            else:
                print("[INFO] No existing docstore found. Creating a new one.")
            docstore = SimpleDocumentStore()

            if stripe_id not in docstore.docs:
                doc = self.create_document(transaction)
                embedding = self.embed_model.get_text_embedding(doc.get_content())
                doc.embedding = embedding

                record = {
                "id": doc.id_,
                "embedding": doc.embedding,
                "content": doc.get_content(),
                "metadata": doc.metadata or {}
            }
            try:
                insert_response = self.supabase.table("transactions_embeddings").insert(record).execute()
                if insert_response.data:
                    docstore.add_documents([doc])
                    docstore.persist(persist_path=docstore_path)
                    #print(f"[SUCCESS] Local docstore updated and persisted for {stripe_id}.")
                else:
                    #print(f"[ERROR] Supabase insert failed for {stripe_id}. Response: {insert_response}")
                    pass
            except Exception as e:
                #print(f"[FATAL] An exception occurred during Supabase insert for {stripe_id}: {e}")
                pass
            else:
                #print(f"[INFO] Document with stripe_id {stripe_id} already exists in docstore. Skipping insertion.")
                pass

            try:
                response = self.supabase.table("transactions_embeddings").select("id", count='exact').eq("id", stripe_id).execute()
                #print(f"Supabase final check for {stripe_id}: count={response.count}")
                pass
            except Exception as e:
                #print(f"[ERROR] Failed to query inserted doc {stripe_id}: {e}")
                pass