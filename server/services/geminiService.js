const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');
const logger = require('../utils/logger');

let genAI = null;

const getClient = () => {
  if (!config.geminiApiKey) return null;
  if (!genAI) {
    genAI = new GoogleGenerativeAI(config.geminiApiKey);
  }
  return genAI;
};

const buildPrompt = (riskLevel, healthData) => {
  return `You are a clinical nutritionist creating a personalized diet plan for a patient with the following health profile:

- Stroke Risk Level: ${riskLevel}
- Age: ${healthData.age}
- BMI: ${healthData.bmi}
- Average Glucose Level: ${healthData.avgGlucoseLevel}
- Hypertension: ${healthData.hypertension === 1 ? 'Yes' : 'No'}
- Heart Disease: ${healthData.heartDisease === 1 ? 'Yes' : 'No'}
- Smoking Status: ${healthData.smokingStatus || 'Unknown'}

Generate a personalized diet plan as a JSON object with exactly this structure (no markdown, no code fences, just raw JSON):
{
  "guidelines": ["array of 4-6 dietary guideline strings"],
  "foodsToEat": ["array of 8-12 recommended foods with brief reasons"],
  "foodsToAvoid": ["array of 5-8 foods to avoid with brief reasons"],
  "sampleMealPlan": {
    "breakfast": ["2-3 breakfast items"],
    "lunch": ["2-3 lunch items"],
    "dinner": ["2-3 dinner items"],
    "snacks": ["2-3 snack items"]
  },
  "specialNotes": ["array of 2-4 personalized notes based on the patient's specific health data"]
}

Tailor every recommendation to this patient's specific risk factors and health data. Be specific and actionable.`;
};

const parseResponse = (text) => {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  const parsed = JSON.parse(cleaned);

  // Validate required fields
  const required = ['guidelines', 'foodsToEat', 'foodsToAvoid', 'sampleMealPlan', 'specialNotes'];
  for (const field of required) {
    if (!parsed[field]) throw new Error(`Missing field: ${field}`);
  }
  const meals = ['breakfast', 'lunch', 'dinner', 'snacks'];
  for (const meal of meals) {
    if (!Array.isArray(parsed.sampleMealPlan[meal])) {
      throw new Error(`Missing meal: ${meal}`);
    }
  }
  return parsed;
};

exports.generateDietPlan = async (riskLevel, healthData) => {
  const client = getClient();
  if (!client) {
    logger.warn('Gemini API key not configured, skipping AI generation');
    return null;
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(buildPrompt(riskLevel, healthData));
    const text = result.response.text();
    const plan = parseResponse(text);
    logger.info('Diet plan generated via Gemini API');
    return plan;
  } catch (err) {
    logger.error(`Gemini diet plan generation failed: ${err.message}`);
    return null;
  }
};
