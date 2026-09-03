import { useState, useEffect, useCallback, useRef } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

// A tiny event-bus so `showToast` works outside the React tree. The provider
// subscribes; if no provider is mounted, calls are silently dropped.
type Listener = (type: ToastType, message: string) => void;
const listeners = new Set<Listener>();

// eslint-disable-next-line react-refresh/only-export-components
export function showToast(type: ToastType, message: string) {
  listeners.forEach((l) => {
    try {
      l(type, message);
    } catch {
      /* don't let one bad listener break the rest */
    }
  });
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Track per-toast dismissal timers so we can clear them on unmount and avoid
  // setState-after-unmount if the container is torn down mid-toast.
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    const t = setTimeout(() => {
      timersRef.current.delete(id);
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
    timersRef.current.set(id, t);
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  useEffect(() => {
    listeners.add(addToast);
    return () => {
      listeners.delete(addToast);
    };
  }, [addToast]);

  const removeToast = (id: string) => {
    const t = timersRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const icons = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <Info size={18} />,
    warning: <AlertTriangle size={18} />,
  };

  const colors = {
    success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', icon: '#22c55e' } as const,
    error: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', icon: '#ef4444' } as const,
    info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', icon: '#3b82f6' } as const,
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', icon: '#f59e0b' } as const,
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {toasts.map((toast) => {
        const c = colors[toast.type];
        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px',
              backgroundColor: c.bg, border: `1px solid ${c.border}`, borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: '300px', maxWidth: '420px',
              animation: 'slideIn 0.3s ease',
            }}
          >
            <span style={{ color: c.icon, flexShrink: 0 }}>{icons[toast.type]}</span>
            <span style={{ flex: 1, fontSize: '0.875rem', color: c.text, fontWeight: 500 }}>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.text, opacity: 0.5, padding: 0 }} aria-label="Dismiss notification">
              <X size={16} />
            </button>
          </div>
        );
      })}
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}
