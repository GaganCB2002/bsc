import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    document.title = 'Sign In - BSC Exclusive';
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin/overview', { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, redirectTo]);

  useEffect(() => {
    if (!lockoutUntil) return;
    
    const updateTimer = () => {
      const remaining = Math.ceil((lockoutUntil.getTime() - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockoutUntil(null);
        setTimeRemaining(0);
      } else {
        setTimeRemaining(remaining);
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      showToast('success', 'Welcome back to BSC Exclusive!');
      if (result.role === 'admin') {
        navigate('/admin/overview');
      } else {
        navigate(redirectTo);
      }
    } else {
      if (result.isLocked && result.lockedUntil) {
        setLockoutUntil(new Date(result.lockedUntil));
      }
      setError(result.message);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-bg-overlay" />

      <div className="login-content-wrapper">
        <Link to="/" style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, background: 'rgba(0,0,0,0.3)', padding: '8px 16px', borderRadius: '8px', zIndex: 10, transition: 'background 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; }}>
          ← Back to Home
        </Link>
        <div className="login-split-card">
          
          {/* Left Brand Banner */}
          <div className="login-left-banner">
            <div className="login-left-header">
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                <BrandLogo size={44} variant="gold" />
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', letterSpacing: '0.05em', lineHeight: 1 }}>
                    BSC EXCLUSIVE
                  </div>
                  <div className="login-left-badge">Since 1938</div>
                </div>
              </Link>
            </div>

            <div className="login-left-quote">
              <blockquote>
                "Silk is the queen of all textiles — preserving four generations of handloom mastery and Indian heritage."
              </blockquote>
              <cite>— Master Weaver Raghu, Davangere</cite>
            </div>

            <div className="login-left-footer">
              <div className="login-stat-item">
                <span>85+ Years</span>
                <span>Handloom Legacy</span>
              </div>
              <div className="login-stat-item">
                <span>100% Pure</span>
                <span>Certified Silk</span>
              </div>
              <div className="login-stat-item">
                <span>10K+</span>
                <span>Happy Learners</span>
              </div>
            </div>
          </div>

          {/* Right Form Area */}
          <div className="login-right-form">
            <div style={{ marginBottom: '24px' }}>
              <h1 className="login-form-title">Welcome Back</h1>
              <p className="login-form-subtitle">Sign in to access your academy dashboard & masterclasses</p>
            </div>

            {lockoutUntil ? (
              <div className="login-lockout-card">
                <Lock size={48} className="login-lockout-icon" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A2E', margin: '8px 0' }}>Account Paused</h2>
                <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5 }}>
                  Multiple invalid login attempts detected. Please wait for the timer below before trying again.
                </p>
                <div className="login-lockout-timer">
                  {Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:
                  {(timeRemaining % 60).toString().padStart(2, '0')}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="login-error-box">
                    <span>⚠️ {error}</span>
                  </div>
                )}

                <div className="login-field">
                  <label className="login-label">Email Address *</label>
                  <div className="login-input-wrap">
                    <Mail size={18} className="login-input-icon" />
                    <input
                      type="email"
                      className="login-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label className="login-label">Password *</label>
                  <div className="login-input-wrap">
                    <Lock size={18} className="login-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="login-input"
                      placeholder="Enter your password"
                      value={password}
                      style={{ paddingRight: '44px' }}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute', right: '14px', background: 'none',
                        border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="login-btn-submit">
                  {loading ? (
                    <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </button>

                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#6B7280' }}>
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: '#B91C1C', fontWeight: 700, textDecoration: 'none' }}>
                    Create Account
                  </Link>
                </div>

                {/* Auto-fill Demo Accounts */}
                <div className="login-autofill-section">
                  <div className="login-autofill-label">Quick Demo Access</div>
                  <div className="login-autofill-chips">
                    <button
                      type="button"
                      className="login-chip admin"
                      onClick={() => {
                        setEmail('admin@bscexclusive.com');
                        setPassword('Admin123!');
                        setError('');
                      }}
                    >
                      👑 Admin Demo
                    </button>
                    <button
                      type="button"
                      className="login-chip user"
                      onClick={() => {
                        setEmail('user@bscexclusive.com');
                        setPassword('User123!');
                        setError('');
                      }}
                    >
                      👤 Customer Demo
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
