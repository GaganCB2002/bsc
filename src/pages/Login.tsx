import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import { showToast } from '../components/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Sign In - BS Channabasappa Academy';
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      showToast('success', 'Welcome back!');
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #2C2826 0%, #1a1a1a 50%, #2C2826 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.06 }} />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '32px' }}>
              <BrandLogo size={48} variant="gold" />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#D4A574', lineHeight: 1.2 }}>Channabasappa</div>
                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Learning Academy</div>
              </div>
            </Link>
            <h1 style={{ fontSize: '2rem', fontWeight: 300, color: '#fff', marginBottom: '8px' }}>Welcome <span style={{ fontWeight: 700, color: '#D4A574' }}>Back</span></h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '40px', borderRadius: '4px' }}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '4px', marginBottom: '24px', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', marginBottom: '8px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  style={{ width: '100%', padding: '12px 14px 12px 42px', border: '1.5px solid #E8E0D6', borderRadius: '4px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C47A6A'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#E8E0D6'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', marginBottom: '8px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                  style={{ width: '100%', padding: '12px 44px 12px 42px', border: '1.5px solid #E8E0D6', borderRadius: '4px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C47A6A'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#E8E0D6'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px', background: loading ? '#B8A88A' : '#C47A6A', color: '#fff', border: 'none', borderRadius: '4px',
                fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'background 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</> : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <span style={{ color: '#8A7A6A', fontSize: '0.85rem' }}>Don't have an account? </span>
              <Link to="/register" style={{ color: '#C47A6A', fontWeight: 600, fontSize: '0.85rem' }}>Create Account</Link>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #E8E0D6' }}>
              <p style={{ color: '#999', fontSize: '0.75rem' }}>Demo Accounts:</p>
              <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px' }}>Admin: admin@bschannabasappa.com / Admin123!</p>
              <p style={{ color: '#666', fontSize: '0.75rem' }}>User: user@bschannabasappa.com / User123!</p>
            </div>
          </form>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  );
}
