import { useEffect, useState } from 'react';

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  {
    id: '1', label: 'Home', name: 'Priya Sharma', phone: '+91 98765 43210',
    street: '42, MG Road, Ashok Nagar', city: 'Bengaluru', state: 'Karnataka',
    pincode: '560001', isDefault: true,
  },
  {
    id: '2', label: 'Work', name: 'Priya Sharma', phone: '+91 98765 43211',
    street: 'Level 5, Embassy Tech Village, Marathahalli', city: 'Bengaluru', state: 'Karnataka',
    pincode: '560037', isDefault: false,
  },
];

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);

  useEffect(() => {
    document.title = 'Saved Addresses - BSC Exclusive';
  }, []);

  const setDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const removeAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <span style={{
          display: 'inline-block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)',
          padding: '3px 12px', marginBottom: '8px'
        }}>My Account</span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 300, color: '#1A1A1A' }}>Saved <span style={{ fontWeight: 700, color: '#A05252' }}>Addresses</span></h1>
      </div>

      {addresses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', border: '1px solid #F0EBE5' }}>
          <p style={{ fontSize: '1rem', color: '#6B6B6B', marginBottom: '8px' }}>No addresses saved yet</p>
          <p style={{ fontSize: '0.85rem', color: '#999' }}>Add an address for faster checkout.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {addresses.map(addr => (
            <div key={addr.id} style={{
              background: '#fff', border: `1.5px solid ${addr.isDefault ? '#A05252' : '#F0EBE5'}`,
              padding: '24px', position: 'relative'
            }}>
              {addr.isDefault && (
                <span style={{
                  position: 'absolute', top: '12px', right: '12px',
                  fontSize: '0.55rem', fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.05em', color: '#A05252', border: '1px solid #A05252',
                  padding: '2px 8px'
                }}>Default</span>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{
                  width: '32px', height: '32px', background: '#F5F0EB', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem',
                  fontWeight: 700, color: '#A05252'
                }}>{addr.label.charAt(0)}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A1A1A' }}>{addr.label}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#1A1A1A', fontWeight: 500, marginBottom: '4px' }}>{addr.name}</div>
              <div style={{ fontSize: '0.78rem', color: '#999', marginBottom: '2px' }}>{addr.phone}</div>
              <div style={{ fontSize: '0.78rem', color: '#6B6B6B', lineHeight: 1.5 }}>
                {addr.street}, {addr.city}, {addr.state} — {addr.pincode}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F0EBE5' }}>
                {!addr.isDefault && (
                  <button
                    onClick={() => setDefault(addr.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#A05252', fontWeight: 500, fontFamily: 'inherit', padding: 0 }}
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => removeAddress(addr.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#C62828', fontWeight: 500, fontFamily: 'inherit', padding: 0 }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
