const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

const registerValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required')
    .isLength({ max: 100 }).withMessage('Full name must be under 100 characters'),
  body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const predictionValidation = [
  body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('hypertension').isIn([0, 1]).withMessage('Hypertension must be 0 or 1'),
  body('heartDisease').isIn([0, 1]).withMessage('Heart disease must be 0 or 1'),
  body('everMarried').isIn(['Yes', 'No']).withMessage('Invalid marriage status'),
  body('workType').isIn(['Private', 'Self-employed', 'Govt_job', 'children', 'Never_worked'])
    .withMessage('Invalid work type'),
  body('residenceType').isIn(['Urban', 'Rural']).withMessage('Invalid residence type'),
  body('avgGlucoseLevel').isFloat({ min: 50, max: 300 }).withMessage('Glucose level must be between 50 and 300'),
  body('bmi').isFloat({ min: 10, max: 60 }).withMessage('BMI must be between 10 and 60'),
  body('smokingStatus').isIn(['formerly smoked', 'never smoked', 'smokes', 'Unknown'])
    .withMessage('Invalid smoking status'),
  validate
];

const feedbackValidation = [
  body('category').isIn(['general', 'prediction', 'plans', 'doctors', 'chatbot', 'bug', 'feature'])
    .withMessage('Invalid category'),
  body('subject').trim().notEmpty().withMessage('Subject is required')
    .isLength({ max: 100 }).withMessage('Subject must be under 100 characters'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description must be under 500 characters'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  validate
];

const objectIdValidation = (paramName) => [
  param(paramName).isMongoId().withMessage('Invalid ID'),
  validate
];

const doctorValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be under 100 characters'),
  body('specialization').isIn(['Cardiologist', 'Neurologist', 'General Physician', 'Endocrinologist'])
    .withMessage('Invalid specialization'),
  body('hospital').trim().notEmpty().withMessage('Hospital is required'),
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  predictionValidation,
  feedbackValidation,
  objectIdValidation,
  doctorValidation
};
