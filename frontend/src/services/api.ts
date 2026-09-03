import axios, { AxiosError, isAxiosError } from 'axios';
import { showToast } from '../components/Toast';

// Allows the AuthContext to plug into the 401 path so the user state is cleared
// in the same tick — not on the next render after a full page reload.
type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;
export const setUnauthorizedHandler = (fn: UnauthorizedHandler | null) => {
  onUnauthorized = fn;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15_000, // 15s — never let a hung request block the UI
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize auth errors so the app does not lose state
// across a full reload. Other 4xx/5xx errors are returned for the caller to handle
// (toast or inline message); we only auto-toast 5xx since they are unexpected.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Notify the AuthContext (preferred) so the in-memory user state is cleared.
      if (onUnauthorized) {
        try {
          onUnauthorized();
        } catch {
          /* swallow — fallback to localStorage cleanup below */
        }
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/register')) {
        // Use assign so the page reloads (the only safe way to clear all module state).
        window.location.assign('/login');
      }
    } else if (error.response && error.response.status >= 500) {
      // Server errors are unexpected — surface them globally.
      const message =
        (error.response.data as { message?: string })?.message ||
        'The server is having trouble. Please try again in a moment.';
      showToast('error', message);
    }
    return Promise.reject(error);
  }
);

// A small, typed error shape callers can use. Pages/services can `throw err` and
// the shape is predictable.
export interface NormalizedApiError {
  message: string;
  status?: number;
  fieldErrors?: Array<{ field: string; message: string }>;
  raw?: unknown;
}

export const normalizeError = (err: unknown): NormalizedApiError => {
  if (isAxiosError(err)) {
    const data = (err.response?.data ?? {}) as {
      message?: string;
      errors?: Array<{ field?: string; message?: string }>;
    };
    return {
      message: data.message || err.message || 'Request failed',
      status: err.response?.status,
      fieldErrors: Array.isArray(data.errors)
        ? data.errors
            .filter((e) => e.field && e.message)
            .map((e) => ({ field: e.field as string, message: e.message as string }))
        : undefined,
      raw: err,
    };
  }
  if (err instanceof Error) {
    return { message: err.message, raw: err };
  }
  return { message: 'An unknown error occurred' };
};

export default api;
