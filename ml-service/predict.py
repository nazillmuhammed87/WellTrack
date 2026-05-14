import os
import joblib
import numpy as np
import pandas as pd
import shap
from preprocess import engineer_features

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

model = None
preprocessor = None
explainer = None
model_loaded = False
load_error = None

FEATURE_LABELS = {
    'age': 'Age',
    'hypertension': 'Hypertension',
    'heart_disease': 'Heart Disease',
    'avg_glucose_level': 'Glucose Level',
    'bmi': 'BMI',
    'composite_risk': 'Composite Risk Score',
    'age_bmi_interaction': 'Age × BMI',
    'gender': 'Gender',
    'ever_married': 'Marital Status',
    'work_type': 'Work Type',
    'Residence_type': 'Residence Type',
    'smoking_status': 'Smoking Status',
    'age_group': 'Age Group',
    'bmi_category': 'BMI Category',
    'glucose_risk': 'Glucose Risk',
}


def load_model():
    """Load model and preprocessor at startup."""
    global model, preprocessor, model_loaded, load_error

    model_path = os.path.join(MODEL_DIR, 'welltrack_xgb_model.pkl')
    preprocessor_path = os.path.join(MODEL_DIR, 'preprocessor.pkl')

    try:
        if os.path.exists(model_path) and os.path.exists(preprocessor_path):
            model = joblib.load(model_path)
            preprocessor = joblib.load(preprocessor_path)
            model_loaded = True
            print("Model and preprocessor loaded successfully")
        else:
            # Create a demo model for development
            _create_demo_model()
            model_loaded = True
            print("Demo model created for development")
    except Exception as e:
        load_error = str(e)
        print(f"FATAL: Failed to load model: {e}")
        # Create demo model as fallback
        try:
            _create_demo_model()
            model_loaded = True
            load_error = None
            print("Fallback demo model created")
        except Exception as e2:
            load_error = str(e2)
            print(f"FATAL: Demo model creation also failed: {e2}")

    if model_loaded and model is not None:
        global explainer
        try:
            explainer = shap.TreeExplainer(model)
            print("SHAP explainer initialised")
        except Exception as e:
            print(f"SHAP explainer init failed (will skip per-patient explanations): {e}")


def _create_demo_model():
    """Create a demo model using structured cohorts that reflect real stroke risk patterns."""
    global model, preprocessor
    from sklearn.preprocessing import StandardScaler, OrdinalEncoder
    from sklearn.compose import ColumnTransformer
    from sklearn.ensemble import GradientBoostingClassifier

    numeric_features = ['age', 'hypertension', 'heart_disease', 'avg_glucose_level',
                        'bmi', 'composite_risk', 'age_bmi_interaction']
    categorical_features = ['gender', 'ever_married', 'work_type', 'Residence_type',
                            'smoking_status', 'age_group', 'bmi_category', 'glucose_risk']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1), categorical_features)
        ]
    )

    np.random.seed(42)
    rng = np.random.default_rng(42)

    # --- HIGH RISK cohort (500 samples): older, multiple comorbidities ---
    n_h = 500
    high = pd.DataFrame({
        'age': rng.integers(58, 90, n_h),
        'gender': rng.choice(['Male', 'Female'], n_h),
        'hypertension': rng.choice([0, 1], n_h, p=[0.15, 0.85]),
        'heart_disease': rng.choice([0, 1], n_h, p=[0.25, 0.75]),
        'ever_married': rng.choice(['Yes', 'No'], n_h, p=[0.85, 0.15]),
        'work_type': rng.choice(['Private', 'Self-employed', 'Govt_job', 'Never_worked'], n_h),
        'Residence_type': rng.choice(['Urban', 'Rural'], n_h),
        'avg_glucose_level': rng.uniform(126, 290, n_h),
        'bmi': rng.uniform(28, 55, n_h),
        'smoking_status': rng.choice(['formerly smoked', 'smokes'], n_h, p=[0.35, 0.65]),
    })
    y_h = np.ones(n_h, dtype=int)

    # --- MEDIUM RISK cohort (700 samples): middle-aged, some risk factors ---
    n_m = 700
    med = pd.DataFrame({
        'age': rng.integers(40, 65, n_m),
        'gender': rng.choice(['Male', 'Female'], n_m),
        'hypertension': rng.choice([0, 1], n_m, p=[0.45, 0.55]),
        'heart_disease': rng.choice([0, 1], n_m, p=[0.55, 0.45]),
        'ever_married': rng.choice(['Yes', 'No'], n_m),
        'work_type': rng.choice(['Private', 'Self-employed', 'Govt_job', 'children', 'Never_worked'], n_m),
        'Residence_type': rng.choice(['Urban', 'Rural'], n_m),
        'avg_glucose_level': rng.uniform(90, 175, n_m),
        'bmi': rng.uniform(23, 38, n_m),
        'smoking_status': rng.choice(['formerly smoked', 'never smoked', 'smokes', 'Unknown'], n_m),
    })
    y_m = rng.choice([0, 1], n_m, p=[0.55, 0.45])

    # --- LOW RISK cohort (800 samples): young, healthy ---
    n_l = 800
    low = pd.DataFrame({
        'age': rng.integers(18, 50, n_l),
        'gender': rng.choice(['Male', 'Female', 'Other'], n_l),
        'hypertension': rng.choice([0, 1], n_l, p=[0.92, 0.08]),
        'heart_disease': rng.choice([0, 1], n_l, p=[0.97, 0.03]),
        'ever_married': rng.choice(['Yes', 'No'], n_l),
        'work_type': rng.choice(['Private', 'Self-employed', 'Govt_job', 'children', 'Never_worked'], n_l),
        'Residence_type': rng.choice(['Urban', 'Rural'], n_l),
        'avg_glucose_level': rng.uniform(55, 115, n_l),
        'bmi': rng.uniform(15, 28, n_l),
        'smoking_status': rng.choice(['never smoked', 'Unknown'], n_l, p=[0.85, 0.15]),
    })
    y_l = np.zeros(n_l, dtype=int)

    train_data = pd.concat([high, med, low], ignore_index=True)
    y = np.concatenate([y_h, y_m, y_l])

    train_data = engineer_features(train_data)

    all_features = numeric_features + categorical_features
    X = train_data[all_features]
    X_transformed = preprocessor.fit_transform(X)

    model = GradientBoostingClassifier(
        n_estimators=200, max_depth=5, learning_rate=0.05,
        subsample=0.8, random_state=42
    )
    model.fit(X_transformed, y)

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, os.path.join(MODEL_DIR, 'welltrack_xgb_model.pkl'))
    joblib.dump(preprocessor, os.path.join(MODEL_DIR, 'preprocessor.pkl'))


def make_prediction(data):
    """Make stroke risk prediction."""
    if not model_loaded:
        raise RuntimeError(f"Model not loaded: {load_error}")

    df = pd.DataFrame([data])
    df = engineer_features(df)

    numeric_features = ['age', 'hypertension', 'heart_disease', 'avg_glucose_level',
                        'bmi', 'composite_risk', 'age_bmi_interaction']
    categorical_features = ['gender', 'ever_married', 'work_type', 'Residence_type',
                            'smoking_status', 'age_group', 'bmi_category', 'glucose_risk']
    all_features = numeric_features + categorical_features

    X = df[all_features]
    X_transformed = preprocessor.transform(X)

    prediction = int(model.predict(X_transformed)[0])
    probabilities = model.predict_proba(X_transformed)[0]
    probability = float(probabilities[1])  # Probability of stroke

    # Risk level
    if probability < 0.35:
        risk_level = 'Low'
    elif probability < 0.60:
        risk_level = 'Medium'
    else:
        risk_level = 'High'

    # Confidence
    confidence = float(max(probabilities))

    # Per-patient SHAP explanations
    top_features = []
    if explainer is not None:
        try:
            shap_vals = explainer.shap_values(X_transformed)
            # shap_vals shape: (1, n_features) for binary XGBoost
            patient_shap = np.array(shap_vals[0] if isinstance(shap_vals, list) else shap_vals).flatten()
            raw_values = X[all_features].iloc[0].to_dict()
            top_indices = np.argsort(np.abs(patient_shap))[::-1][:5]
            for i in top_indices:
                feat = all_features[i]
                val = raw_values[feat]
                if hasattr(val, 'item'):
                    val = val.item()
                if isinstance(val, float):
                    val = round(val, 2)
                top_features.append({
                    'feature': FEATURE_LABELS.get(feat, feat),
                    'value': str(val),
                    'impact': round(float(patient_shap[i]), 4)
                })
        except Exception as e:
            print(f"SHAP explanation failed: {e}")

    # Fallback to global feature importances if SHAP unavailable
    if not top_features:
        importances = model.feature_importances_
        top_indices = np.argsort(importances)[::-1][:5]
        top_features = [
            {'feature': FEATURE_LABELS.get(all_features[i], all_features[i]),
             'value': None,
             'impact': round(float(importances[i]), 4)}
            for i in top_indices
        ]

    # Warning for values outside typical range
    warnings = []
    if data.get('avg_glucose_level', 0) > 250:
        warnings.append('Extremely high glucose level detected')
    if data.get('bmi', 0) > 50:
        warnings.append('Extremely high BMI detected')
    if data.get('age', 0) > 85:
        warnings.append('Advanced age - prediction confidence may vary')

    result = {
        'prediction': prediction,
        'probability': round(probability, 4),
        'risk_level': risk_level,
        'confidence': round(confidence, 4),
        'top_features': top_features
    }

    if warnings:
        result['warnings'] = warnings

    return result
