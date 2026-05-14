const Prediction = require('../models/Prediction');
const mlService = require('../services/mlService');
const aiAgentService = require('../services/aiAgentService');
const logger = require('../utils/logger');
const { round } = require('../utils/helpers');

exports.createPrediction = async (req, res, next) => {
  try {
    if (!req.user.isVerified) {
      return res.status(403).json({ message: 'Account must be verified to make predictions' });
    }

    const healthData = {
      age: Number(req.body.age),
      gender: req.body.gender,
      hypertension: Number(req.body.hypertension),
      heart_disease: Number(req.body.heartDisease),
      ever_married: req.body.everMarried,
      work_type: req.body.workType,
      Residence_type: req.body.residenceType,
      avg_glucose_level: round(Number(req.body.avgGlucoseLevel)),
      bmi: round(Number(req.body.bmi)),
      smoking_status: req.body.smokingStatus
    };

    // Validate no NaN values
    for (const [key, value] of Object.entries(healthData)) {
      if (typeof value === 'number' && isNaN(value)) {
        return res.status(400).json({ message: `Invalid value for ${key}` });
      }
    }

    const mlResult = await mlService.predict(healthData);

    const prediction = await Prediction.create({
      userId: req.user.id,
      healthData: {
        age: healthData.age,
        gender: healthData.gender,
        hypertension: healthData.hypertension,
        heartDisease: healthData.heart_disease,
        everMarried: healthData.ever_married,
        workType: healthData.work_type,
        residenceType: healthData.Residence_type,
        avgGlucoseLevel: healthData.avg_glucose_level,
        bmi: healthData.bmi,
        smokingStatus: healthData.smoking_status
      },
      prediction: mlResult.prediction,
      probability: mlResult.probability,
      riskLevel: mlResult.risk_level,
      confidence: mlResult.confidence,
      topFeatures: mlResult.top_features
    });

    // Auto-generate plans for Medium/High risk
    if (mlResult.risk_level !== 'Low') {
      try {
        await aiAgentService.generatePlans(req.user.id, prediction._id, mlResult.risk_level, prediction.healthData);
      } catch (planError) {
        logger.error(`Plan generation failed: ${planError.message}`);
      }
    } else {
      try {
        await aiAgentService.generateWellnessPlans(req.user.id, prediction._id, prediction.healthData);
      } catch (planError) {
        logger.error(`Wellness plan generation failed: ${planError.message}`);
      }
    }

    logger.info(`Prediction created for user ${req.user.id}: ${mlResult.risk_level} risk`);

    res.status(201).json({
      prediction: {
        id: prediction._id,
        prediction: prediction.prediction,
        probability: prediction.probability,
        riskLevel: prediction.riskLevel,
        confidence: prediction.confidence,
        topFeatures: prediction.topFeatures,
        healthData: prediction.healthData,
        createdAt: prediction.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPredictions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [predictions, total] = await Promise.all([
      Prediction.find({ userId: req.user.id, isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Prediction.countDocuments({ userId: req.user.id, isActive: true })
    ]);

    res.json({
      predictions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPrediction = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isActive: true
    });

    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }

    res.json(prediction);
  } catch (error) {
    next(error);
  }
};
