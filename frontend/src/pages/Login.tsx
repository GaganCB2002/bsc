import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import { showToast } from '../components/Toast';
import './Login.css';

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
    <div className="login-page-container">
      <div className="login-bg-image" />

      <div className="login-content-wrapper">
        <div className="login-form-container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Link to="/" className="login-header-logo">
              <BrandLogo size={48} variant="gold" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E3A8A', lineHeight: 1.2 }}>Channabasappa</div>
                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Learning Academy</div>
              </div>
            </Link>
            <h1 className="login-title">Welcome <span style={{ fontWeight: 700, color: '#1E3A8A' }}>Back</span></h1>
            <p className="login-subtitle">Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form-card">
            {error && (
              <div className="login-error-alert">
                {error}
              </div>
            )}

            <div className="login-input-group">
              <label className="login-input-label">Email Address</label>
              <div className="login-input-wrapper">
                <Mail size={16} className="login-input-icon" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="you@example.com"
                  className="login-input-field"
                />
              </div>
            </div>

            <div className="login-input-group" style={{ marginBottom: '24px' }}>
              <label className="login-input-label">Password</label>
              <div className="login-input-wrapper">
                <Lock size={16} className="login-input-icon" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter your password"
                  className="login-input-field.has-right-icon"
                  style={{ width: '100%', padding: '12px 44px 12px 42px', border: '1.5px solid #E8E0D6', borderRadius: '4px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-toggle-password"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="login-submit-btn">
              {loading ? <><Loader2 size={16} className="login-spin-icon" /> Signing in...</> : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <span style={{ color: '#8A7A6A', fontSize: '0.85rem' }}>Don't have an account? </span>
              <Link to="/register" style={{ color: '#B91C1C', fontWeight: 600, fontSize: '0.85rem' }}>Create Account</Link>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #E8E0D6' }}>
              <p style={{ color: '#999', fontSize: '0.75rem' }}>Demo Accounts:</p>
              <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px' }}>Admin: admin@bschannabasappa.com / Admin123!</p>
              <p style={{ color: '#666', fontSize: '0.75rem' }}>User: user@bschannabasappa.com / User123!</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
