import pandas as pd
import numpy as np


def engineer_features(df):
    """Engineer additional features from raw health data."""
    df = df.copy()

    # Age group
    df['age_group'] = pd.cut(
        df['age'],
        bins=[0, 40, 60, 100],
        labels=['young', 'middle', 'senior']
    )

    # BMI category
    conditions = [
        df['bmi'] < 18.5,
        (df['bmi'] >= 18.5) & (df['bmi'] < 25),
        (df['bmi'] >= 25) & (df['bmi'] < 30),
        df['bmi'] >= 30
    ]
    choices = ['underweight', 'normal', 'overweight', 'obese']
    df['bmi_category'] = np.select(conditions, choices, default='normal')

    # Glucose risk
    glucose_conditions = [
        df['avg_glucose_level'] < 100,
        (df['avg_glucose_level'] >= 100) & (df['avg_glucose_level'] < 126),
        df['avg_glucose_level'] >= 126
    ]
    glucose_choices = ['normal', 'prediabetic', 'diabetic']
    df['glucose_risk'] = np.select(glucose_conditions, glucose_choices, default='normal')

    # Composite risk score
    df['composite_risk'] = (
        df['hypertension'] * 0.3 +
        df['heart_disease'] * 0.3 +
        (df['avg_glucose_level'] > 126).astype(int) * 0.2 +
        (df['bmi'] > 30).astype(int) * 0.1 +
        (df['age'] > 60).astype(int) * 0.1
    )

    # Age-BMI interaction
    df['age_bmi_interaction'] = df['age'] * df['bmi'] / 100

    return df


def validate_input(data):
    """Validate input data and return errors if any."""
    errors = []
    required_fields = [
        'age', 'gender', 'hypertension', 'heart_disease', 'ever_married',
        'work_type', 'Residence_type', 'avg_glucose_level', 'bmi', 'smoking_status'
    ]

    for field in required_fields:
        if field not in data:
            errors.append(f'Missing required field: {field}')

    if not errors:
        if not (18 <= data.get('age', 0) <= 100):
            errors.append('Age must be between 18 and 100')
        if not (10 <= data.get('bmi', 0) <= 60):
            errors.append('BMI must be between 10 and 60')
        if not (50 <= data.get('avg_glucose_level', 0) <= 300):
            errors.append('Glucose level must be between 50 and 300')

        # Check for NaN
        for field in ['age', 'bmi', 'avg_glucose_level']:
            val = data.get(field)
            if val is not None and (isinstance(val, float) and np.isnan(val)):
                errors.append(f'Invalid value for {field}: NaN')

    return errors
