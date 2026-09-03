import api, { normalizeError } from './api';

export const learningService = {
  getLearningContent: async (courseId: string) => {
    try {
      const res = await api.get(`/learning/${courseId}`);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  getSection: async (sectionId: string) => {
    try {
      const res = await api.get(`/learning/section/${sectionId}`);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },
};
