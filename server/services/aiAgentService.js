const DietPlan = require('../models/DietPlan');
const WorkoutPlan = require('../models/WorkoutPlan');
const logger = require('../utils/logger');
const geminiService = require('./geminiService');

const dietTemplates = {
  High: {
    guidelines: [
      'Follow a strict heart-healthy DASH diet',
      'Limit sodium intake to less than 1500mg daily',
      'Consume at least 5 servings of fruits and vegetables daily',
      'Choose whole grains over refined grains',
      'Limit saturated fat to less than 6% of total calories'
    ],
    foodsToEat: [
      'Salmon, mackerel, and other fatty fish (omega-3)',
      'Leafy greens (spinach, kale, collard greens)',
      'Berries (blueberries, strawberries)',
      'Oatmeal and whole grain cereals',
      'Nuts and seeds (walnuts, flaxseeds)',
      'Legumes (beans, lentils)',
      'Olive oil',
      'Low-fat dairy products',
      'Avocados',
      'Sweet potatoes'
    ],
    foodsToAvoid: [
      'Processed meats (bacon, sausage, hot dogs)',
      'Fried foods and trans fats',
      'Excessive salt and high-sodium foods',
      'Sugary beverages and sodas',
      'White bread and refined carbohydrates',
      'Excessive alcohol',
      'Full-fat dairy products',
      'Red meat (limit to once per week)'
    ],
    sampleMealPlan: {
      breakfast: ['Oatmeal with berries and walnuts', 'Green tea or black coffee (unsweetened)'],
      lunch: ['Grilled salmon salad with olive oil dressing', 'Quinoa with steamed vegetables', 'Fresh fruit'],
      dinner: ['Baked chicken breast with herbs', 'Brown rice', 'Steamed broccoli and carrots'],
      snacks: ['Mixed nuts (unsalted)', 'Apple slices with almond butter', 'Greek yogurt (low-fat)']
    }
  },
  Medium: {
    guidelines: [
      'Follow a balanced Mediterranean-style diet',
      'Limit sodium intake to less than 2300mg daily',
      'Include plenty of fruits, vegetables, and whole grains',
      'Choose lean proteins',
      'Moderate portion sizes'
    ],
    foodsToEat: [
      'Fish and seafood (2-3 times per week)',
      'Fresh fruits and vegetables',
      'Whole grains (brown rice, whole wheat)',
      'Lean poultry',
      'Legumes and beans',
      'Olive oil and healthy fats',
      'Nuts in moderation',
      'Low-fat dairy'
    ],
    foodsToAvoid: [
      'Excessive processed foods',
      'High-sodium snacks',
      'Sugary drinks and desserts (limit)',
      'Fried foods (limit to occasional)',
      'Excessive red meat'
    ],
    sampleMealPlan: {
      breakfast: ['Whole grain toast with avocado', 'Scrambled eggs', 'Fresh orange juice'],
      lunch: ['Turkey and vegetable wrap', 'Mixed green salad', 'Fruit cup'],
      dinner: ['Grilled fish with lemon', 'Roasted vegetables', 'Brown rice pilaf'],
      snacks: ['Trail mix', 'Hummus with carrot sticks', 'Fresh fruit']
    }
  },
  Low: {
    guidelines: [
      'Maintain a balanced and varied diet',
      'Continue healthy eating habits',
      'Stay hydrated with adequate water intake',
      'Include all food groups in moderation',
      'Practice mindful eating'
    ],
    foodsToEat: [
      'A variety of fruits and vegetables',
      'Whole grains',
      'Lean proteins (fish, chicken, tofu)',
      'Healthy fats (olive oil, nuts, avocado)',
      'Dairy or dairy alternatives',
      'Legumes and beans'
    ],
    foodsToAvoid: [
      'Excessive junk food',
      'Too much added sugar',
      'Excessive alcohol',
      'Highly processed foods'
    ],
    sampleMealPlan: {
      breakfast: ['Yogurt parfait with granola and berries', 'Coffee or tea'],
      lunch: ['Chicken Caesar salad', 'Whole grain bread', 'Water with lemon'],
      dinner: ['Pasta with marinara sauce and vegetables', 'Side salad', 'Grilled chicken'],
      snacks: ['Fresh fruit', 'Cheese and crackers', 'Smoothie']
    }
  }
};

const workoutTemplates = {
  High: {
    guidelines: [
      'Consult your doctor before starting any exercise program',
      'Start slowly and gradually increase intensity',
      'Monitor heart rate during exercise (stay below 70% max HR)',
      'Stop immediately if you feel dizzy, chest pain, or shortness of breath',
      'Always warm up for 5-10 minutes and cool down after',
      'Exercise with a partner or in supervised settings'
    ],
    exercises: [
      { name: 'Walking', duration: '20-30 minutes', frequency: '5 days/week', intensity: 'Low', description: 'Brisk walking on flat terrain' },
      { name: 'Swimming', duration: '20 minutes', frequency: '3 days/week', intensity: 'Low-Moderate', description: 'Gentle laps or water aerobics' },
      { name: 'Chair Yoga', duration: '15-20 minutes', frequency: '3 days/week', intensity: 'Low', description: 'Seated stretching and breathing exercises' },
      { name: 'Light Stretching', duration: '10-15 minutes', frequency: 'Daily', intensity: 'Low', description: 'Gentle full-body stretches' }
    ],
    weeklySchedule: {
      monday: 'Walking (30 min) + Stretching (10 min)',
      tuesday: 'Swimming (20 min)',
      wednesday: 'Walking (25 min) + Chair Yoga (15 min)',
      thursday: 'Rest - Light Stretching only',
      friday: 'Swimming (20 min)',
      saturday: 'Walking (30 min)',
      sunday: 'Rest - Gentle Stretching'
    },
    safetyNotes: [
      'Keep emergency contacts accessible during exercise',
      'Stay hydrated before, during, and after exercise',
      'Avoid exercising in extreme heat or cold',
      'Wear comfortable, supportive shoes',
      'If on blood pressure medication, avoid sudden position changes'
    ]
  },
  Medium: {
    guidelines: [
      'Aim for 150 minutes of moderate exercise per week',
      'Include both cardio and light strength training',
      'Monitor how you feel during exercise',
      'Warm up and cool down properly',
      'Stay consistent with your routine'
    ],
    exercises: [
      { name: 'Brisk Walking/Light Jogging', duration: '30-40 minutes', frequency: '4-5 days/week', intensity: 'Moderate', description: 'Maintain a pace where you can talk but not sing' },
      { name: 'Cycling', duration: '30 minutes', frequency: '3 days/week', intensity: 'Moderate', description: 'Stationary or outdoor cycling at comfortable pace' },
      { name: 'Yoga', duration: '30 minutes', frequency: '2-3 days/week', intensity: 'Low-Moderate', description: 'Hatha or gentle vinyasa yoga' },
      { name: 'Light Strength Training', duration: '20-25 minutes', frequency: '2 days/week', intensity: 'Moderate', description: 'Bodyweight exercises or light weights' },
      { name: 'Swimming', duration: '30 minutes', frequency: '2 days/week', intensity: 'Moderate', description: 'Moderate-paced swimming' }
    ],
    weeklySchedule: {
      monday: 'Brisk Walking (35 min) + Stretching',
      tuesday: 'Cycling (30 min)',
      wednesday: 'Yoga (30 min)',
      thursday: 'Light Strength Training (25 min)',
      friday: 'Brisk Walking (35 min)',
      saturday: 'Swimming (30 min) or Cycling (30 min)',
      sunday: 'Rest or Light Yoga'
    },
    safetyNotes: [
      'Stay hydrated throughout your workouts',
      'Listen to your body and rest when needed',
      'Gradually increase intensity over weeks',
      'Wear appropriate workout gear'
    ]
  },
  Low: {
    guidelines: [
      'Maintain an active lifestyle with regular exercise',
      'Aim for at least 150-300 minutes of moderate exercise per week',
      'Include strength training 2-3 times per week',
      'Mix cardio with flexibility and strength work',
      'Set progressive fitness goals'
    ],
    exercises: [
      { name: 'Running/Jogging', duration: '30-45 minutes', frequency: '3-4 days/week', intensity: 'Moderate-High', description: 'Steady-state or interval running' },
      { name: 'Strength Training', duration: '30-40 minutes', frequency: '3 days/week', intensity: 'Moderate-High', description: 'Full body workout with weights or bodyweight' },
      { name: 'Cycling/Spinning', duration: '30-45 minutes', frequency: '2-3 days/week', intensity: 'Moderate-High', description: 'Road cycling or spin class' },
      { name: 'Yoga/Pilates', duration: '30 minutes', frequency: '2 days/week', intensity: 'Moderate', description: 'For flexibility and core strength' },
      { name: 'Sports/Recreation', duration: '60 minutes', frequency: '1-2 days/week', intensity: 'Varies', description: 'Tennis, basketball, hiking, etc.' }
    ],
    weeklySchedule: {
      monday: 'Running (35 min) + Core Work (10 min)',
      tuesday: 'Strength Training (35 min)',
      wednesday: 'Cycling (40 min)',
      thursday: 'Yoga (30 min) + Light Jog (20 min)',
      friday: 'Strength Training (35 min)',
      saturday: 'Sports/Recreation (60 min)',
      sunday: 'Rest or Light Activity'
    },
    safetyNotes: [
      'Warm up before intense exercise',
      'Stay hydrated',
      'Get adequate sleep for recovery',
      'Consider periodic health check-ups'
    ]
  }
};

const addModifiers = (dietPlan, healthData) => {
  const notes = [];

  if (healthData.bmi > 30) {
    dietPlan.foodsToEat.push('High-fiber foods for satiety', 'Green tea for metabolism');
    notes.push('Focus on portion control and calorie-conscious choices due to elevated BMI');
  }

  if (healthData.avgGlucoseLevel > 200) {
    dietPlan.foodsToAvoid.push('High glycemic index foods', 'White rice and white bread', 'Fruit juices');
    dietPlan.foodsToEat.push('Cinnamon (may help blood sugar)', 'Bitter melon', 'Chromium-rich foods');
    notes.push('Prioritize low glycemic index foods due to elevated glucose levels');
  } else if (healthData.avgGlucoseLevel >= 126) {
    notes.push('Monitor carbohydrate intake - glucose levels indicate pre-diabetic/diabetic range');
  }

  if (healthData.age > 65) {
    dietPlan.foodsToEat.push('Calcium-rich foods (fortified milk, leafy greens)', 'Soft-textured proteins');
    notes.push('Include calcium and vitamin D for bone health');
    notes.push('Choose softer textures if chewing is difficult');
  }

  if (healthData.hypertension === 1) {
    notes.push('Strictly limit sodium - read all food labels');
  }

  return notes;
};

const addWorkoutModifiers = (workoutPlan, healthData) => {
  const notes = [...workoutPlan.safetyNotes];

  if (healthData.age > 65) {
    notes.push('Include balance exercises to prevent falls');
    notes.push('Prefer low-impact activities');
    workoutPlan.exercises = workoutPlan.exercises.map(ex => ({
      ...ex,
      intensity: ex.intensity === 'Moderate-High' ? 'Moderate' : ex.intensity,
      duration: ex.duration.replace(/(\d+)-(\d+)/, (_, min) => `${min}-${parseInt(min) + 10}`)
    }));
  }

  if (healthData.bmi > 35) {
    notes.push('Start with seated or water-based exercises to reduce joint stress');
    notes.push('Gradually progress to weight-bearing activities');
  }

  return notes;
};

exports.generatePlans = async (userId, predictionId, riskLevel, healthData) => {
  // Try Gemini first, fall back to templates
  let dietData = await geminiService.generateDietPlan(riskLevel, healthData);

  if (!dietData) {
    logger.info('Using template-based diet plan (Gemini unavailable)');
    const dietTemplate = { ...dietTemplates[riskLevel] };
    dietTemplate.foodsToEat = [...dietTemplate.foodsToEat];
    dietTemplate.foodsToAvoid = [...dietTemplate.foodsToAvoid];
    const dietNotes = addModifiers(dietTemplate, healthData);
    dietData = {
      guidelines: dietTemplate.guidelines,
      foodsToEat: dietTemplate.foodsToEat,
      foodsToAvoid: dietTemplate.foodsToAvoid,
      sampleMealPlan: dietTemplate.sampleMealPlan,
      specialNotes: dietNotes
    };
  }

  const dietPlan = await DietPlan.create({
    userId,
    predictionId,
    riskLevel,
    guidelines: dietData.guidelines,
    foodsToEat: dietData.foodsToEat,
    foodsToAvoid: dietData.foodsToAvoid,
    sampleMealPlan: dietData.sampleMealPlan,
    specialNotes: dietData.specialNotes
  });

  const workoutTemplate = JSON.parse(JSON.stringify(workoutTemplates[riskLevel]));
  const workoutNotes = addWorkoutModifiers(workoutTemplate, healthData);

  const workoutPlan = await WorkoutPlan.create({
    userId,
    predictionId,
    riskLevel,
    guidelines: workoutTemplate.guidelines,
    exercises: workoutTemplate.exercises,
    weeklySchedule: workoutTemplate.weeklySchedule,
    safetyNotes: workoutNotes
  });

  logger.info(`Plans generated for user ${userId}, prediction ${predictionId}`);
  return { dietPlan, workoutPlan };
};

exports.generateWellnessPlans = async (userId, predictionId, healthData) => {
  return exports.generatePlans(userId, predictionId, 'Low', healthData);
};
