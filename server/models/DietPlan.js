const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  predictionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prediction',
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  guidelines: [String],
  foodsToEat: [String],
  foodsToAvoid: [String],
  sampleMealPlan: {
    breakfast: [String],
    lunch: [String],
    dinner: [String],
    snacks: [String]
  },
  specialNotes: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);
