import React, { useState, useEffect } from 'react';
import { Sparkles, Settings, Activity, Users, Image as ImageIcon, CheckCircle2, Clock, Trash2, Edit2, Plus } from 'lucide-react';
import tryOnService from '../../services/tryOnService';
import type { TryOnConfig, TryOnModel, TryOnGeneration } from '../../services/tryOnService';

interface TryOnStats {
  totalGenerations: number;
  successRate: number;
  activeModelsCount: number;
  avgProcessingTime: number;
}

export default function AdminTryOn() {
  const [activeTab, setActiveTab] = useState<'models' | 'logs' | 'settings'>('models');
  const [stats, setStats] = useState<TryOnStats | null>(null);
  const [config, setConfig] = useState<TryOnConfig | null>(null);
  const [models, setModels] = useState<TryOnModel[]>([]);
  const [generations, setGenerations] = useState<TryOnGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, configRes, modelsRes, genRes] = await Promise.all([
        tryOnService.adminGetStats(),
        tryOnService.adminGetConfig(),
        tryOnService.adminGetModels(),
        tryOnService.adminGetGenerations()
      ]);
      setStats(statsRes.data as TryOnStats);
      setConfig(configRes.data);
      setModels(modelsRes.data);
      setGenerations(genRes.data);
    } catch {
      console.error('Failed to load Try-On admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!config) return;
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                type === 'number' ? Number(value) : value;
    setConfig({ ...config, [name]: val });
  };

  const saveConfig = async () => {
    if (!config) return;
    setSaveLoading(true);
    try {
      await tryOnService.adminUpdateConfig(config);
      alert('Settings saved successfully');
    } catch {
      alert('Failed to save settings');
    } finally {
      setSaveLoading(false);
    }
  };

  const toggleEngineStatus = async () => {
    if (!config) return;
    const newStatus = !config.enabled;
    setConfig({ ...config, enabled: newStatus });
    try {
      await tryOnService.adminUpdateConfig({ enabled: newStatus });
    } catch {
      setConfig({ ...config, enabled: !newStatus });
      alert('Failed to toggle engine status');
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading Virtual Try-On dashboard...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#1E293B', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={28} color="#B91C1C" /> Virtual Try-On Engine
          </h1>
          <p style={{ color: '#64748B', margin: 0 }}>Manage AI models, view generation logs, and configure engine settings.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#fff', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Engine Status</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: config?.enabled ? '#16A34A' : '#DC2626' }}>{config?.enabled ? 'LIVE / ACTIVE' : 'DISABLED'}</span>
          </div>
          <div 
            onClick={toggleEngineStatus}
            style={{ 
              width: '48px', height: '24px', background: config?.enabled ? '#16A34A' : '#CBD5E1', 
              borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' 
            }}
          >
            <div style={{ 
              width: '20px', height: '20px', background: '#fff', borderRadius: '50%', 
              position: 'absolute', top: '2px', left: config?.enabled ? '26px' : '2px', 
              transition: 'all 0.3s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' 
            }} />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ background: '#F1F5F9', padding: '10px', borderRadius: '8px', color: '#3B82F6' }}><Activity size={20} /></div>
            <span style={{ color: '#64748B', fontWeight: 500, fontSize: '0.9rem' }}>Total Generations</span>
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1E293B' }}>{stats?.totalGenerations || 0}</span>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ background: '#F1F5F9', padding: '10px', borderRadius: '8px', color: '#16A34A' }}><CheckCircle2 size={20} /></div>
            <span style={{ color: '#64748B', fontWeight: 500, fontSize: '0.9rem' }}>Success Rate</span>
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1E293B' }}>{stats?.successRate || 0}%</span>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ background: '#F1F5F9', padding: '10px', borderRadius: '8px', color: '#8B5CF6' }}><Users size={20} /></div>
            <span style={{ color: '#64748B', fontWeight: 500, fontSize: '0.9rem' }}>Active Models</span>
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1E293B' }}>{stats?.activeModelsCount || 0}</span>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ background: '#F1F5F9', padding: '10px', borderRadius: '8px', color: '#F59E0B' }}><Clock size={20} /></div>
            <span style={{ color: '#64748B', fontWeight: 500, fontSize: '0.9rem' }}>Avg Render Time</span>
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1E293B' }}>{((stats?.avgProcessingTime ?? 0) / 1000).toFixed(1)}s</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: '24px' }}>
        <button onClick={() => setActiveTab('models')} style={{ background: 'none', border: 'none', padding: '12px 24px', fontSize: '0.95rem', fontWeight: 600, color: activeTab === 'models' ? '#B91C1C' : '#64748B', borderBottom: activeTab === 'models' ? '2px solid #B91C1C' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ImageIcon size={18} /> Preset Models
        </button>
        <button onClick={() => setActiveTab('logs')} style={{ background: 'none', border: 'none', padding: '12px 24px', fontSize: '0.95rem', fontWeight: 600, color: activeTab === 'logs' ? '#B91C1C' : '#64748B', borderBottom: activeTab === 'logs' ? '2px solid #B91C1C' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} /> Generation Logs
        </button>
        <button onClick={() => setActiveTab('settings')} style={{ background: 'none', border: 'none', padding: '12px 24px', fontSize: '0.95rem', fontWeight: 600, color: activeTab === 'settings' ? '#B91C1C' : '#64748B', borderBottom: activeTab === 'settings' ? '2px solid #B91C1C' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={18} /> Engine Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'models' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1E293B', margin: 0 }}>Preset Avatar Models</h3>
            <button style={{ background: '#B91C1C', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> Add New Model
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {models.map(model => (
              <div key={model._id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4' }}>
                  <img src={model.imageUrl} alt={model.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {model.isDefault && (
                     <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#B91C1C', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '4px 8px', borderRadius: '12px', letterSpacing: '0.05em' }}>DEFAULT</div>
                  )}
                  {!model.isActive && (
                     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <span style={{ background: '#1E293B', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>INACTIVE</span>
                     </div>
                  )}
                </div>
                <div style={{ padding: '16px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 600, color: '#1E293B' }}>{model.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'capitalize', background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px' }}>{model.gender}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ flex: 1, padding: '6px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '6px', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Edit2 size={16} /></button>
                    <button style={{ flex: 1, padding: '6px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', color: '#B91C1C', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>PRODUCT</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>CUSTOMER</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>STATUS</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>TIME</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {generations.map(gen => (
                <tr key={gen._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={gen.productImage} alt={gen.productName} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1E293B' }}>{gen.productName || gen.productId}</span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.9rem', color: '#475569' }}>
                    {gen.userId ? gen.userId.name : 'Guest'}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                      background: gen.status === 'completed' ? '#DCFCE7' : gen.status === 'failed' ? '#FEE2E2' : '#FEF3C7',
                      color: gen.status === 'completed' ? '#16A34A' : gen.status === 'failed' ? '#DC2626' : '#D97706'
                    }}>
                      {gen.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.9rem', color: '#475569' }}>
                    {new Date(gen.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: '#3B82F6', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settings' && config && (
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', maxWidth: '600px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1E293B', margin: '0 0 24px 0' }}>Engine Configuration</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Max Requests per User</label>
              <input type="number" name="maxRequestsPerUser" value={config.maxRequestsPerUser} onChange={handleConfigChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Max Upload Size (MB)</label>
              <input type="number" name="maxImageUploadSizeMB" value={config.maxImageUploadSizeMB} onChange={handleConfigChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#F8FAFC', borderRadius: '8px' }}>
              <input type="checkbox" name="allowGuestUsers" checked={config.allowGuestUsers} onChange={handleConfigChange} id="allowGuestUsers" style={{ width: '16px', height: '16px' }} />
              <label htmlFor="allowGuestUsers" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1E293B', cursor: 'pointer' }}>Allow Guest Users (No Login Required)</label>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#F8FAFC', borderRadius: '8px' }}>
              <input type="checkbox" name="allowImageDownload" checked={config.allowImageDownload} onChange={handleConfigChange} id="allowImageDownload" style={{ width: '16px', height: '16px' }} />
              <label htmlFor="allowImageDownload" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1E293B', cursor: 'pointer' }}>Allow Users to Download Generated Fit</label>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#F8FAFC', borderRadius: '8px' }}>
              <input type="checkbox" name="allowResultSharing" checked={config.allowResultSharing} onChange={handleConfigChange} id="allowResultSharing" style={{ width: '16px', height: '16px' }} />
              <label htmlFor="allowResultSharing" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1E293B', cursor: 'pointer' }}>Allow Users to Share Generated Fit</label>
            </div>

            <button onClick={saveConfig} disabled={saveLoading} style={{ marginTop: '12px', background: '#1E293B', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}>
              {saveLoading ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
