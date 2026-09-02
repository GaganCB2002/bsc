import api from './api';

export const learningService = {
  getLearningContent: async (courseId: string) => {
    const res = await api.get(`/learning/${courseId}`);
    return res.data;
  },

  getSection: async (sectionId: string) => {
    const res = await api.get(`/learning/section/${sectionId}`);
    return res.data;
  },
};
