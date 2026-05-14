const express = require('express');
const router = express.Router();
const { createFeedback, getMyFeedback } = require('../controllers/feedbackController');
const auth = require('../middleware/auth');
const { feedbackValidation } = require('../middleware/validator');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});

router.post('/', auth, upload.array('screenshots', 3), feedbackValidation, createFeedback);
router.get('/my', auth, getMyFeedback);

module.exports = router;
