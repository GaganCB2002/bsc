import { useEffect, useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { tryOnService, type TryOnConfig } from '../../services/tryOnService';
import { showToast } from '../../components/Toast';

export default function TryOnSettings() {
  const [config, setConfig] = useState<TryOnConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadConfig = async () => {
    try {
      const res = await tryOnService.adminGetConfig();
      if (res.success) setConfig(res.data);
    } catch {
      // Use defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Try-On Settings - BSC Exclusive Admin';
    loadConfig();
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      await tryOnService.adminUpdateConfig(config);
      showToast('success', 'Settings saved successfully');
    } catch {
      showToast('error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #F1F5F9', borderTopColor: '#B91C1C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem' };
  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600 as const, marginBottom: '6px', color: '#1E293B' };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={24} color="#B91C1C" /> Virtual Try-On Settings
          </h1>
          <p>Configure global virtual try-on behavior and limits.</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{
          backgroundColor: '#B91C1C', color: '#fff', padding: '10px 24px', border: 'none',
          borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex',
          alignItems: 'center', gap: '8px', opacity: saving ? 0.7 : 1,
        }}>
          {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Enable Virtual Try-On</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={config.enabled} onChange={e => setConfig(p => p ? { ...p, enabled: e.target.checked } : p)} style={{ width: '18px', height: '18px' }} />
              {config.enabled ? 'Enabled' : 'Disabled'}
            </label>
          </div>
          <div>
            <label style={labelStyle}>Max Requests Per User</label>
            <input type="number" value={config.maxRequestsPerUser} onChange={e => setConfig(p => p ? { ...p, maxRequestsPerUser: parseInt(e.target.value) || 0 } : p)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Max Image Upload Size (MB)</label>
            <input type="number" value={config.maxImageUploadSizeMB} onChange={e => setConfig(p => p ? { ...p, maxImageUploadSizeMB: parseInt(e.target.value) || 0 } : p)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Generation Timeout (ms)</label>
            <input type="number" value={config.generationTimeout || 60000} onChange={e => setConfig(p => p ? { ...p, generationTimeout: parseInt(e.target.value) || 60000 } : p)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Result Retention (days)</label>
            <input type="number" value={config.resultRetentionDays || 30} onChange={e => setConfig(p => p ? { ...p, resultRetentionDays: parseInt(e.target.value) || 30 } : p)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Allow Guest Users</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={config.allowGuestUsers} onChange={e => setConfig(p => p ? { ...p, allowGuestUsers: e.target.checked } : p)} style={{ width: '18px', height: '18px' }} />
              {config.allowGuestUsers ? 'Allowed' : 'Disabled'}
            </label>
          </div>
          <div>
            <label style={labelStyle}>Allow Image Download</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={config.allowImageDownload} onChange={e => setConfig(p => p ? { ...p, allowImageDownload: e.target.checked } : p)} style={{ width: '18px', height: '18px' }} />
              {config.allowImageDownload ? 'Enabled' : 'Disabled'}
            </label>
          </div>
          <div>
            <label style={labelStyle}>Allow Result Sharing</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={config.allowResultSharing} onChange={e => setConfig(p => p ? { ...p, allowResultSharing: e.target.checked } : p)} style={{ width: '18px', height: '18px' }} />
              {config.allowResultSharing ? 'Enabled' : 'Disabled'}
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
