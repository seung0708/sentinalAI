
import uuid
import csv
import random
import string
from datetime import datetime, timedelta
from faker import Faker

#configuration 
#NUM_ROWS = 50000 #
CUSTOMERS= 1000
FRAUD_RATE = 0.05
CURRENCIES = ['usd','eur','cad']
#PAYMENT_METHODS = ['card', 'bank_transfer','paypal']
PAYMENT_METHODS = ['card', 'google_pay', 'apple_pay', 'stripe']
#FRAUD_REASONS = ["stolen_card", "unusual_location", "high_risk_country", "amount_too_large", "multiple_failed_attempts", "suspicious_email_domain"]

faker = Faker()
fraud_phones_pool = [faker.phone_number() for _ in range(10)]
fraud_street = ['123 Fake Street, Faketown', 'PO Box 4567', '0 Null Avenue', '999 Unknown Blvd', '321 Imaginary Rd']
fraud_city = ['Faketown', 'Anytown', 'Nowhere', 'Mystery', 'Fakesville']
fraud_zip = ['99999', '12345','00000' ] 

def generate_stripe_customer_id():
    suffix = ''.join(random.choices(string.ascii_letters + string.digits, k=14))
    return "cus_" + suffix

def generate_payment_intent_id():
    suffix = ''.join(random.choices(string.ascii_letters + string.digits, k=24))
    return "pi_" + suffix

def generate_fraud_email():
    suspicious_names = [
        ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=random.randint(8, 15))),
        faker.first_name().lower() + str(random.randint(1000, 9999)), 
        faker.last_name().lower() + str(random.randint(100,999))
    ]
    domain = random.choice(['gmail.com', 'outlook.com', 'yahoo.com'])
    return random.choice(suspicious_names) + '@' + domain

def generate_fraud_phone():
    return random.choice(fraud_phones_pool) 

def generate_amount(is_fraud):
    if is_fraud:
        # 70% small test amounts, 30% large suspicious amounts
        if random.random() < 0.7:
            return round(random.uniform(1, 20), 2)
        else:
            return round(random.uniform(800, 1500), 2)
    else:
        # normal transactions mainly between 10-200, some up to 1000
        if random.random() < 0.9:
            return round(random.uniform(10, 200), 2)
        else:
            return round(random.uniform(200, 1000), 2)
        

def generate_transactions(num_customers=CUSTOMERS, transactions_per_customer=20):
    transactions = []
    now = datetime.now()

    customer_ids = [generate_stripe_customer_id() for _ in range(num_customers)]

    for idx, customer_id in enumerate(customer_ids, start=1):
        is_fraud_customer = (idx % 10 == 0)

        for _ in range(transactions_per_customer):
            minutes_offset = random.randint(0, 48 * 60)  
            granularity = random.choice([5, 10, 30]) 
            aligned_minutes = (minutes_offset // granularity) * granularity
            timestamp = now - timedelta(minutes=aligned_minutes)
            
            status = random.choices(['failed', 'succeeded'], weights=[0.5, 0.5])[0] if is_fraud_customer else random.choices(['failed', 'succeeded'], weights=[0.1, 0.9])[0]

            amount = generate_amount(is_fraud_customer)

            billing_email = generate_fraud_email() if (is_fraud_customer and random.random() < 0.3) else faker.email()
            billing_phone = generate_fraud_phone() if (is_fraud_customer and random.random() < 0.3) else faker.phone_number()
            billing_name = (faker.first_name() + " " + faker.last_name() + "_fraud") if (is_fraud_customer and random.random() < 0.3) else faker.name()

            if is_fraud_customer:
                # 10% chance of obvious fake address
                if random.random() < 0.1:
                    street = random.choice(fraud_street)
                    city = random.choice(fraud_city)
                    state = faker.city()
                    postal_code = random.choice(fraud_zip)
                else:
                    street = faker.street_address()
                    city = faker.city()
                    state = faker.state_abbr()
                    postal_code = faker.postcode()
            else:
                street = faker.street_address()
                city = faker.city()
                state = faker.state_abbr()
                postal_code = faker.postcode()

            #payment_method_type = random.choice(PAYMENT_METHODS)
            payment_intent_id = generate_payment_intent_id()

            transaction = {
                "payment_intent_id": payment_intent_id,
                "customer_id": customer_id,
                "timestamp": timestamp.isoformat(),
                "status": status,
                "amount": amount,
                "billing_email": billing_email, 
                "billing_name": billing_name,
                "billing_phone": billing_phone,
                "billing_line1": street, 
                "billing_city": city,
                "billing_state": state,
                "billing_postal_code": postal_code,
                "payment_method_type": 'card',
            }

            transactions.append(transaction)

    return transactions

# def generate_transaction(fraud=False):
#     txn_id = str(uuid.uuid4())
#     amount = random.randint(500, 50000) if not fraud else random.choice([99999, 1, 5])
#     currency = random.choice(CURRENCIES)
#     payment_method = random.choice(PAYMENT_METHODS)
#     created = random_date(datetime(2022, 1, 1), datetime(2024, 4, 1))
#     metadata = {'user_id': str(uuid.uuid4())}
#     is_fraud = int(fraud)
#     fraud_reason = random.choice(FRAUD_REASONS) if fraud else None 

#     return { 
#          "stripe_id": txn_id,
#         "amount": amount,
#         "currency": currency,
#         "created": created.isoformat(),
#         "payment_method": payment_method,
#         "user_id": metadata["user_id"],
#         "is_fraud": is_fraud,
#         "fraud_reason": fraud_reason
#     }

# def generate_dataset():
#     data = []
#     for _ in range(NUM_ROWS):
#         fraud = random.random() < FRAUD_RATE
#         data.append(generate_transaction(fraud))
#     return data

def write_csv(filename="sample_transactions.csv"):
    data = generate_transactions(CUSTOMERS, transactions_per_customer=20)
    with open(filename, mode='w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
    print('Generated data')

if __name__ == "__main__":
    write_csv()