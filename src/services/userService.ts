import api from './api';

export const userService = {
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data;
  },

  updateProfile: async (data: { name?: string; phone?: string; bio?: string }) => {
    const res = await api.put('/users/profile', data);
    return res.data;
  },

  getUsers: async (page = 1, limit = 20) => {
    const res = await api.get('/users', { params: { page, limit } });
    return res.data;
  },

  deleteUser: async (id: string) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};
