import { useEffect, useState } from 'react';
import { User, Mail, Phone, Lock, Bell, Save } from 'lucide-react';

export default function Settings() {
  const [name, setName] = useState('Priya Sharma');
  const [email, setEmail] = useState('priya.sharma@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = 'Account Settings - BSC Exclusive';
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <span style={{
          display: 'inline-block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: '#1E3A8A', border: '1px solid rgba(30,58,138,0.3)',
          padding: '3px 12px', marginBottom: '8px'
        }}>My Account</span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 300, color: '#1A1A1A' }}>Account <span style={{ fontWeight: 700, color: '#A05252' }}>Settings</span></h1>
      </div>

      <form onSubmit={handleSave} style={{ maxWidth: '560px' }}>
        <div style={{ background: '#fff', border: '1px solid #F0EBE5', padding: '32px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={18} color="#A05252" /> Profile Information
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: '6px' }}>
              <User size={13} style={{ marginRight: '4px' }} /> Full Name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid #E8E0D6',
                fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none', background: '#FAFAFA',
                color: '#1A1A1A', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: '6px' }}>
              <Mail size={13} style={{ marginRight: '4px' }} /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid #E8E0D6',
                fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none', background: '#FAFAFA',
                color: '#1A1A1A', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: '6px' }}>
              <Phone size={13} style={{ marginRight: '4px' }} /> Phone Number
            </label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid #E8E0D6',
                fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none', background: '#FAFAFA',
                color: '#1A1A1A', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginBottom: '6px' }}>
              <Lock size={13} style={{ marginRight: '4px' }} /> Password
            </label>
            <input
              type="password"
              placeholder="Leave blank to keep current"
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid #E8E0D6',
                fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none', background: '#FAFAFA',
                color: '#1A1A1A', boxSizing: 'border-box'
              }}
            />
          </div>

          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={18} color="#A05252" /> Preferences
          </h2>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '28px', fontSize: '0.85rem', color: '#1A1A1A' }}>
            <input
              type="checkbox"
              checked={notifications}
              onChange={e => setNotifications(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#A05252' }}
            />
            Receive email notifications about new collections and offers
          </label>

          <button
            type="submit"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px',
              background: saved ? '#2E7D32' : '#A05252', color: '#fff', border: 'none',
              fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.3s'
            }}
          >
            <Save size={15} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
