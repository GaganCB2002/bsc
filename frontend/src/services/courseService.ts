import api from './api';

export const courseService = {
  getCourses: async (params?: { category?: string; search?: string; page?: number }) => {
    const res = await api.get('/courses', { params });
    return res.data;
  },

  getCourse: async (id: string) => {
    const res = await api.get(`/courses/${id}`);
    return res.data;
  },

  createCourse: async (data: Record<string, unknown>) => {
    const res = await api.post('/courses', data);
    return res.data;
  },

  updateCourse: async (id: string, data: Record<string, unknown>) => {
    const res = await api.put(`/courses/${id}`, data);
    return res.data;
  },

  deleteCourse: async (id: string) => {
    const res = await api.delete(`/courses/${id}`);
    return res.data;
  },

  createModule: async (data: Record<string, unknown>) => {
    const res = await api.post('/courses/modules', data);
    return res.data;
  },

  createSection: async (data: Record<string, unknown>) => {
    const res = await api.post('/courses/sections', data);
    return res.data;
  },

  getAllCoursesAdmin: async () => {
    const res = await api.get('/courses/admin/all');
    return res.data;
  },
};
