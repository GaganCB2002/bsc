import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, Phone, Loader2, MapPin, Calendar } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import { showToast } from '../components/Toast';
import { getAgeRecommendation } from '../utils/ageRecommendations';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', age: '', gender: '', location: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { document.title = 'Create Account - BSC Exclusive'; }, []);
  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin/overview' : '/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    if (!form.age || !form.gender) {
      setError('Age and Gender are required for personalized recommendations');
      return;
    }
    const ageNum = parseInt(form.age);
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 100) {
      setError('Please enter a valid age (10-100)');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      phone: form.phone,
      age: ageNum,
      gender: form.gender,
      location: form.location
    });
    setLoading(false);
    if (result.success) {
      showToast('success', 'Account created successfully! Welcome to BSC Exclusive.');
      navigate(result.role === 'admin' ? '/admin/overview' : '/');
    } else {
      setError(result.message);
    }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 14px 12px 42px', border: '1.5px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' };
  const selectStyle: React.CSSProperties = { ...inputStyle, appearance: 'none' as const, cursor: 'pointer' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#64748B', marginBottom: '8px' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #1A1A2E 0%, #1a1a1a 50%, #1A1A2E 100%)', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.06 }} />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '32px' }}>
            <BrandLogo size={36} variant="light" />
          </Link>

          <h1 style={{ fontSize: '2rem', fontWeight: 300, color: '#fff', marginBottom: '8px' }}>Create your account</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '32px' }}>Join BSC Exclusive for personalized shopping</p>

          <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.85rem' }}>{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}><User size={16} /></span>
                  <input type="text" value={form.name} onChange={handleChange('name')} placeholder="Enter your full name" style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}><Mail size={16} /></span>
                  <input type="email" value={form.email} onChange={handleChange('email')} placeholder="you@example.com" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Age *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}><Calendar size={16} /></span>
                    <input type="number" min="10" max="100" value={form.age} onChange={handleChange('age')} placeholder="Age" style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Gender *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999', zIndex: 1 }}><User size={16} /></span>
                    <select value={form.gender} onChange={handleChange('gender')} style={selectStyle}>
                      <option value="">Select</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {form.age && parseInt(form.age) >= 10 && parseInt(form.age) <= 100 && (
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#166534' }}>
                    Your age group: <strong>{getAgeRecommendation(parseInt(form.age)).label}</strong> — We'll show you personalized recommendations!
                  </span>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}><Phone size={16} /></span>
                  <input type="tel" value={form.phone} onChange={handleChange('phone')} placeholder="+91 98765 43210" style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>City / Location</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}><MapPin size={16} /></span>
                  <input type="text" value={form.location} onChange={handleChange('location')} placeholder="e.g. Davangere, Karnataka" style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Password *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}><Lock size={16} /></span>
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange('password')} placeholder="Min 6 characters" style={{ ...inputStyle, paddingRight: '44px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 0 }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}><Lock size={16} /></span>
                  <input type="password" value={form.confirmPassword} onChange={handleChange('confirmPassword')} placeholder="Re-enter password" style={inputStyle} />
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px', background: loading ? '#B8A88A' : '#B91C1C', color: '#fff', border: 'none',
                borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.3s'
              }}>
                {loading ? <><Loader2 size={16} className="login-spin-icon" /> Creating Account...</> : 'Create Account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#666' }}>
              Already have an account? <Link to="/login" style={{ color: '#B91C1C', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
