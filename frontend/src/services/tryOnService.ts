import api from './api';

export interface TryOnModel {
  _id: string;
  name: string;
  imageUrl: string;
  gender: string;
  isDefault: boolean;
  isActive?: boolean;
  description?: string;
  sortOrder?: number;
}

export interface TryOnConfig {
  enabled: boolean;
  maxRequestsPerUser: number;
  maxImageUploadSizeMB: number;
  supportedImageFormats: string[];
  allowGuestUsers: boolean;
  allowImageDownload: boolean;
  allowResultSharing: boolean;
  defaultModelId: string | null;
  generationTimeout?: number;
  resultRetentionDays?: number;
  concurrentGenerationLimit?: number;
  provider?: string;
}

export interface TryOnGeneration {
  _id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  resultImage: string;
  errorMessage?: string;
  processingTime?: number;
  createdAt: string;
  completedAt?: string;
  modelId?: { _id: string; name: string; imageUrl: string };
  productId: string;
  productName: string;
  productImage: string;
  customImageUrl?: string;
  // Populated on admin endpoints, where each generation is joined with its
  // owning user. May be null for guest generations.
  userId?: { _id: string; name: string; email: string } | null;
}

export interface TryOnGeneratePayload {
  productId: string;
  productName: string;
  productImage: string;
  modelId?: string;
  customImageUrl?: string;
}

export const tryOnService = {
  getConfig: async () => {
    const res = await api.get('/try-on/config');
    return res.data;
  },

  getModels: async () => {
    const res = await api.get('/try-on/models');
    return res.data;
  },

  generate: async (payload: TryOnGeneratePayload) => {
    const res = await api.post('/try-on/generate', payload);
    return res.data;
  },

  getStatus: async (id: string) => {
    const res = await api.get(`/try-on/generation/${id}`);
    return res.data;
  },

  getHistory: async (page = 1, limit = 20) => {
    const res = await api.get(`/try-on/history?page=${page}&limit=${limit}`);
    return res.data;
  },

  // Admin endpoints
  adminGetStats: async () => {
    const res = await api.get('/try-on/admin/stats');
    return res.data;
  },

  adminGetConfig: async () => {
    const res = await api.get('/try-on/admin/config');
    return res.data;
  },

  adminUpdateConfig: async (config: Partial<TryOnConfig>) => {
    const res = await api.put('/try-on/admin/config', config);
    return res.data;
  },

  adminGetModels: async () => {
    const res = await api.get('/try-on/admin/models');
    return res.data;
  },

  adminCreateModel: async (model: { name: string; imageUrl: string; gender?: string; description?: string; isDefault?: boolean }) => {
    const res = await api.post('/try-on/admin/models', model);
    return res.data;
  },

  adminUpdateModel: async (id: string, model: Partial<TryOnModel>) => {
    const res = await api.put(`/try-on/admin/models/${id}`, model);
    return res.data;
  },

  adminDeleteModel: async (id: string) => {
    const res = await api.delete(`/try-on/admin/models/${id}`);
    return res.data;
  },

  adminGetGenerations: async (params?: { status?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.limit) query.set('limit', String(params.limit));
    const res = await api.get(`/try-on/admin/generations?${query.toString()}`);
    return res.data;
  },

  adminDeleteGeneration: async (id: string) => {
    const res = await api.delete(`/try-on/admin/generations/${id}`);
    return res.data;
  },
};

export default tryOnService;
