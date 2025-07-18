from llama_index.core.schema import Document

def create_transaction_documents(transactions):
    documents = []
    for transaction in transactions: 
        if transaction['predicted_risk'] in ('high', 'medium'):
            text = f'Transaction {transaction['stripe_id']} for {transaction['billing_name']} has a {transaction['predicted_risk']} risk of being fraud because '
            if transaction['combined_frequency_risk'] >= 0.5: 
                if transaction['tx_count_last_5min'] >= 3:
                    text += f'customer made {transaction['tx_count_last_5min']} purchases within 5 minutes. '
                elif transaction['tx_count_last_10min'] >= 4:
                    text += f'customer made {transaction['tx_count_last_10min']} purchases within 10 minutes. '
                elif transaction['tx_count_last_30min'] >= 5: 
                    text += f'customer made {transaction['tx_count_last_30min']} purchases within 30 minutes. '
                elif transaction['tx_count_last_1h'] >= 7:
                    text += f'customer made {transaction['tx_count_last_1h']} purchases within 1 hour. '
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
        else:
            text = f"Transaction {transaction['stripe_id']} for {transaction['billing_name']} is low risk."
        documents.append( 
            Document(
                id_=transaction['stripe_id'],
                text=text,
                metadata={
                    'tx_count_last_5min': transaction['tx_count_last_5min'], 
                    'tx_count_last_10min': transaction['tx_count_last_10min'], 
                    'tx_count_last_30min': transaction['tx_count_last_30min'],
                    'tx_count_last_1h': transaction['tx_count_last_1h'], 
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
    
    return documents