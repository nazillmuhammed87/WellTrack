const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');

const mlClient = axios.create({
  baseURL: config.mlServiceUrl,
  timeout: 10000
});

const predict = async (healthData) => {
  const maxRetries = 2;
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise(r => setTimeout(r, 1000 * attempt));
        logger.info(`ML service retry attempt ${attempt}`);
      }

      const response = await mlClient.post('/predict', healthData);

      // Validate response shape
      const { prediction, probability, risk_level, confidence, top_features } = response.data;
      if (prediction === undefined || probability === undefined || !risk_level) {
        throw new Error('Invalid response format from ML service');
      }

      return response.data;
    } catch (error) {
      lastError = error;
      if (error.code !== 'ECONNREFUSED' && error.code !== 'ETIMEDOUT' && !error.response?.status?.toString().startsWith('5')) {
        throw error;
      }
    }
  }

  logger.error(`ML service unavailable after ${maxRetries + 1} attempts: ${lastError.message}`);
  const err = new Error('ML prediction service is currently unavailable. Please try again later.');
  err.statusCode = 503;
  throw err;
};

const checkHealth = async () => {
  try {
    const response = await mlClient.get('/health', { timeout: 5000 });
    return response.data;
  } catch {
    return { status: 'unhealthy' };
  }
};

module.exports = { predict, checkHealth };
