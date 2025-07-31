import numpy as np

FREQ_FEATURES = [
    'tx_count_last_5min', 'tx_count_last_10min',
    'tx_count_last_30min', 'tx_count_last_1h',
    'combined_frequency_risk'
]

AMOUNT_FEATURES = [
    'avg_amount', 'amount_risk_score'
]

ADDRESS_FEATURES = [
    'fake_address_score', 'addr_change_score',
    'combined_address_risk', 'fake_component_count'
]

feature_columns = [
    'tx_count_last_5min', 'tx_count_last_10min', 'tx_count_last_30min', 'tx_count_last_1h',
    'combined_frequency_risk', 'fake_address_score', 'addr_change_score', 'combined_address_risk',
    'avg_amount', 'amount_risk_score', 'fake_component_count'
]

def predict_risk(X, model):
    # Get probabilities from each specialized model
    freq_proba = model['frequency'].predict_proba(X[FREQ_FEATURES])
    amount_proba = model['amount'].predict_proba(X[AMOUNT_FEATURES])
    address_proba = model['address'].predict_proba(X[ADDRESS_FEATURES])
    
    # combine probabilities (average of all models)
    combined_proba = (freq_proba + amount_proba + address_proba) / 3
    
    # Initialize risk arrays
    high_risk = [False for _ in range(len(X))]    # Start with all False
    medium_risk = [False for _ in range(len(X))]   # Start with all False
    
    
    # Check each transaction
    for idx in range(len(X)):
        # High risk conditions
        if (freq_proba[idx, 2] >= 0.60 or
            amount_proba[idx, 2] >= 0.60 or
            address_proba[idx, 2] >= 0.60 or
            (X['combined_frequency_risk'].iloc[idx] >= 0.80 and X['amount_risk_score'].iloc[idx] > 0.80) or
            X['fake_component_count'].iloc[idx] >= 3 or
            X['fake_address_score'].iloc[idx] >= 0.95):
            high_risk[idx] = True
        # Medium risk conditions
        elif ((freq_proba[idx, 1] >= 0.50 and X['combined_frequency_risk'].iloc[idx] >= 0.30) or
              (amount_proba[idx, 1] >= 0.50 and X['amount_risk_score'].iloc[idx] >= 0.30) or
              (address_proba[idx, 1] >= 0.50 and X['combined_address_risk'].iloc[idx] >= 0.30) or
              X['fake_component_count'].iloc[idx] >= 2 or
              X['combined_frequency_risk'].iloc[idx] >= 0.50 or
              X['addr_change_score'].iloc[idx] >= 0.8):
            medium_risk[idx] = True

    print("frequency probabilities:", freq_proba)
    print("amount probabilities:", amount_proba)
    print("address probabilities:", address_proba)
    print("combined probabilities:", combined_proba)
    print("medium risk:", medium_risk)

    # adjust probabilities based on rules
    final_proba = combined_proba.copy()
    final_proba[high_risk, 2] = np.maximum(0.90, final_proba[high_risk, 2])
    final_proba[medium_risk & ~high_risk, 1] = np.maximum(0.75, final_proba[medium_risk & ~high_risk, 1])  # Medium risk
    
    # normalize probabilities to sum to 1
    final_proba = final_proba / final_proba.sum(axis=1, keepdims=True)
    
    return final_proba