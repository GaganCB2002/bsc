import api, { normalizeError } from './api';

export const analyticsService = {
  getUserAnalytics: async () => {
    try {
      const res = await api.get('/analytics/user');
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  getAdminAnalytics: async () => {
    try {
      const res = await api.get('/analytics/admin');
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },
};
