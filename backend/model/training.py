import xgboost as xgb
import pandas as pd
import numpy as np

FREQ_FEATURES = [
    'tx_count_last_5min', 'tx_count_last_10min', 'tx_count_last_30min', 'tx_count_last_1h',
    'combined_frequency_risk'
]

AMOUNT_FEATURES = [
    'avg_amount', 'amount_risk_score'
]

ADDRESS_FEATURES = [
    'fake_address_score', 'addr_change_score', 'combined_address_risk', 'fake_component_count'
]

def train_specialized_model(X, y, features, params=None):
    """Train a specialized XGBoost model"""
    if params is None:
        params = {
            'max_depth': 4,
            'learning_rate': 0.01,
            'n_estimators': 200,
            'objective': 'multi:softprob',
            'num_class': 3,
            'random_state': 42
        }
    
    model = xgb.XGBClassifier(**params)
    model.fit(X[features], y)
    return model, features

def train_frequency_model(X, y, params=None):
    """Train model focused on frequency-based features"""
    return train_specialized_model(X, y, FREQ_FEATURES, params)

def train_amount_model(X, y, params=None):
    """Train model focused on amount-based features"""
    return train_specialized_model(X, y, AMOUNT_FEATURES, params)

def train_address_model(X, y, params=None):
    """Train model focused on address-based features"""
    return train_specialized_model(X, y, ADDRESS_FEATURES, params)

def create_meta_features(X, freq_model, amount_model, address_model, freq_features, amount_features, address_features, is_scaled=False):
    # Get probabilities from each model
    freq_proba = freq_model.predict_proba(X[freq_features])
    amount_proba = amount_model.predict_proba(X[amount_features])
    addr_proba = address_model.predict_proba(X[address_features])
    
    # Add minimal noise (0.02)
    noise = np.random.normal(0, 0.02, freq_proba.shape)
    freq_proba = np.clip(freq_proba + noise, 0, 1)
    freq_proba = freq_proba / freq_proba.sum(axis=1, keepdims=True)
    
    noise = np.random.normal(0, 0.02, amount_proba.shape)
    amount_proba = np.clip(amount_proba + noise, 0, 1)
    amount_proba = amount_proba / amount_proba.sum(axis=1, keepdims=True)
    
    noise = np.random.normal(0, 0.02, addr_proba.shape)
    addr_proba = np.clip(addr_proba + noise, 0, 1)
    addr_proba = addr_proba / addr_proba.sum(axis=1, keepdims=True)
    
    # Create column names for each probability
    freq_cols = [f'freq_prob_{i}' for i in range(freq_proba.shape[1])]
    amount_cols = [f'amount_prob_{i}' for i in range(amount_proba.shape[1])]
    addr_cols = [f'addr_prob_{i}' for i in range(addr_proba.shape[1])]
    
    # Combine features with weights
    meta_features = pd.DataFrame(
        np.concatenate([
            freq_proba * 0.1,    # Reduce frequency weight to 10%
            amount_proba * 0.1,  # Reduce amount weight to 10%
            addr_proba * 0.3,    # Reduce address model weight to 30%
            X[['fake_component_count']].values * 25.0  # Increase to 25x for stronger effect
        ], axis=1),
        columns=freq_cols + amount_cols + addr_cols + ['fake_component_score']
    )
    
    return meta_features