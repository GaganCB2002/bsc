import api from './api';

export const progressService = {
  getProgress: async (courseId: string) => {
    const res = await api.get(`/progress/${courseId}`);
    return res.data;
  },

  getAllProgress: async () => {
    const res = await api.get('/progress');
    return res.data;
  },

  completeSection: async (sectionId: string) => {
    const res = await api.post(`/progress/section/${sectionId}/complete`);
    return res.data;
  },

  updateProgress: async (courseId: string, data: { currentSection?: string }) => {
    const res = await api.put(`/progress/${courseId}`, data);
    return res.data;
  },
};
