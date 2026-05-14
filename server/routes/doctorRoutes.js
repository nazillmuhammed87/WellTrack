const express = require('express');
const router = express.Router();
const { getDoctors, getDoctor, getRecommendedDoctors } = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const { objectIdValidation } = require('../middleware/validator');

router.get('/', auth, getDoctors);
router.get('/recommended', auth, getRecommendedDoctors);
router.get('/:id', auth, ...objectIdValidation('id'), getDoctor);

module.exports = router;
