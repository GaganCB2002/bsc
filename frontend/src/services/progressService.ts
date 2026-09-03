import api, { normalizeError } from './api';

export const progressService = {
  getProgress: async (courseId: string) => {
    try {
      const res = await api.get(`/progress/${courseId}`);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  getAllProgress: async () => {
    try {
      const res = await api.get('/progress');
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  completeSection: async (sectionId: string) => {
    try {
      const res = await api.post(`/progress/section/${sectionId}/complete`);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  updateProgress: async (courseId: string, data: { currentSection?: string }) => {
    try {
      const res = await api.put(`/progress/${courseId}`, data);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },
};
