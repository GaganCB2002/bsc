import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';
import { User, Mail, Phone, MapPin, Lock, Save, Eye, EyeOff, Shield } from 'lucide-react';

export default function CustomerSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age?.toString() || '',
    gender: user?.gender || '',
    location: user?.location || '',
  });

  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' });

  useEffect(() => { document.title = 'Account Settings - BSC Exclusive'; }, []);

  const handleSaveProfile = () => {
    if (!profile.name || !profile.email) {
      showToast('error', 'Name and email are required');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('userProfile', JSON.stringify({
        name: profile.name,
        phone: profile.phone,
        age: profile.age ? parseInt(profile.age) : undefined,
        gender: profile.gender,
        location: profile.location,
      }));
      setLoading(false);
      showToast('success', 'Profile updated successfully!');
    }, 800);
  };

  const handleChangePassword = () => {
    if (!password.current || !password.newPass || !password.confirm) {
      showToast('error', 'Please fill all password fields');
      return;
    }
    if (password.newPass !== password.confirm) {
      showToast('error', 'New passwords do not match');
      return;
    }
    if (password.newPass.length < 6) {
      showToast('error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPassword({ current: '', newPass: '', confirm: '' });
      showToast('success', 'Password changed successfully!');
    }, 800);
  };

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit' };
  const labelStyle = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 as const, color: '#1E293B', marginBottom: '6px' };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <span style={{ display: 'inline-block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B91C1C', border: '1px solid rgba(185,28,28,0.3)', padding: '3px 12px', marginBottom: '8px' }}>Settings</span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 300, color: '#1A1A1A' }}>Account <span style={{ fontWeight: 700, color: '#B91C1C' }}>Settings</span></h1>
      </div>

      {/* Profile */}
      <div style={{ background: '#fff', border: '1px solid #F0EBE5', borderRadius: '12px', padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={20} color="#B91C1C" /> Personal Information
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}><User size={14} /> Full Name *</label>
            <input style={inputStyle} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="Your full name" />
          </div>
          <div>
            <label style={labelStyle}><Mail size={14} /> Email *</label>
            <input style={inputStyle} type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}><Phone size={14} /> Phone</label>
            <input style={inputStyle} value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
          </div>
          <div>
            <label style={labelStyle}><MapPin size={14} /> Location</label>
            <input style={inputStyle} value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} placeholder="City, State" />
          </div>
          <div>
            <label style={labelStyle}>Age</label>
            <input style={inputStyle} type="number" min="10" max="100" value={profile.age} onChange={e => setProfile({ ...profile, age: e.target.value })} placeholder="Your age" />
          </div>
          <div>
            <label style={labelStyle}>Gender</label>
            <select style={inputStyle} value={profile.gender} onChange={e => setProfile({ ...profile, gender: e.target.value })}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <button onClick={handleSaveProfile} disabled={loading} style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: '#B91C1C', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving...' : <><Save size={16} /> Save Profile</>}
        </button>
      </div>

      {/* Password */}
      <div style={{ background: '#fff', border: '1px solid #F0EBE5', borderRadius: '12px', padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={20} color="#1E3A8A" /> Change Password
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
          <div>
            <label style={labelStyle}><Lock size={14} /> Current Password</label>
            <input style={inputStyle} type="password" value={password.current} onChange={e => setPassword({ ...password, current: e.target.value })} placeholder="Enter current password" />
          </div>
          <div>
            <label style={labelStyle}><Lock size={14} /> New Password</label>
            <div style={{ position: 'relative' }}>
              <input style={{ ...inputStyle, paddingRight: '40px' }} type={showPassword ? 'text' : 'password'} value={password.newPass} onChange={e => setPassword({ ...password, newPass: e.target.value })} placeholder="Min 6 characters" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label style={labelStyle}><Lock size={14} /> Confirm New Password</label>
            <input style={inputStyle} type="password" value={password.confirm} onChange={e => setPassword({ ...password, confirm: e.target.value })} placeholder="Re-enter new password" />
          </div>
        </div>
        <button onClick={handleChangePassword} disabled={loading} style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Updating...' : <><Lock size={16} /> Update Password</>}
        </button>
      </div>

      {/* Danger Zone */}
      <div style={{ background: '#fff', border: '1px solid #FEE2E2', borderRadius: '12px', padding: '28px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#991B1B', marginBottom: '8px' }}>Danger Zone</h3>
        <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '16px' }}>Permanently delete your account and all associated data.</p>
        <button style={{ padding: '10px 20px', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECDD3', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Delete Account</button>
      </div>
    </div>
  );
}