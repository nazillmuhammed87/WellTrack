const express = require('express');
const router = express.Router();
const {
  getUsers, verifyUser, rejectUser, bulkVerifyUsers,
  getStats, getDoctors, createDoctor, updateDoctor, deleteDoctor,
  getFeedback, respondToFeedback, getAnalytics
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { objectIdValidation, doctorValidation } = require('../middleware/validator');

router.use(auth, adminAuth);

router.get('/users', getUsers);
router.put('/users/:id/verify', ...objectIdValidation('id'), verifyUser);
router.put('/users/:id/reject', ...objectIdValidation('id'), rejectUser);
router.put('/users/bulk-verify', bulkVerifyUsers);

router.get('/stats', getStats);
router.get('/analytics', getAnalytics);

router.get('/doctors', getDoctors);
router.post('/doctors', doctorValidation, createDoctor);
router.put('/doctors/:id', ...objectIdValidation('id'), updateDoctor);
router.delete('/doctors/:id', ...objectIdValidation('id'), deleteDoctor);

router.get('/feedback', getFeedback);
router.put('/feedback/:id/respond', ...objectIdValidation('id'), respondToFeedback);

module.exports = router;
