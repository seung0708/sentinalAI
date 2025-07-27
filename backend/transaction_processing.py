import pandas as pd

from model.feature_engineering import add_combined_frequency_risk, add_address_risk, add_amount_risk
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)

feature_columns = [
    'tx_count_last_5min', 'tx_count_last_10min', 'tx_count_last_30min', 'tx_count_last_1h',
    'combined_frequency_risk', 'fake_address_score', 'addr_change_score', 'combined_address_risk',
    'avg_amount', 'amount_risk_score', 'fake_component_count'
]

def process_transaction(request_data):
    # Handle both list and dictionary inputs
    if isinstance(request_data, list):
        current_tx = pd.DataFrame(request_data)
    else:
        current_tx = pd.DataFrame([request_data])
    
    # Add timestamp if not present
    if 'timestamp' not in current_tx.columns:
        current_tx['timestamp'] = pd.Timestamp.now()
    
    # Use customer_id from data or fallback to billing_name
    if 'customer_id' not in current_tx.columns:
        current_tx['customer_id'] = current_tx.get('customer', current_tx['billing_name'])
    
    # Get transaction history from Supabase if we have customer_id
    customer_id = current_tx['customer_id'].iloc[0]
    if customer_id and customer_id != 'unknown':
        supabase = create_client(url, key)
        history = supabase.table('transactions').select('*').eq('customer_id', customer_id).execute()
        history_df = pd.DataFrame(history.data)
        
        if len(history_df) > 0:
            # Check if current transaction is already in history
            current_stripe_id = current_tx['stripe_id'].iloc[0]
            if current_stripe_id in history_df['stripe_id'].values:
                # Use history as is since it already includes current transaction
                transactions = history_df
            else:
                # Combine history with current transaction
                transactions = pd.concat([history_df, current_tx], ignore_index=True)
        else:
            transactions = current_tx
    else:
        transactions = current_tx
    
    # Ensure all required columns exist
    transactions['timestamp'] = pd.to_datetime(transactions['timestamp'])
    transactions['amount'] = pd.to_numeric(transactions['amount'], errors='coerce')
    transactions['customer_id'] = transactions['customer_id'].fillna('unknown')
    
    # Process features
    transactions = add_combined_frequency_risk(transactions)
    transactions = add_address_risk(transactions)
    transactions = add_amount_risk(transactions)
    
    transactions = transactions.sort_values('timestamp', ascending=False).reset_index(drop=True)
    latest_tx = transactions.iloc[0]  # newest transaction
    
    # Convert types for our current feature set
    for col in feature_columns:
        if col in ['tx_count_last_5min', 'tx_count_last_10min', 'tx_count_last_30min', 'tx_count_last_1h', 'fake_component_count']:
            val = pd.to_numeric(latest_tx[col], errors='coerce')
            latest_tx[col] = int(0 if pd.isna(val) else val)
        else:
            val = pd.to_numeric(latest_tx[col], errors='coerce')
            latest_tx[col] = float(0.0 if pd.isna(val) else val)
            
    return transactions[feature_columns], latest_tx


def format_risk_assessment(X, latest_tx, model=None, pred_class_index=None, prediction=None):
    # Get predicted risk level from probabilities
    risk_probs = list(zip(['low', 'medium', 'high'], prediction[0]))
    predicted_risk = max(risk_probs, key=lambda x: x[1])[0]
    
    return {
        "predicted_risk": predicted_risk,
        "probabilities": {
            "low": float(prediction[0][0]),
            "medium": float(prediction[0][1]),
            "high": float(prediction[0][2])
        },
        "derived_features": {col: float(latest_tx[col]) if col not in ['tx_count_last_5min', 'tx_count_last_10min', 'tx_count_last_30min', 'tx_count_last_1h', 'fake_component_count'] else int(latest_tx[col]) for col in feature_columns}
    }