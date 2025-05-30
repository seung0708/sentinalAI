import random
import string
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


random_string = ''.join(random.choices(string.ascii_letters + string.digits, k=24))
label = ["normal", "fraud"]

def random_date(start, end):
    return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))

def random_phone(label):
    if label == "normal":
        # Normal phone number (e.g., valid format)
        return f"+1{random.randint(2000000000, 9999999999)}"
    else:
        # Fraud phone number (e.g., invalid or suspicious pattern)
        return f"+1{random.choice(['0000000000', '1234567890', '9999999999'])}"
    
def random_email(label):
    normal_domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
    suspicious_usernames = [
        "john123", "user000", "fraudster", "xyz_abc", "l0st_acc", "test1234", "temp_user"
    ]
    normal_usernames = [
        "alice.j", "bob.smith", "carol.lee", "david.m"
    ]
    
    domain = random.choice(normal_domains)
    
    
    if label == "normal":
        username = random.choice(normal_usernames)
    else:
        username = random.choice(suspicious_usernames)
    
    return f"{username}@{domain}"

def random_name(label):
    normal_names = [
        "Alice Johnson", "Bob Smith", "Carol Lee", "David Martinez",
        "Emily Clark", "Frank Wright", "Grace Kim", "Henry Adams"
    ]
    fraud_names = [
        "Xyzzqpl", "Aaaaaaa", "Test User", "Fake Name",
        "John Doe", "!!!@@@", "ZZZ111", "L0r3m1ps"
    ]
    
    if label == "normal":
        return random.choice(normal_names)
    else:
        return random.choice(fraud_names)

def random_address(label): 
    countries = ['US', 'CA', 'GB', 'AU', 'FR']
    states_us = ['CA', 'NY', 'TX', 'FL', 'WA']
    cities = ['Los Angeles', 'New York', 'Chicago', 'Houston', 'Miami']
    streets = ['Elm', 'Maple', 'Oak', 'Pine', 'Cedar']

    if label == "normal":
        country = random.choice(countries)
        state = random.choice(states_us) if country == 'US' else ''
        city = random.choice(cities)
        postal_code = str(random.randint(10000, 99999))
        line1 = f"{random.randint(1,9999)} {random.choice(streets)} St"
        line2 = random.choice(['', f"Apt {random.randint(1,20)}", f"Suite {random.randint(100,999)}"])
    else:
        country = random.choice(['ZZ', 'XX', 'YY'])  # Invalid codes
        state = random.choice(['XX', 'ZZ'])
        city = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz', k=7))  # gibberish
        postal_code = ''.join(random.choices('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', k=8))  # invalid
        line1 = f"{random.randint(10000,99999)} {random.choice(['Fake', 'Bogus', 'Fake'])} Rd"
        line2 = random.choice(['', '???', 'N/A', 'None'])

    return {
        'country': country,
        'state': state,
        'city': city,
        'postal_code': postal_code,
        'line1': line1,
        'line2': line2,
    }

def generate_stripe_test_transactions():
    return {
        "id": 'ch_' + random_string, 
        "object": "charge",
        "amount": random.randint(500, 50000), 
        "amount_captured": random.randint(500, 50000), 
        "amount_refunded": random.randint(0, 50000),
        "billing_details": {
            "address": random_address(random.choice(label))
        }, 
        "email": random_email(random.choice(label)), 
        "name": random_name(random.choice(label)),
        "phone": random_phone(random.choice(label))

    }

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