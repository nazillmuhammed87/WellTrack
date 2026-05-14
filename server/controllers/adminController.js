const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Feedback = require('../models/Feedback');
const Prediction = require('../models/Prediction');
const logger = require('../utils/logger');

exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, isVerified, role } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
    if (role) filter.role = role;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(filter)
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isVerified: false },
      { isVerified: true, verifiedBy: req.user.id, verifiedAt: new Date(), rejectionReason: null },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ message: 'User not found or already verified' });
    }

    logger.info(`User ${user.email} verified by admin ${req.user.id}`);
    res.json({ message: 'User verified successfully', user });
  } catch (error) {
    next(error);
  }
};

exports.rejectUser = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'Cannot reject a verified user' });
    }

    user.rejectionReason = reason || 'Application rejected by admin';
    await user.save();

    logger.info(`User ${user.email} rejected by admin ${req.user.id}`);
    res.json({ message: 'User rejected', user });
  } catch (error) {
    next(error);
  }
};

exports.bulkVerifyUsers = async (req, res, next) => {
  try {
    const { userIds } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'Please provide user IDs' });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds }, isVerified: false },
      { isVerified: true, verifiedBy: req.user.id, verifiedAt: new Date() }
    );

    logger.info(`Bulk verified ${result.modifiedCount} users by admin ${req.user.id}`);
    res.json({ message: `${result.modifiedCount} users verified`, modifiedCount: result.modifiedCount });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, verifiedUsers, totalPredictions, totalDoctors, totalFeedback, riskDistribution] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', isVerified: true }),
      Prediction.countDocuments(),
      Doctor.countDocuments({ isActive: true }),
      Feedback.countDocuments(),
      Prediction.aggregate([
        { $group: { _id: '$riskLevel', count: { $sum: 1 } } }
      ])
    ]);

    const riskDist = { Low: 0, Medium: 0, High: 0 };
    riskDistribution.forEach(r => { riskDist[r._id] = r.count; });

    res.json({
      totalUsers,
      verifiedUsers,
      pendingUsers: totalUsers - verifiedUsers,
      totalPredictions,
      totalDoctors,
      totalFeedback,
      riskDistribution: riskDist
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [predictionTrends, userTrends, feedbackByCategory] = await Promise.all([
      Prediction.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            avgProbability: { $avg: '$probability' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, role: 'user' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Feedback.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } }
      ])
    ]);

    res.json({ predictionTrends, userTrends, feedbackByCategory });
  } catch (error) {
    next(error);
  }
};

exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

exports.createDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.create(req.body);
    logger.info(`Doctor created: ${doctor.name} by admin ${req.user.id}`);
    res.status(201).json(doctor);
  } catch (error) {
    next(error);
  }
};

exports.updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

exports.deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    logger.info(`Doctor soft-deleted: ${doctor.name} by admin ${req.user.id}`);
    res.json({ message: 'Doctor deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getFeedback = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [feedback, total] = await Promise.all([
      Feedback.find(filter).populate('userId', 'fullName email').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Feedback.countDocuments(filter)
    ]);

    res.json({
      feedback,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

exports.respondToFeedback = async (req, res, next) => {
  try {
    const { response, status } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        adminResponse: response,
        status: status || 'reviewed',
        respondedBy: req.user.id,
        respondedAt: new Date()
      },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({ message: 'Response submitted', feedback });
  } catch (error) {
    next(error);
  }
};
