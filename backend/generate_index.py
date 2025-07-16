import os 
from dotenv import load_dotenv
from llama_index.core import Document, StorageContext, VectorStoreIndex
from llama_index.vector_stores.supabase import SupabaseVectorStore

from supabase import create_client, Client

load_dotenv()

vector_store = SupabaseVectorStore(
    postgres_connection_string = f'postgresql://{os.environ['CONNECTION_STRING_USER']}:{os.environ['CONNECTION_STRING_PASSWORD']}@{os.environ['CONNECTION_STRING_HOST']}.supabase.co:{os.environ['CONNECTION_STRING_PORT']}/postgres', 
    collection_name='transactions_embeddings'
)

openai_api_key = os.getenv('OPENAI_API_KEY')
url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

supabase = create_client(url, key)

def embed_index_transactions(transactions):
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