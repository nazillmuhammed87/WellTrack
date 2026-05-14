import api from './api';

const feedbackService = {
  createFeedback: (formData) => api.post('/feedback', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyFeedback: () => api.get('/feedback/my')
};

export default feedbackService;
