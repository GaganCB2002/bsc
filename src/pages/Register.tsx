import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, Phone, Loader2 } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import { showToast } from '../components/Toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { document.title = 'Create Account - BS Channabasappa Academy'; }, []);
  useEffect(() => { if (isAuthenticated) navigate('/dashboard', { replace: true }); }, [isAuthenticated, navigate]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const result = await register(form);
    setLoading(false);
    if (result.success) {
      showToast('success', 'Account created! Welcome to the academy.');
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const inputStyle = { width: '100%', padding: '12px 14px 12px 42px', border: '1.5px solid #E8E0D6', borderRadius: '4px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#666', marginBottom: '8px' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #2C2826 0%, #1a1a1a 50%, #2C2826 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1920)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.06 }} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '28px' }}>
              <BrandLogo size={48} variant="gold" />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#D4A574', lineHeight: 1.2 }}>Channabasappa</div>
                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Learning Academy</div>
              </div>
            </Link>
            <h1 style={{ fontSize: '2rem', fontWeight: 300, color: '#fff', marginBottom: '8px' }}>Create <span style={{ fontWeight: 700, color: '#D4A574' }}>Account</span></h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Join our community of learners</p>
          </div>

          <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '36px', borderRadius: '4px' }}>
            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.85rem' }}>{error}</div>}

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input type="text" value={form.name} onChange={handleChange('name')} placeholder="Your full name" style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C47A6A'} onBlur={(e) => e.currentTarget.style.borderColor = '#E8E0D6'} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input type="email" value={form.email} onChange={handleChange('email')} placeholder="you@example.com" style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C47A6A'} onBlur={(e) => e.currentTarget.style.borderColor = '#E8E0D6'} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Phone (Optional)</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input type="tel" value={form.phone} onChange={handleChange('phone')} placeholder="+91 98765 43210" style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C47A6A'} onBlur={(e) => e.currentTarget.style.borderColor = '#E8E0D6'} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange('password')} placeholder="At least 6 characters" style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C47A6A'} onBlur={(e) => e.currentTarget.style.borderColor = '#E8E0D6'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input type="password" value={form.confirmPassword} onChange={handleChange('confirmPassword')} placeholder="Confirm your password" style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C47A6A'} onBlur={(e) => e.currentTarget.style.borderColor = '#E8E0D6'} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', background: loading ? '#B8A88A' : '#C47A6A', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating Account...</> : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <span style={{ color: '#8A7A6A', fontSize: '0.85rem' }}>Already have an account? </span>
              <Link to="/login" style={{ color: '#C47A6A', fontWeight: 600, fontSize: '0.85rem' }}>Sign In</Link>
            </div>
          </form>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  );
}
