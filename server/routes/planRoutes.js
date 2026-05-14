const express = require('express');
const router = express.Router();
const { getDietPlan, getWorkoutPlan, getPlansByPrediction } = require('../controllers/planController');
const auth = require('../middleware/auth');
const { objectIdValidation } = require('../middleware/validator');

router.get('/diet/:predictionId', auth, ...objectIdValidation('predictionId'), getDietPlan);
router.get('/workout/:predictionId', auth, ...objectIdValidation('predictionId'), getWorkoutPlan);
router.get('/prediction/:predictionId', auth, ...objectIdValidation('predictionId'), getPlansByPrediction);

module.exports = router;
