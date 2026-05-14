import api from './api';

const planService = {
  getDietPlan: (predictionId) => api.get(`/plans/diet/${predictionId}`),
  getWorkoutPlan: (predictionId) => api.get(`/plans/workout/${predictionId}`),
  getPlansByPrediction: (predictionId) => api.get(`/plans/prediction/${predictionId}`)
};

export default planService;
