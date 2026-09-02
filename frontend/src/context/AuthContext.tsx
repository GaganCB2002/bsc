import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { authService } from '../services/authService';
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
  register: (data: { name: string; email: string; password: string; confirmPassword: string; phone?: string; age?: number; gender?: string; location?: string }) => Promise<{ success: boolean; message: string; role?: string }>;
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
  localStorage.setItem('userProfile', JSON.stringify(profile));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('loginTimestamp');
    localStorage.removeItem('role');
    setToken(null);
    setUser(null);
  }, []);

  const check24HourExpiry = useCallback(() => {
    const loginTime = localStorage.getItem('loginTimestamp');
    if (loginTime) {
      const elapsed = Date.now() - parseInt(loginTime, 10);
      if (elapsed >= TWENTY_FOUR_HOURS_MS) {
        logout();
        showToast('warning', 'Session expired (24h limit). Please sign in again.');
        return true;
      }
    }
    return false;
  }, [logout]);

  const mergeProfile = useCallback((apiUser: User): User => {
    const local = getLocalProfile();
    return { ...apiUser, ...local };
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
        const merged = mergeProfile(data.user);
        setUser(merged);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, check24HourExpiry, logout, mergeProfile]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      check24HourExpiry();
    }, 60000);
    return () => clearInterval(interval);
  }, [token, check24HourExpiry]);

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login({ email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('loginTimestamp', Date.now().toString());
        setToken(data.token);
        const merged = mergeProfile(data.user);
        setUser(merged);
        return { success: true, message: data.message, role: data.user.role };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err: unknown) {
      const error = err as { response?: { status?: number, data?: { message?: string; lockedUntil?: string } } };
      
      if (error.response?.status === 429) {
        return {
          success: false,
          message: error.response.data?.message || 'Too many login attempts.',
          isLocked: true,
          lockedUntil: error.response.data?.lockedUntil || new Date(Date.now() + 15 * 60 * 1000).toISOString()
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || 'Unable to connect to server',
      };
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
        localStorage.setItem('token', data.token);
        localStorage.setItem('loginTimestamp', Date.now().toString());
        setToken(data.token);
        const merged = mergeProfile(data.user);
        merged.age = formData.age;
        merged.gender = formData.gender;
        merged.location = formData.location;
        setUser(merged);
        return { success: true, message: data.message, role: data.user.role };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: Array<{ message: string }> } } };
      const msg = error.response?.data?.errors?.[0]?.message || error.response?.data?.message || 'Unable to connect to server';
      return { success: false, message: msg };
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
