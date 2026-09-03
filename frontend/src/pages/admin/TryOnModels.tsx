import { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Star, User, Save, X } from 'lucide-react';
import { tryOnService, type TryOnModel } from '../../services/tryOnService';
import { showToast } from '../../components/Toast';

export default function TryOnModels() {
  const [models, setModels] = useState<TryOnModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingModel, setEditingModel] = useState<TryOnModel | null>(null);
  const [form, setForm] = useState({ name: '', imageUrl: '', gender: 'female', description: '', isDefault: false });

  const loadModels = async () => {
    try {
      const res = await tryOnService.adminGetModels();
      if (res.success) setModels(res.data);
    } catch {
      showToast('error', 'Failed to load models');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Model Management - BSC Exclusive Admin';
    loadModels();
  }, []);

  const openAdd = () => {
    setEditingModel(null);
    setForm({ name: '', imageUrl: '', gender: 'female', description: '', isDefault: false });
    setShowModal(true);
  };

  const openEdit = (m: TryOnModel) => {
    setEditingModel(m);
    setForm({ name: m.name, imageUrl: m.imageUrl, gender: m.gender, description: m.description || '', isDefault: m.isDefault });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.imageUrl) {
      showToast('error', 'Name and image URL are required');
      return;
    }
    try {
      if (editingModel) {
        await tryOnService.adminUpdateModel(editingModel._id, form);
        showToast('success', 'Model updated');
      } else {
        await tryOnService.adminCreateModel(form);
        showToast('success', 'Model created');
      }
      setShowModal(false);
      loadModels();
    } catch {
      showToast('error', 'Failed to save model');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this model?')) return;
    try {
      await tryOnService.adminDeleteModel(id);
      showToast('success', 'Model deleted');
      loadModels();
    } catch {
      showToast('error', 'Failed to delete model');
    }
  };

  const toggleDefault = async (m: TryOnModel) => {
    try {
      await tryOnService.adminUpdateModel(m._id, { isDefault: !m.isDefault });
      showToast('success', m.isDefault ? 'Removed as default' : 'Set as default model');
      loadModels();
    } catch {
      showToast('error', 'Failed to update model');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #F1F5F9', borderTopColor: '#B91C1C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1><User size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Model Management</h1>
          <p>Add, edit, or remove fitting room models. Set a default model for customers.</p>
        </div>
        <button onClick={openAdd} style={{
          backgroundColor: '#B91C1C', color: '#fff', padding: '10px 20px', border: 'none',
          borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <Plus size={18} /> Add Model
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
        {models.map((model) => (
          <div key={model._id} style={{
            background: '#fff', border: `2px solid ${model.isDefault ? '#B91C1C' : '#E2E8F0'}`,
            borderRadius: '12px', overflow: 'hidden', position: 'relative',
          }}>
            {model.isDefault && (
              <div style={{
                position: 'absolute', top: '10px', left: '10px', background: '#B91C1C',
                color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '0.65rem',
                fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', zIndex: 1,
              }}>
                <Star size={10} fill="#fff" /> Default
              </div>
            )}
            <img src={model.imageUrl} alt={model.name} style={{
              width: '100%', height: '200px', objectFit: 'cover',
            }} />
            <div style={{ padding: '14px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', margin: '0 0 4px' }}>{model.name}</h3>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0 0 4px' }}>
                {model.gender.charAt(0).toUpperCase() + model.gender.slice(1)} · {model.isActive ? 'Active' : 'Inactive'}
              </p>
              {model.description && (
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 12px' }}>{model.description}</p>
              )}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button onClick={() => openEdit(model)} style={{
                  flex: 1, padding: '6px', background: '#F1F5F9', border: 'none', borderRadius: '6px',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#64748B',
                }}>
                  <Edit3 size={13} /> Edit
                </button>
                <button onClick={() => toggleDefault(model)} style={{
                  flex: 1, padding: '6px', background: model.isDefault ? '#FEE2E2' : '#F1F5F9',
                  border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '4px', color: model.isDefault ? '#B91C1C' : '#64748B',
                }}>
                  <Star size={13} fill={model.isDefault ? '#B91C1C' : 'none'} /> {model.isDefault ? 'Default' : 'Set Default'}
                </button>
                <button onClick={() => handleDelete(model._id)} style={{
                  padding: '6px 10px', background: '#FEE2E2', border: 'none', borderRadius: '6px',
                  cursor: 'pointer', color: '#B91C1C',
                }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {models.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px',
          border: '1px solid #E2E8F0',
        }}>
          <User size={40} color="#94A3B8" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1rem', color: '#1E293B', marginBottom: '8px' }}>No models yet</h3>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '16px' }}>Add fitting room models for customers to try on clothes with.</p>
          <button onClick={openAdd} style={{
            padding: '10px 20px', background: '#B91C1C', color: '#fff', border: 'none',
            borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
          }}>
            Add Your First Model
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={() => setShowModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{
            position: 'relative', background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '480px',
            padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                {editingModel ? 'Edit Model' : 'Add Model'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: '#1E293B' }}>Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={{
                  width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem',
                }} placeholder="e.g. Default Female Model" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: '#1E293B' }}>Image URL *</label>
                <input value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} style={{
                  width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem',
                }} placeholder="https://..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: '#1E293B' }}>Gender</label>
                <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))} style={{
                  width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem',
                }}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: '#1E293B' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} style={{
                  width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', resize: 'vertical',
                }} placeholder="Optional description" />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#1E293B', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isDefault} onChange={e => setForm(p => ({ ...p, isDefault: e.target.checked }))} />
                Set as default model
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{
                padding: '10px 20px', background: '#F1F5F9', color: '#64748B', border: 'none',
                borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
              }}>Cancel</button>
              <button onClick={handleSave} style={{
                padding: '10px 20px', background: '#B91C1C', color: '#fff', border: 'none',
                borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '6px', fontSize: '0.85rem',
              }}>
                <Save size={16} /> {editingModel ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
