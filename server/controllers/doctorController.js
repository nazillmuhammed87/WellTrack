const Doctor = require('../models/Doctor');
const Prediction = require('../models/Prediction');

const specializations = {
  High: ['Cardiologist', 'Neurologist'],
  Medium: ['General Physician', 'Endocrinologist'],
  Low: ['General Physician']
};

exports.getDoctors = async (req, res, next) => {
  try {
    const { specialization, search, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };

    if (specialization) filter.specialization = specialization;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [doctors, total] = await Promise.all([
      Doctor.find(filter).sort({ rating: -1 }).skip(skip).limit(parseInt(limit)),
      Doctor.countDocuments(filter)
    ]);

    res.json({
      doctors,
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

exports.getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.params.id, isActive: true });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

exports.getRecommendedDoctors = async (req, res, next) => {
  try {
    const { riskLevel } = req.query;
    let specs;

    if (riskLevel && specializations[riskLevel]) {
      specs = specializations[riskLevel];
    } else {
      // Get latest prediction for the user
      const latestPrediction = await Prediction.findOne({ userId: req.user.id, isActive: true })
        .sort({ createdAt: -1 });
      specs = latestPrediction ? specializations[latestPrediction.riskLevel] : specializations.Low;
    }

    const doctors = await Doctor.find({
      isActive: true,
      specialization: { $in: specs }
    }).sort({ rating: -1 });

    res.json({ doctors, recommendedSpecializations: specs });
  } catch (error) {
    next(error);
  }
};
