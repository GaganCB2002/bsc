import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, Phone } from 'lucide-react';
import '../pages/LandingPage.css';

export default function LoginSelection() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    const els = document.querySelectorAll('.reveal');
    els.forEach(el => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    document.title = 'Sign In - BSC Exclusive';
  }, []);

  return (
    <div className="lp-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(26,26,26,0.8)', backdropFilter: 'blur(12px)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
            <img src="/bsc-logo.png" alt="BSC Exclusive" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </Link>
        <Link to="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textDecoration: 'none' }}>← Back to Home</Link>
      </div>

      <section style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 24px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2C2C2C 50%, #1A1A2E 100%)'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.08,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px' }}>
          <div className="reveal" style={{
            textAlign: 'center',
            marginBottom: '56px',
          }}>
            <span style={{
              display: 'inline-block',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#1E3A8A',
              border: '1px solid rgba(30,58,138,0.3)',
              padding: '4px 14px',
              marginBottom: '16px'
            }}>Access Portal</span>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 300,
              color: '#fff',
              marginBottom: '12px',
              letterSpacing: '-0.02em'
            }}>Welcome to <span style={{ fontWeight: 700, color: '#1E3A8A' }}>BSC Exclusive</span></h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', maxWidth: '480px', margin: '0 auto' }}>
              Select your portal to continue your journey with us.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Customer Portal */}
            <div className="reveal" style={{
              flex: '1 1 360px',
              maxWidth: '440px',
              background: '#fff',
              borderRadius: '2px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{
                height: '220px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600&h=400"
                  alt="Customer shopping"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)'
                }} />
              </div>
              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '10px', color: '#1A1A2E' }}>Customer Portal</h2>
                <p style={{ fontSize: '0.88rem', color: '#8A7A6A', lineHeight: 1.7, marginBottom: '28px', flex: 1 }}>
                  Track your orders, manage your wishlist, and update your shipping details.
                </p>
                <Link to="/customer" onClick={() => localStorage.setItem('intendedRole', 'customer')} style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#B91C1C',
                  color: '#fff',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  textAlign: 'center',
                  textDecoration: 'none',
                  transition: 'background-color 0.3s',
                  borderRadius: '2px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#991B1B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'}
                >
                  Login as Customer
                </Link>
              </div>
            </div>

            {/* Admin Portal */}
            <div className="reveal" style={{
              flex: '1 1 360px',
              maxWidth: '440px',
              background: '#fff',
              borderRadius: '2px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{
                height: '220px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600&h=400"
                  alt="Admin workspace"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)'
                }} />
              </div>
              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '10px', color: '#1A1A2E' }}>BSC Worker Portal</h2>
                <p style={{ fontSize: '0.88rem', color: '#8A7A6A', lineHeight: 1.7, marginBottom: '28px', flex: 1 }}>
                  Access the administrative dashboard to manage inventory, orders, and analytics.
                </p>
                <Link to="/admin" onClick={() => localStorage.setItem('intendedRole', 'admin')} style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#1A1A2E',
                  color: '#fff',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  textAlign: 'center',
                  textDecoration: 'none',
                  transition: 'background-color 0.3s',
                  borderRadius: '2px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3D3834'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1A1A2E'}
                >
                  Login as BSC Worker
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Details Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#FDF8F3' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '16px' }}>Secure, Seamless Access</h2>
            <p style={{ color: '#8A7A6A', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Whether you are shopping for your special day or managing our inventory, our specialized portals are designed to give you exactly what you need with enterprise-grade security.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            <div className="reveal" style={{ padding: '32px', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', borderTop: '4px solid #B91C1C' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(30,58,138,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Shield size={24} color="#1E3A8A" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px', color: '#1A1A2E' }}>Data Privacy</h3>
              <p style={{ color: '#8A7A6A', lineHeight: 1.6, fontSize: '0.9rem' }}>Your personal details, order histories, and addresses are encrypted and stored with industry-leading security protocols. We never share your data.</p>
            </div>
            
            <div className="reveal" style={{ padding: '32px', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', borderTop: '4px solid #1E3A8A' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(30,58,138,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Award size={24} color="#1E3A8A" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px', color: '#1A1A2E' }}>Premium Experience</h3>
              <p style={{ color: '#8A7A6A', lineHeight: 1.6, fontSize: '0.9rem' }}>Enjoy a tailored shopping experience with personalized recommendations, dedicated wishlist management, and priority support.</p>
            </div>
            
            <div className="reveal" style={{ padding: '32px', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', borderTop: '4px solid #1A1A2E' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(30,58,138,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Phone size={24} color="#1E3A8A" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px', color: '#1A1A2E' }}>24/7 Support</h3>
              <p style={{ color: '#8A7A6A', lineHeight: 1.6, fontSize: '0.9rem' }}>Having trouble logging in? Our dedicated support team is available round the clock to assist you with any portal access issues.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1A1A2E', color: '#fff', padding: '24px', textAlign: 'center', fontSize: '0.875rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>&copy; {new Date().getFullYear()} BSC Exclusive. All rights reserved.</p>
      </footer>
    </div>
  );
}
