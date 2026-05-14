const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  healthData: {
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    hypertension: { type: Number, required: true },
    heartDisease: { type: Number, required: true },
    everMarried: { type: String, required: true },
    workType: { type: String, required: true },
    residenceType: { type: String, required: true },
    avgGlucoseLevel: { type: Number, required: true },
    bmi: { type: Number, required: true },
    smokingStatus: { type: String, required: true }
  },
  prediction: {
    type: Number,
    required: true
  },
  probability: {
    type: Number,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  confidence: {
    type: Number
  },
  topFeatures: [{
    feature: String,
    value: String,
    impact: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

predictionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);
