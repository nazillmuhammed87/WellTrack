export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';

export const RISK_LEVELS = {
  Low: { color: '#28a745', label: 'Low Risk', bg: 'success' },
  Medium: { color: '#ffc107', label: 'Medium Risk', bg: 'warning' },
  High: { color: '#dc3545', label: 'High Risk', bg: 'danger' }
};

export const SPECIALIZATIONS = [
  'Cardiologist', 'Neurologist', 'General Physician', 'Endocrinologist'
];

export const WORK_TYPES = [
  { value: 'Private', label: 'Private' },
  { value: 'Self-employed', label: 'Self-employed' },
  { value: 'Govt_job', label: 'Government Job' },
  { value: 'children', label: 'Children' },
  { value: 'Never_worked', label: 'Never Worked' }
];

export const SMOKING_STATUS = [
  { value: 'never smoked', label: 'Never Smoked' },
  { value: 'formerly smoked', label: 'Formerly Smoked' },
  { value: 'smokes', label: 'Currently Smokes' },
  { value: 'Unknown', label: 'Unknown' }
];

export const FEEDBACK_CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'prediction', label: 'Prediction' },
  { value: 'plans', label: 'Health Plans' },
  { value: 'doctors', label: 'Doctors' },
  { value: 'chatbot', label: 'Chatbot' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' }
];

export const MEDICAL_DISCLAIMER = 'Disclaimer: WellTrack provides health risk assessments for informational purposes only. This is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider.';
