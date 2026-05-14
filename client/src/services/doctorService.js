import api from './api';

const doctorService = {
  getDoctors: (params = {}) => api.get('/doctors', { params }),
  getDoctor: (id) => api.get(`/doctors/${id}`),
  getRecommended: (riskLevel) => api.get('/doctors/recommended', { params: { riskLevel } })
};

export default doctorService;
