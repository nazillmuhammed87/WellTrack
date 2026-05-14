export const validateEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateAge = (age) => {
  const num = Number(age);
  return !isNaN(num) && num >= 18 && num <= 100;
};

export const validateBMI = (bmi) => {
  const num = Number(bmi);
  return !isNaN(num) && num >= 10 && num <= 60;
};

export const validateGlucose = (glucose) => {
  const num = Number(glucose);
  return !isNaN(num) && num >= 50 && num <= 300;
};

export const calculateBMI = (weight, height) => {
  if (!weight || !height || height <= 0) return 0;
  const heightM = height / 100;
  return Math.round((weight / (heightM * heightM)) * 100) / 100;
};

export const getFieldError = (field, value) => {
  switch (field) {
    case 'email':
      return !validateEmail(value) ? 'Please enter a valid email' : '';
    case 'password':
      return !validatePassword(value) ? 'Password must be at least 6 characters' : '';
    case 'fullName':
      return !value || value.trim().length === 0 ? 'Full name is required' :
             value.length > 100 ? 'Full name must be under 100 characters' : '';
    case 'age':
      return !validateAge(value) ? 'Age must be between 18 and 100' : '';
    case 'bmi':
      return !validateBMI(value) ? 'BMI must be between 10 and 60' : '';
    case 'avgGlucoseLevel':
      return !validateGlucose(value) ? 'Glucose level must be between 50 and 300' : '';
    default:
      return '';
  }
};
