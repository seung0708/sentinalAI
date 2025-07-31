import pandas as pd
import re
import numpy as np

us_states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

feature_columns = [
    # frequency features
    'tx_count_last_5min', 'tx_count_last_10min', 'tx_count_last_30min', 'tx_count_last_1h',
    'combined_frequency_risk',
    
    # amount features
    'avg_amount', 'amount_risk_score',
    
    # address features
    'fake_address_score', 'addr_change_score', 'combined_address_risk', 'fake_component_count'
]

def add_combined_frequency_risk(df, intervals=['5min', '10min', '30min', '1h'], fixed_thresholds={'5min': 3, '10min': 5, '30min': 8, '1h': 15}):
    # stripe may retry to create the transaction with the same stripe_id
    
    # the below line will drop the duplicates if that happens
    # for when we test using csv file
    df = df.drop_duplicates(subset=['payment_intent_id'], keep='first')
    # for when we test using stripe
    # df = df.drop_duplicates(subset=['stripe_id'], keep='first')
        
    # sort by customer_id and timestamp
    df = df.sort_values(['customer_id', 'timestamp'])    

    # sorting the time intervals with the shortest first
    # done so that the risk is calculated starting from the shortest interval to the longest
    # pd.Timedelta() is used to convert the interval string to a timedelta object (5min -> 5:00:00)
    # sorted() is used to sort the intervals by their timedelta values
    intervals_sorted = sorted(intervals, key=lambda x: pd.Timedelta(x))
    
    risk_cols = []

    for interval in intervals_sorted:
        # creating column names for each interval
        count_col = f'tx_count_last_{interval}'
        avg_col = f'avg_tx_last_{interval}'
        risk_fixed_col = f'risk_fixed_{interval}'
        risk_relative_col = f'risk_relative_{interval}'
        combined_risk_col = f'risk_combined_{interval}'

        # for single transaction, set counts to 1
        if len(df) == 1:
            df[count_col] = 1
            df[avg_col] = 1
        else:
            try:
                # count transactions in rolling window
                window_size = pd.Timedelta(interval)
                
                counts = []
                for customer_id, group in df.groupby('customer_id'):
                    # group is a DataFrame of transactions for a single customer
                    # sort by timestamp
                    group = group.sort_values('timestamp')
                    # we get the timestamps of the transactions
                    timestamps = group['timestamp'].values
                    customer_counts = []
                    for i, ts in enumerate(timestamps):
                        # count transactions within window including current
                        window_start = ts - window_size # ts is '2025-07-01 10:00', window_size is '5min', so window_start is '2025-07-01 09:55'
                        # loops through all t in timestamps and counts how many transactions are in between window_start and ts
                        count = sum(1 for t in timestamps if window_start <= t <= ts)
                        customer_counts.append(count)
                    # flatten customer_counts into counts
                    counts.extend(customer_counts)
                df[count_col] = counts
                
            except Exception as e:
                print(f"Warning: Error calculating counts for {interval}: {e}")
                print(f"DataFrame columns: {df.columns}")
                print(f"Sample data:\n{df.head()}")
                df[count_col] = 1

            try:
                # calculate customer's average for this interval
                df[avg_col] = df.groupby('customer_id')[count_col].transform('mean')
            except Exception as e:
                print(f"Warning: Error calculating averages for {interval}: {e}")
                df[avg_col] = 1

        # takes interval as input and returns fixed threshold risk if threshold exists
        # if count is greater than or equal to threshold, set risk to 0.9, else 0.0
        threshold = fixed_thresholds.get(interval, None)
        if threshold is not None: 
            df[risk_fixed_col] = df[count_col].apply(lambda c: 0.9 if c >= threshold else 0.0)
        else:
            df[risk_fixed_col] = 0.0

        # 
        def relative_risk(count, avg):
            # if average is missing or 0, set risk to 0
            if pd.isna(avg) or avg == 0:
                return 0.0
            # if count is greater than average, set risk to 0.9, else 0.0
            return min(0.9, max(0.0, (count - avg) / avg))

        # calculate relative risk for each row
        df[risk_relative_col] = df.apply(lambda row: relative_risk(row[count_col], row[avg_col]), axis=1)
        
        #combined risk (max of fixed and relative)
        df[combined_risk_col] = df[[risk_fixed_col, risk_relative_col]].max(axis=1)
        risk_cols.append(combined_risk_col)
    
    #overall frequency risk (max across all intervals)
    df['combined_frequency_risk'] = df[risk_cols].max(axis=1)
    
    return df

def add_address_risk(transactions):
    # checks to see if line contains any of the following strings
    transactions['is_fake_street'] = transactions['billing_line1'].str.contains(
        'nowhere|unknown|test|p.o. box|99999', 
        case=False
    )
    # checks to see if city contains any of the following strings
    transactions['is_fake_city'] = transactions['billing_city'].str.contains(
        'unknown|test|fake|nowhere',
        case=False
    )
    # checks to see if state is not in the list of US states
    transactions['is_fake_state'] = ~transactions['billing_state'].str.upper().isin(us_states)
    # checks to see if postal code contains any of the following strings
    transactions['is_fake_postal'] = (
        transactions['billing_postal_code'].str.contains('00000|99999|11111|12345', case=False) |
        ~transactions['billing_postal_code'].str.match(r'^[0-9]{5}(?:-[0-9]{4})?$')
    )
    
    # calculate fake address score
    transactions['fake_address_score'] = (
        (transactions['is_fake_street'].astype(int) * 0.3) +
        (transactions['is_fake_city'].astype(int) * 0.2) +
        (transactions['is_fake_state'].astype(int) * 0.3) +
        (transactions['is_fake_postal'].astype(int) * 0.2)
    )
    
    # add address change score with first transaction handling
    transactions = transactions.sort_values(['customer_id', 'timestamp'])
    prev_addr = pd.DataFrame({
        'billing_line1': transactions.groupby('customer_id')['billing_line1'].shift(1),
        'billing_city': transactions.groupby('customer_id')['billing_city'].shift(1),
        'billing_state': transactions.groupby('customer_id')['billing_state'].shift(1),
        'billing_postal_code': transactions.groupby('customer_id')['billing_postal_code'].shift(1)
    })
    
    # only mark address change if we have a previous address to compare to
    has_prev = prev_addr.notna().any(axis=1)
    addr_changed = (
        (prev_addr['billing_line1'] != transactions['billing_line1']) |
        (prev_addr['billing_city'] != transactions['billing_city']) |
        (prev_addr['billing_state'] != transactions['billing_state']) |
        (prev_addr['billing_postal_code'] != transactions['billing_postal_code'])
    )
    transactions['addr_change_score'] = (has_prev & addr_changed).astype(float)
    
    # add combined address risk
    transactions['combined_address_risk'] = np.clip(
        transactions['fake_address_score'] + transactions['addr_change_score'],
        0, 1
    )
    
    # count number of fake components
    transactions['fake_component_count'] = (
        transactions['is_fake_street'].astype(int) +
        transactions['is_fake_city'].astype(int) +
        transactions['is_fake_state'].astype(int) +
        transactions['is_fake_postal'].astype(int)
    )
    
    return transactions

def add_amount_risk(df):
    # sorting values by customer_id, then timestamp
    df = df.sort_values(['customer_id', 'timestamp'])
    
    # for each customer, calculate the average amount of transactions
    # getting the average amount of all the transactions is done using expanding().mean()
    df['avg_amount'] = df.groupby('customer_id')['amount'].transform(
        lambda x: x.expanding().mean()
    )
    
    # if avg_amount is missing, fill with overall mean
    overall_mean = df['amount'].mean()
    df['avg_amount'] = df['avg_amount'].fillna(overall_mean) 
    
    # calculate amount risk score
    # np.clip limits the values to be between 0 and 1
    df['amount_risk_score'] = np.clip(
        (df['amount'] - df['avg_amount']) / (df['avg_amount'] + 1) + np.random.normal(0, 0.05, len(df)), 
        0, 1
    )
    
    # print amount details for debugging
    print("\nAmount risk check:")
    print(f"Amounts: {df['amount'].values}")
    print(f"Avg amounts: {df['avg_amount'].values}")
    print(f"Overall mean: {overall_mean}")
    print(f"Amount risk: {df['amount_risk_score'].values}")
    
    return df

