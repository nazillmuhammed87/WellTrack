const express = require('express');
const router = express.Router();
const { createPrediction, getPredictions, getPrediction } = require('../controllers/predictionController');
const auth = require('../middleware/auth');
const { predictionValidation, objectIdValidation } = require('../middleware/validator');

router.post('/', auth, predictionValidation, createPrediction);
router.get('/', auth, getPredictions);
router.get('/:id', auth, ...objectIdValidation('id'), getPrediction);

module.exports = router;
