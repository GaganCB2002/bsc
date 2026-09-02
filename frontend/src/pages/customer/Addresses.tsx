import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { showToast } from '../../components/Toast';

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const INITIAL: Address[] = [
  { id: '1', name: 'Home', phone: '+91 8192 272180', line1: '123 Silk Board Layout', line2: 'Near Medical College', city: 'Davangere', state: 'Karnataka', pincode: '577001', isDefault: true },
  { id: '2', name: 'Office', phone: '+91 8192 272180', line1: '456 Gandhi Road', line2: 'Tilakwadi', city: 'Belgaum', state: 'Karnataka', pincode: '590001', isDefault: false },
];

export default function CustomerAddresses() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', line1: '', line2: '', city: '', state: 'Karnataka', pincode: '' });

  useEffect(() => { document.title = 'My Addresses - BSC Exclusive'; }, []);

  const resetForm = () => { setForm({ name: '', phone: '', line1: '', line2: '', city: '', state: 'Karnataka', pincode: '' }); setEditingId(null); setShowForm(false); };

  const handleSave = () => {
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.pincode) {
      showToast('error', 'Please fill all required fields');
      return;
    }
    if (editingId) {
      setAddresses(prev => prev.map(a => a.id === editingId ? { ...a, ...form } : a));
      showToast('success', 'Address updated!');
    } else {
      const newAddr: Address = { id: Date.now().toString(), ...form, isDefault: addresses.length === 0 };
      setAddresses(prev => [...prev, newAddr]);
      showToast('success', 'Address added!');
    }
    resetForm();
  };

  const handleEdit = (addr: Address) => {
    setForm({ name: addr.name, phone: addr.phone, line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state, pincode: addr.pincode });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    showToast('info', 'Address deleted');
  };

  const handleDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    showToast('success', 'Default address updated');
  };

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 600 as const, color: '#1E293B', marginBottom: '4px' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span style={{ display: 'inline-block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B91C1C', border: '1px solid rgba(185,28,28,0.3)', padding: '3px 12px', marginBottom: '8px' }}>Addresses</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 300, color: '#1A1A1A' }}>Saved <span style={{ fontWeight: 700, color: '#B91C1C' }}>Addresses</span></h1>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#B91C1C', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
          <Plus size={16} /> Add Address
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>{editingId ? 'Edit Address' : 'New Address'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={labelStyle}>Label (Home/Office) *</label><input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Home" /></div>
            <div><label style={labelStyle}>Phone *</label><input style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" /></div>
            <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Address Line 1 *</label><input style={inputStyle} value={form.line1} onChange={e => setForm({ ...form, line1: e.target.value })} placeholder="Street address" /></div>
            <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Address Line 2</label><input style={inputStyle} value={form.line2} onChange={e => setForm({ ...form, line2: e.target.value })} placeholder="Apartment, suite, etc." /></div>
            <div><label style={labelStyle}>City *</label><input style={inputStyle} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
            <div><label style={labelStyle}>State</label><input style={inputStyle} value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} /></div>
            <div><label style={labelStyle}>Pincode *</label><input style={inputStyle} value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} placeholder="577001" /></div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}><Check size={16} /> {editingId ? 'Update' : 'Save'}</button>
            <button onClick={resetForm} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}><X size={16} /> Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {addresses.map(addr => (
          <div key={addr.id} style={{ background: '#fff', border: addr.isDefault ? '2px solid #B91C1C' : '1px solid #F0EBE5', borderRadius: '12px', padding: '20px', position: 'relative' }}>
            {addr.isDefault && <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#B91C1C', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600 }}>Default</span>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <MapPin size={18} color="#B91C1C" />
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1A1A2E' }}>{addr.name}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
              <div>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</div>
              <div>{addr.city}, {addr.state} - {addr.pincode}</div>
              <div style={{ marginTop: '4px' }}>{addr.phone}</div>
            </div>
            <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid #F0EBE5', paddingTop: '12px' }}>
              {!addr.isDefault && <button onClick={() => handleDefault(addr.id)} style={{ flex: 1, padding: '6px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#166534', cursor: 'pointer' }}>Set Default</button>}
              <button onClick={() => handleEdit(addr)} style={{ flex: 1, padding: '6px', background: '#F1F5F9', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><Edit2 size={12} /> Edit</button>
              <button onClick={() => handleDelete(addr.id)} style={{ padding: '6px 10px', background: '#FEE2E2', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#B91C1C' }}><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}