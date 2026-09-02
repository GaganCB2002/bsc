import { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

let addToastFn: ((type: Toast['type'], message: string) => void) | null = null;

// eslint-disable-next-line react-refresh/only-export-components
export function showToast(type: Toast['type'], message: string) {
  if (addToastFn) addToastFn(type, message);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => { addToastFn = null; };
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <Info size={18} />,
    warning: <AlertTriangle size={18} />,
  };

  const colors = {
    success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', icon: '#22c55e' },
    error: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', icon: '#ef4444' },
    info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', icon: '#3b82f6' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', icon: '#f59e0b' },
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {toasts.map((toast) => {
        const c = colors[toast.type];
        return (
          <div
            key={toast.id}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px',
              backgroundColor: c.bg, border: `1px solid ${c.border}`, borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: '300px', maxWidth: '420px',
              animation: 'slideIn 0.3s ease',
            }}
          >
            <span style={{ color: c.icon, flexShrink: 0 }}>{icons[toast.type]}</span>
            <span style={{ flex: 1, fontSize: '0.875rem', color: c.text, fontWeight: 500 }}>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.text, opacity: 0.5, padding: 0 }}>
              <X size={16} />
            </button>
          </div>
        );
      })}
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}
