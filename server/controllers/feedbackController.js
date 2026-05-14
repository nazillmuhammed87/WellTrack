const Feedback = require('../models/Feedback');

exports.createFeedback = async (req, res, next) => {
  try {
    const { category, subject, description, rating } = req.body;
    const screenshots = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const feedback = await Feedback.create({
      userId: req.user.id,
      category,
      subject,
      description,
      rating: parseInt(rating),
      screenshots
    });

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    next(error);
  }
};

exports.getMyFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};
