import api from './api';

export const analyticsService = {
  getUserAnalytics: async () => {
    const res = await api.get('/analytics/user');
    return res.data;
  },

  getAdminAnalytics: async () => {
    const res = await api.get('/analytics/admin');
    return res.data;
  },
};
