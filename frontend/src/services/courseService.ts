import api, { normalizeError } from './api';

export const courseService = {
  getCourses: async (params?: { category?: string; search?: string; page?: number }) => {
    try {
      const res = await api.get('/courses', { params });
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  getCourse: async (id: string) => {
    try {
      const res = await api.get(`/courses/${id}`);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  createCourse: async (data: Record<string, unknown>) => {
    try {
      const res = await api.post('/courses', data);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  updateCourse: async (id: string, data: Record<string, unknown>) => {
    try {
      const res = await api.put(`/courses/${id}`, data);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  deleteCourse: async (id: string) => {
    try {
      const res = await api.delete(`/courses/${id}`);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  createModule: async (data: Record<string, unknown>) => {
    try {
      const res = await api.post('/courses/modules', data);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  createSection: async (data: Record<string, unknown>) => {
    try {
      const res = await api.post('/courses/sections', data);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  getAllCoursesAdmin: async () => {
    try {
      const res = await api.get('/courses/admin/all');
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },
};
