import api, { normalizeError } from './api';

export const userService = {
  getProfile: async () => {
    try {
      const res = await api.get('/users/profile');
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  updateProfile: async (data: { name?: string; phone?: string; bio?: string; avatar?: string }) => {
    try {
      const res = await api.put('/users/profile', data);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  getUsers: async (page = 1, limit = 20) => {
    try {
      const res = await api.get('/users', { params: { page, limit } });
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  deleteUser: async (id: string) => {
    try {
      const res = await api.delete(`/users/${id}`);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },
};
