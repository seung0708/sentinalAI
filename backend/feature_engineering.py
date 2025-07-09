import pandas as pd
import re


def add_combined_frequency_risk(df, intervals, fixed_thresholds, weight=3):

    # sorts the intervals list to shortest first
    # Timedelta converts the string into actual time objects in order to sort the list (i.e. 5min -> 0 days 00:05:00)
    # doing this so we can catch suspicious activity as soon as they happen
    intervals_sorted = sorted(intervals, key=lambda x: pd.Timedelta(x))

    # keep a list of all risk scores from every time interval to combine them later
    risk_cols = []

    for interval in intervals_sorted:
        # adding interval column (i.e. '5min') and rounding down each transaction's timestamp to the current interval
        df[interval] = df['timestamp'].dt.floor(interval)

        count_col = f'tx_count_last_{interval}'
        avg_col = f'avg_tx_last_{interval}'
        risk_fixed_col = f'risk_fixed_{interval}'
        risk_relative_col = f'risk_relative_{interval}'
        combined_risk_col = f'risk_combined_{interval}'

        # actual number of transactions in each time interval
        df[count_col] = df.groupby(['customer_id', interval])['timestamp'].transform('count')

        # customer's average transaction count for each interval (to capture typical behavior)
        df[avg_col] = df.groupby('customer_id')[count_col].transform('mean')

        # lags when transaction count exceeds an absolute threshold (e.g., 3 transactions in 5 min)
        threshold = fixed_thresholds.get(interval, None)
        if threshold is not None:
            df[risk_fixed_col] = df[count_col].apply(lambda c: 0.9 if c >= threshold else 0.0)
        else:
            df[risk_fixed_col] = 0.0

        # flags when count significantly exceeds customer's average behavior (using a weight multiplier)
        def relative_risk(count, avg):
            if pd.isna(avg) or avg == 0:
                return 0.2  # Low risk if no average
            if count > avg * weight:
                return 0.9
            elif count > avg * 1.5:
                return 0.7
            elif count > avg:
                return 0.5
            else:
                return 0.2

        df[risk_relative_col] = df.apply(lambda row: relative_risk(row[count_col], row[avg_col]), axis=1)

        # Combine fixed and relative risks for this interval by taking the maximum,
        # so the highest risk signal from either method is used to flag suspicious activity.
        df[combined_risk_col] = df[[risk_fixed_col, risk_relative_col]].max(axis=1)

        risk_cols.append(combined_risk_col)

    # For each row, return the highest risk from the shortest interval flagged
    def shortest_interval_risk(row):
        for col in risk_cols:
            if row[col] >= 0.5:  # threshold to consider flagged, adjust as needed
                return row[col]
        return 0.2  # low risk if none flagged

    df['combined_frequency_risk'] = df.apply(shortest_interval_risk, axis=1)

    return df

def add_address_risk(df):
    fraud_city = {'Faketown', 'Anytown', 'Nowhere', 'Mystery', 'Fakesville'}
    pattern = r'(?i)\b(fake|null|test|unknown|imaginary|p\.?\s?o\.?\s?box)\b'

    df['is_fake_street'] = df['billing_line1'].apply(lambda row: 1 if isinstance(row, str) and isinstance(re.search(pattern, row), re.Match) else 0)
    df['is_fake_city'] = df['billing_city'].apply(lambda city: 1 if isinstance(city, str) and city.strip() in fraud_city else 0)

    df['fake_address_score'] = df[['is_fake_street', 'is_fake_city']].max(axis=1).apply(lambda x: 0.9 if x == 1 else 0.2)

    df['street_counts'] = df.groupby('customer_id')['billing_line1'].transform('nunique')
    df['city_counts'] = df.groupby('customer_id')['billing_city'].transform('nunique')
    df['state_counts'] = df.groupby('customer_id')['billing_state'].transform('nunique')
    df['zip_counts'] = df.groupby('customer_id')['billing_postal_code'].transform('nunique')

    def calc_risk_score(row):
        if row['street_counts'] == 1 and row['city_counts'] == 1 and row['state_counts'] == 1 and row['zip_counts'] == 1:
            return 0.2
        elif row['street_counts'] >= 4 or row['city_counts'] >= 4 or row['state_counts'] >= 4 or row['zip_counts'] >= 4:
            return 0.9
        else:
            return 0.5
        
    df['addr_change_score'] = df.apply(calc_risk_score, axis=1)

    df['combined_address_risk'] = df[['fake_address_score', 'addr_change_score']].max(axis=1)

    return df

def add_amount_risk(df):
    df['avg_amount'] = df.groupby('customer_id')['amount'].transform('mean')

    def get_score(amount, avg):
        if amount >= avg * 3 or amount <= avg / 3:
            return 0.9
        elif amount >= avg * 2 or amount <= avg /2:
            return 0.7
        elif amount >= avg * 1.5 or amount <= avg / 1.5:
            return 0.5
        else: 
            return 0.2
        
    df['amount_risk_score'] = df.apply(lambda row: get_score(row['amount'], row['avg_amount']), axis=1)
    return df