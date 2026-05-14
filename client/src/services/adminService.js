import api from './api';

const adminService = {
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  verifyUser: (id) => api.put(`/admin/users/${id}/verify`),
  rejectUser: (id, reason) => api.put(`/admin/users/${id}/reject`, { reason }),
  bulkVerifyUsers: (userIds) => api.put('/admin/users/bulk-verify', { userIds }),
  getStats: () => api.get('/admin/stats'),
  getAnalytics: () => api.get('/admin/analytics'),
  getDoctors: () => api.get('/admin/doctors'),
  createDoctor: (data) => api.post('/admin/doctors', data),
  updateDoctor: (id, data) => api.put(`/admin/doctors/${id}`, data),
  deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`),
  getFeedback: (params = {}) => api.get('/admin/feedback', { params }),
  respondToFeedback: (id, data) => api.put(`/admin/feedback/${id}/respond`, data)
};

export default adminService;
