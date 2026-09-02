import { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, Terminal, ShieldOff } from 'lucide-react';

interface DevToolsDetectorProps {
  enabled?: boolean;
}

export default function DevToolsDetector({ enabled = true }: DevToolsDetectorProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [detectionMethod, setDetectionMethod] = useState('');

  const block = useCallback((method: string) => {
    if (!enabled) return;
    setDetectionMethod(method);
    setShowOverlay(true);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const blocked =
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I','i','J','j','C','c','S','s'].includes(e.key)) ||
        (e.ctrlKey && ['u','U','p','P','s','S','g','G'].includes(e.key)) ||
        (e.metaKey && e.altKey && ['I','i','J','j','U','u'].includes(e.key));

      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
        let method = 'Keyboard shortcut';
        if (e.key === 'F12') method = 'F12 key';
        else if (e.ctrlKey && e.shiftKey) method = `Ctrl+Shift+${e.key.toUpperCase()}`;
        else if (e.ctrlKey) method = `Ctrl+${e.key.toUpperCase()}`;
        block(method);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      block('Right-click blocked');
    };

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, [enabled, block]);

  useEffect(() => {
    if (!enabled || !showOverlay) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowOverlay(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [enabled, showOverlay]);

  if (!enabled || !showOverlay) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.97)', zIndex: 999999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        maxWidth: '500px', width: '90%', padding: '48px 36px', textAlign: 'center',
        background: 'linear-gradient(145deg, #1a1a2e 0%, #0f3460 100%)',
        borderRadius: '24px', border: '2px solid rgba(185,28,28,0.5)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #B91C1C, #F59E0B, #B91C1C)' }} />

        <div style={{
          width: '80px', height: '80px', margin: '0 auto 20px',
          background: 'linear-gradient(135deg, #B91C1C, #991B1B)',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AlertTriangle size={40} color="#fff" />
        </div>

        <h1 style={{ color: '#fff', fontSize: '1.7rem', fontWeight: 800, marginBottom: '10px' }}>
          Developer Tools Blocked
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
          Access to Developer Tools is restricted on this website for security reasons.
        </p>

        <div style={{
          background: 'rgba(185,28,28,0.12)', border: '1px solid rgba(185,28,28,0.3)',
          borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FCA5A5', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
            <Terminal size={18} /> Detected: <span style={{ color: '#F59E0B' }}>{detectionMethod}</span>
          </div>
          <ul style={{ color: '#CBD5E1', fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
            <li>Close DevTools (F12 or Ctrl+Shift+I)</li>
            <li>Refresh the page after closing</li>
            <li>Do not use keyboard shortcuts</li>
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748B', fontSize: '0.78rem' }}>
            <ShieldOff size={15} /> Security protection active
          </div>
          <button
            onClick={() => setShowOverlay(false)}
            style={{
              padding: '14px 36px', background: 'linear-gradient(135deg, #B91C1C, #991B1B)',
              color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.95rem',
              fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(185,28,28,0.4)',
            }}
          >
            Continue Browsing
          </button>
          <span style={{ color: '#475569', fontSize: '0.7rem' }}>or press ESC to dismiss</span>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '24px', color: '#374151', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        BSC Exclusive Security &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}