import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { isAxiosError } from 'axios';
import { authService } from '../services/authService';
import { setUnauthorizedHandler } from '../services/api';
import { normalizeError } from '../services/api';
import { showToast } from '../components/Toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  age?: number;
  gender?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; role?: string; isLocked?: boolean; lockedUntil?: string }>;
  register: (data: { name: string; email: string; password: string; confirmPassword: string; phone?: string; age?: number; gender?: string; location?: string }) => Promise<{ success: boolean; message: string; role?: string; fieldErrors?: Array<{ field: string; message: string }> }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

function getLocalProfile(): Partial<User> {
  try {
    const stored = localStorage.getItem('userProfile');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveLocalProfile(profile: Partial<User>) {
  try {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  } catch {
    /* quota / private mode — silently ignore */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Lazy initializer + null check for missing keys.
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const lastFetchedToken = useRef<string | null>(null);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('loginTimestamp');
      localStorage.removeItem('role');
    } catch {
      /* ignore */
    }
    setToken(null);
    setUser(null);
  }, []);

  const check24HourExpiry = useCallback(() => {
    try {
      const loginTime = localStorage.getItem('loginTimestamp');
      if (loginTime) {
        const elapsed = Date.now() - parseInt(loginTime, 10);
        if (Number.isFinite(elapsed) && elapsed >= TWENTY_FOUR_HOURS_MS) {
          logout();
          showToast('warning', 'Session expired (24h limit). Please sign in again.');
          return true;
        }
      }
    } catch {
      /* ignore */
    }
    return false;
  }, [logout]);

  // Server is the source of truth. Local profile is a write-through cache of
  // fields the server doesn't know about (age/gender/location), but never
  // overrides fields the server already provided.
  const mergeProfile = useCallback((apiUser: User): User => {
    const local = getLocalProfile();
    return {
      ...local,
      ...apiUser,
    };
  }, []);

  const fetchUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    if (check24HourExpiry()) {
      setLoading(false);
      return;
    }
    try {
      const data = await authService.getMe();
      if (data.success) {
        setUser(mergeProfile(data.user));
      } else {
        logout();
      }
    } catch {
      // 401 is already handled by the api.ts interceptor. Any other error here
      // is transient — keep the cached user so the app still works.
    } finally {
      setLoading(false);
    }
  }, [token, check24HourExpiry, logout, mergeProfile]);

  // React to token changes (login, logout, user-switch) instead of a one-shot ref guard.
  useEffect(() => {
    if (lastFetchedToken.current === token) return;
    lastFetchedToken.current = token;
    setLoading(true);
    fetchUser();
  }, [token, fetchUser]);

  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      check24HourExpiry();
    }, 60000);
    return () => clearInterval(interval);
  }, [token, check24HourExpiry]);

  // Register the unauthorized handler so the 401 path also clears React state.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
    });
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login({ email, password });
      if (data.success) {
        try {
          localStorage.setItem('token', data.token);
          localStorage.setItem('loginTimestamp', Date.now().toString());
        } catch {
          /* ignore */
        }
        setToken(data.token);
        setUser(mergeProfile(data.user));
        return { success: true, message: data.message, role: data.user.role };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 429) {
        const body = (err.response.data ?? {}) as { message?: string; lockedUntil?: string };
        return {
          success: false,
          message: body.message || 'Too many login attempts.',
          isLocked: true,
          lockedUntil: body.lockedUntil || new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        };
      }
      const { message } = normalizeError(err);
      return { success: false, message: message || 'Unable to connect to server' };
    }
  };

  const register = async (formData: { name: string; email: string; password: string; confirmPassword: string; phone?: string; age?: number; gender?: string; location?: string }) => {
    try {
      const profileData: Partial<User> = {};
      if (formData.age) profileData.age = formData.age;
      if (formData.gender) profileData.gender = formData.gender;
      if (formData.location) profileData.location = formData.location;
      if (formData.phone) profileData.phone = formData.phone;
      saveLocalProfile(profileData);

      const data = await authService.register(formData);
      if (data.success) {
        try {
          localStorage.setItem('token', data.token);
          localStorage.setItem('loginTimestamp', Date.now().toString());
        } catch {
          /* ignore */
        }
        setToken(data.token);
        setUser(mergeProfile(data.user));
        return { success: true, message: data.message, role: data.user.role };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err) {
      const { message, fieldErrors } = normalizeError(err);
      return {
        success: false,
        message: message || 'Unable to connect to server',
        fieldErrors,
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
