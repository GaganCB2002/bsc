import api from './api';

export const authService = {
  register: async (data: { name: string; email: string; password: string; confirmPassword: string; phone?: string }) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};
