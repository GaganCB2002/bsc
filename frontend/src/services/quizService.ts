import api, { normalizeError } from './api';

export const quizService = {
  getQuiz: async (quizId: string) => {
    try {
      const res = await api.get(`/quiz/${quizId}`);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  submitQuiz: async (quizId: string, data: { answers: Array<number | null>; timeTaken?: number }) => {
    try {
      const res = await api.post(`/quiz/${quizId}/submit`, data);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },
};
