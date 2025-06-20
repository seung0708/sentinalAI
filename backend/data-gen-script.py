import csv
import numpy as np
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

def generate_transactions(business_size='small', fraud_customer_rate=0.1, days=30):
    transactions = []
    
    now = datetime.now()

    # set number of customers and avg txn count range based on business size
    if business_size == 'small':
        num_customers = random.randint(50, 150)
        txn_per_cust_range = (5, 15)
    elif business_size == 'medium':
        num_customers = random.randint(200, 500)
        txn_per_cust_range = (10, 25)
    elif business_size == 'large':
        num_customers = random.randint(600, 1000)
        txn_per_cust_range = (20, 40)
    else:
        raise ValueError("business_size must be 'small', 'medium', or 'large'")

    customer_ids = [generate_stripe_customer_id() for _ in range(num_customers)]
    # creating a home address dictionary for each customer_id
    default_addresses = {}
    for customer_id in customer_ids:
        default_addresses[customer_id] = {
            "street": faker.street_address(),
            "city": faker.city(),
            "state": faker.state_abbr(),
            "postal_code": faker.postcode()
        }

    for customer_id in customer_ids:
        is_fraud_customer = random.random() < fraud_customer_rate

        txn_count = random.randint(txn_per_cust_range[0], txn_per_cust_range[1])

        transaction_times = []

        for _ in range(txn_count):
            r = random.random()
            if r < 0.7:
                hour = random.randint(8, 20)   # normal hours
            elif r < 0.9:
                hour = random.randint(21, 23)  # late night
            else:
                hour = random.randint(0, 5)    # early morning

            minutes_offset = random.randint(0, days * 24 * 60)
            intervals = random.choice([5, 10, 30])
            aligned_minutes = (minutes_offset // intervals) * intervals
            txn_time = now - timedelta(minutes=aligned_minutes)
            txn_time = txn_time.replace(hour=hour, minute=txn_time.minute, second=txn_time.second, microsecond=0)

            transaction_times.append(txn_time)
        
        transaction_times.sort()
        default_addr = default_addresses[customer_id]

        for timestamp in transaction_times:        
            if business_size == 'small':
                normal_amount_range = (5, 100)
                fraud_amount_range = (50, 500)
            elif business_size == 'medium':
                normal_amount_range = (10, 300)
                fraud_amount_range = (100, 1000)
            else:  # large
                normal_amount_range = (20, 1000)
                fraud_amount_range = (200, 2000)

            if is_fraud_customer:
                amount = round(random.uniform(fraud_amount_range[0], fraud_amount_range[1]), 2)
            else:
                amount = round(random.uniform(normal_amount_range[0], normal_amount_range[1]), 2)

            billing_email = generate_fraud_email() if (is_fraud_customer and random.random() < 0.3) else faker.email()
            billing_phone = generate_fraud_phone() if (is_fraud_customer and random.random() < 0.3) else faker.phone_number()
            billing_name = (faker.first_name() + " " + faker.last_name() + "_fraud") if (is_fraud_customer and random.random() < 0.3) else faker.name()

           # for fraud, occasionally change address to fake or random; else mostly stable with rare change
            if is_fraud_customer:
                if random.random() < 0.2:
                    street = random.choice(fraud_street)
                    city = random.choice(fraud_city)
                    state = faker.state_abbr()
                    postal_code = random.choice(fraud_zip)
                else:
                    street = default_addr['street']
                    city = default_addr['city']
                    state = default_addr['state']
                    postal_code = default_addr['postal_code']
            else:
                # non-fraud customer: 95% same address, 5% move to new address
                if random.random() < 0.05:
                    # New address
                    default_addr = {
                        "street": faker.street_address(),
                        "city": faker.city(),
                        "state": faker.state_abbr(),
                        "postal_code": faker.postcode()
                    }
                    default_addresses[customer_id] = default_addr

                street = default_addr['street']
                city = default_addr['city']
                state = default_addr['state']
                postal_code = default_addr['postal_code']

            payment_intent_id = generate_payment_intent_id()

            transaction = {
                "payment_intent_id": payment_intent_id,
                "customer_id": customer_id,
                "timestamp": timestamp.isoformat(),
                "status": 'succeeded',
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

def write_csv(filename="sample_transactions_small.csv"):
    data = generate_transactions('small')
    with open(filename, mode='w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
    print('Generated data')

if __name__ == "__main__":
    write_csv()