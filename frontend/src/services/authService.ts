import api from './api';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  age?: number;
  gender?: string;
  location?: string;
}

export const authService = {
  register: async (data: RegisterPayload) => {
    // Backend only persists name/email/password/phone — extra fields are kept client-side.
    const { name, email, password, phone } = data;
    const res = await api.post('/auth/register', { name, email, password, phone });
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
