import api from './api';

const predictionService = {
  createPrediction: (data) => api.post('/predictions', data),
  getPredictions: (page = 1, limit = 10) => api.get(`/predictions?page=${page}&limit=${limit}`),
  getPrediction: (id) => api.get(`/predictions/${id}`)
};

export default predictionService;
