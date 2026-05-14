"""
Train XGBoost stroke prediction model on the Kaggle Stroke Prediction Dataset.
Produces the same .pkl files that load_model() expects.

Usage: python3 ml-service/train.py
"""

import os
import sys
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OrdinalEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
from sklearn.ensemble import GradientBoostingClassifier

# Add parent dir so we can import preprocess
sys.path.insert(0, os.path.dirname(__file__))
from preprocess import engineer_features

# Paths
CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'spec', 'healthcare-dataset-stroke-data 2.csv')
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

# Feature lists (must match predict.py)
NUMERIC_FEATURES = ['age', 'hypertension', 'heart_disease', 'avg_glucose_level',
                    'bmi', 'composite_risk', 'age_bmi_interaction']
CATEGORICAL_FEATURES = ['gender', 'ever_married', 'work_type', 'Residence_type',
                        'smoking_status', 'age_group', 'bmi_category', 'glucose_risk']


def load_and_clean(path):
    df = pd.read_csv(path)
    print(f"Loaded {len(df)} rows from dataset")

    # Drop id column
    df = df.drop(columns=['id'])

    # Fix BMI: 'N/A' strings → NaN → median
    df['bmi'] = pd.to_numeric(df['bmi'], errors='coerce')
    bmi_median = df['bmi'].median()
    df['bmi'] = df['bmi'].fillna(bmi_median)
    print(f"Filled {df['bmi'].isna().sum()} missing BMI values with median {bmi_median:.1f}")

    # Filter adults only (matches validate_input range)
    before = len(df)
    df = df[df['age'] >= 18]
    print(f"Filtered to age >= 18: {before} → {len(df)} rows")

    # Drop gender == 'Other' (only 1 row)
    df = df[df['gender'] != 'Other']

    # Extract target before feature engineering
    y = df['stroke'].values
    df = df.drop(columns=['stroke'])

    return df, y


def train():
    df, y = load_and_clean(CSV_PATH)

    # Engineer features (same as prediction pipeline)
    df = engineer_features(df)

    all_features = NUMERIC_FEATURES + CATEGORICAL_FEATURES
    X = df[all_features]

    # Stratified split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"\nTrain: {len(X_train)} samples ({y_train.sum()} positive)")
    print(f"Test:  {len(X_test)} samples ({y_test.sum()} positive)")

    # Preprocessor (same config as _create_demo_model)
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), NUMERIC_FEATURES),
            ('cat', OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1), CATEGORICAL_FEATURES)
        ]
    )

    X_train_t = preprocessor.fit_transform(X_train)
    X_test_t = preprocessor.transform(X_test)

    neg_count = (y_train == 0).sum()
    pos_count = (y_train == 1).sum()
    print(f"\nClass ratio: {neg_count}:{pos_count}")

    model = GradientBoostingClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.1,
        random_state=42
    )
    model.fit(X_train_t, y_train)

    # Evaluate
    y_pred = model.predict(X_test_t)
    y_proba = model.predict_proba(X_test_t)[:, 1]

    print("\n=== Classification Report ===")
    print(classification_report(y_test, y_pred))

    auc = roc_auc_score(y_test, y_proba)
    print(f"AUC-ROC: {auc:.4f}")

    print("\nConfusion Matrix:")
    cm = confusion_matrix(y_test, y_pred)
    print(cm)

    # Save model and preprocessor
    os.makedirs(MODEL_DIR, exist_ok=True)
    model_path = os.path.join(MODEL_DIR, 'welltrack_xgb_model.pkl')
    preprocessor_path = os.path.join(MODEL_DIR, 'preprocessor.pkl')
    joblib.dump(model, model_path)
    joblib.dump(preprocessor, preprocessor_path)
    print(f"\nModel saved to {model_path}")
    print(f"Preprocessor saved to {preprocessor_path}")


if __name__ == '__main__':
    train()
