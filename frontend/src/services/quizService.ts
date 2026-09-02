import api from './api';

export const quizService = {
  getQuiz: async (quizId: string) => {
    const res = await api.get(`/quiz/${quizId}`);
    return res.data;
  },

  submitQuiz: async (quizId: string, data: { answers: number[]; timeTaken?: number }) => {
    const res = await api.post(`/quiz/${quizId}/submit`, data);
    return res.data;
  },
};
