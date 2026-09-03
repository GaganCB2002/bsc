import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Heart, MapPin, Settings, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import PublicHeader from '../components/PublicHeader';
import { useAuth } from '../context/AuthContext';

const sidebarItems = [
  { path: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { path: '/dashboard/orders', icon: <Package size={18} />, label: 'My Orders' },
  { path: '/dashboard/wishlist', icon: <Heart size={18} />, label: 'Wishlist' },
  { path: '/dashboard/addresses', icon: <MapPin size={18} />, label: 'Addresses' },
  { path: '/dashboard/settings', icon: <Settings size={18} />, label: 'Settings' },
];

function SidebarContent({ user, onLogout, isActive, onClose }: {
  user: { name: string; email: string } | null;
  onLogout: () => void;
  isActive: (path: string) => boolean;
  onClose: () => void;
}) {
  return (
    <div style={{ width: '260px', flexShrink: 0, background: '#fff', borderRight: '1px solid #E2E8F0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#B91C1C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1E293B' }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{user?.email || 'user@bsc.com'}</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {sidebarItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px',
              textDecoration: 'none', fontSize: '0.85rem', fontWeight: isActive(item.path) ? 600 : 400,
              color: isActive(item.path) ? '#B91C1C' : '#64748B',
              background: isActive(item.path) ? '#FEE2E2' : 'transparent',
              marginBottom: '4px', transition: 'all 0.2s'
            }}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      <div style={{ padding: '16px 12px', borderTop: '1px solid #F1F5F9' }}>
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px',
            border: 'none', background: 'none', width: '100%', cursor: 'pointer', fontSize: '0.85rem',
            color: '#94A3B8', fontFamily: 'inherit', textAlign: 'left'
          }}
        >
          <LogOut size={18} /> Sign Out
        </button>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', textDecoration: 'none', fontSize: '0.85rem', color: '#94A3B8', marginTop: '4px' }}>
          <ChevronRight size={18} /> Back to Store
        </Link>
      </div>
    </div>
  );
}

export default function CustomerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  // Close the mobile drawer on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mobileOpen]);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <PublicHeader />
      <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none', position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000,
            width: '48px', height: '48px', borderRadius: '50%', background: '#B91C1C', color: '#fff',
            border: 'none', cursor: 'pointer', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
          className="mobile-sidebar-toggle"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="customer-sidebar-desktop">
          <SidebarContent user={user} onLogout={handleLogout} isActive={isActive} onClose={() => {}} />
        </div>

        {mobileOpen && (
          <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 998 }} />
        )}
        <div
          className="customer-sidebar-mobile"
          style={{
            position: 'fixed', left: mobileOpen ? 0 : '-300px', top: 0, bottom: 0, zIndex: 999,
            transition: 'left 0.3s ease', background: '#fff'
          }}
        >
          <SidebarContent user={user} onLogout={handleLogout} isActive={isActive} onClose={() => setMobileOpen(false)} />
        </div>

        <div style={{ flex: 1, padding: '32px 24px', minWidth: 0 }}>
          <Outlet />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .customer-sidebar-desktop { display: none !important; }
          .mobile-sidebar-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .customer-sidebar-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
