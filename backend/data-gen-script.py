import random
import uuid
import csv
from datetime import datetime, timedelta

#configuration 
NUM_ROWS = 50000 # 
FRAUD_RATE = 0.05
CURRENCIES = ['usd','eur','cad']
PAYMENT_METHODS = ['card', 'bank_transfer','paypal']
FRAUD_REASONS = ["stolen_card", "unusual_location", "high_risk_country",
    "amount_too_large", "multiple_failed_attempts", "suspicious_email_domain"]

def random_date(start, end):
        return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))

def generate_transaction(fraud=False):
    txn_id = str(uuid.uuid4())
    amount = random.randint(500, 50000) if not fraud else random.choice([99999, 1, 5])
    currency = random.choice(CURRENCIES)
    payment_method = random.choice(PAYMENT_METHODS)
    created = random_date(datetime(2022, 1, 1), datetime(2024, 4, 1))
    metadata = {'user_id': str(uuid.uuid4())}
    is_fraud = int(fraud)
    fraud_reason = random.choice(FRAUD_REASONS) if fraud else None 

    return {
         "stripe_id": txn_id,
        "amount": amount,
        "currency": currency,
        "created": created.isoformat(),
        "payment_method": payment_method,
        "user_id": metadata["user_id"],
        "is_fraud": is_fraud,
        "fraud_reason": fraud_reason
    }

def generate_dataset():
    data = []
    for _ in range(NUM_ROWS):
        fraud = random.random() < FRAUD_RATE
        data.append(generate_transaction(fraud))
    return data

def write_csv(filename="sample_transactions.csv"):
    data = generate_dataset()
    with open(filename, mode='w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
    print('Generated data')

if __name__ == "__main__":
    write_csv()