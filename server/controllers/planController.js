const DietPlan = require('../models/DietPlan');
const WorkoutPlan = require('../models/WorkoutPlan');
const Prediction = require('../models/Prediction');

exports.getDietPlan = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOne({
      _id: req.params.predictionId,
      userId: req.user.id,
      isActive: true
    });
    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }

    const dietPlan = await DietPlan.findOne({ predictionId: req.params.predictionId });
    if (!dietPlan) {
      return res.status(404).json({ message: 'Diet plan not found for this prediction' });
    }

    res.json(dietPlan);
  } catch (error) {
    next(error);
  }
};

exports.getWorkoutPlan = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOne({
      _id: req.params.predictionId,
      userId: req.user.id,
      isActive: true
    });
    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }

    const workoutPlan = await WorkoutPlan.findOne({ predictionId: req.params.predictionId });
    if (!workoutPlan) {
      return res.status(404).json({ message: 'Workout plan not found for this prediction' });
    }

    res.json(workoutPlan);
  } catch (error) {
    next(error);
  }
};

exports.getPlansByPrediction = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOne({
      _id: req.params.predictionId,
      userId: req.user.id,
      isActive: true
    });
    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }

    const [dietPlan, workoutPlan] = await Promise.all([
      DietPlan.findOne({ predictionId: req.params.predictionId }),
      WorkoutPlan.findOne({ predictionId: req.params.predictionId })
    ]);

    res.json({ dietPlan, workoutPlan });
  } catch (error) {
    next(error);
  }
};
