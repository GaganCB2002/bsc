import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  User, Package, Heart, MapPin, 
  Settings, HelpCircle, 
  ShoppingBag, Search, Bell, Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function CustomerLayout() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  useEffect(() => {
    document.title = 'My Account - BSC Exclusive';
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarStyle: React.CSSProperties = {
    width: sidebarCollapsed ? '72px' : '250px',
    background: 'linear-gradient(180deg, #FFF5F5 0%, #FFFFFF 100%)',
    borderRight: '1px solid #FECDD3',
    display: 'flex',
    flexDirection: 'column',
    padding: sidebarCollapsed ? '24px 8px' : '24px 16px',
    flexShrink: 0,
    transition: 'width 0.3s ease',
  };

  const navItemStyle: React.CSSProperties = {
    padding: '10px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#6B7280',
    fontWeight: 500,
    fontSize: '0.875rem',
    textDecoration: 'none',
    transition: 'all 0.2s',
  };

  const activeNavItemStyle: React.CSSProperties = {
    ...navItemStyle,
    background: '#FEE2E2',
    color: '#B91C1C',
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F8FAFC' }}>
      <aside style={sidebarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', boxShadow: '0 2px 8px rgba(185,28,28,0.15)' }}>
              <img src="/bsc-logo.png" alt="BSC Exclusive" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </Link>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <NavLink to="/dashboard" end style={({ isActive }) => isActive ? activeNavItemStyle : navItemStyle} title="My Account">
            <span style={{ flexShrink: 0 }}><User size={20} /></span>
            {!sidebarCollapsed && <span>My Account</span>}
          </NavLink>
          <NavLink to="/dashboard/orders" style={({ isActive }) => isActive ? activeNavItemStyle : navItemStyle} title="Order History">
            <span style={{ flexShrink: 0 }}><Package size={20} /></span>
            {!sidebarCollapsed && <span>Order History</span>}
          </NavLink>
          <NavLink to="/dashboard/wishlist" style={({ isActive }) => isActive ? activeNavItemStyle : navItemStyle} title="Wishlist">
            <span style={{ flexShrink: 0 }}><Heart size={20} /></span>
            {!sidebarCollapsed && <span>Wishlist</span>}
          </NavLink>
          <NavLink to="/dashboard/addresses" style={({ isActive }) => isActive ? activeNavItemStyle : navItemStyle} title="Saved Addresses">
            <span style={{ flexShrink: 0 }}><MapPin size={20} /></span>
            {!sidebarCollapsed && <span>Saved Addresses</span>}
          </NavLink>
          <NavLink to="/dashboard/settings" style={({ isActive }) => isActive ? activeNavItemStyle : navItemStyle} title="Account Settings">
            <span style={{ flexShrink: 0 }}><Settings size={20} /></span>
            {!sidebarCollapsed && <span>Account Settings</span>}
          </NavLink>
        </nav>
        
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #FECDD3', paddingTop: '16px' }}>
          {!sidebarCollapsed && (
            <Link to="/category/new-arrivals" style={{ display: 'block', textDecoration: 'none', backgroundColor: '#B91C1C', color: '#fff', padding: '12px', borderRadius: '10px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>Shop New Arrivals</Link>
          )}
          {sidebarCollapsed && (
            <Link to="/category/new-arrivals" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', backgroundColor: '#B91C1C', color: '#fff', padding: '10px', borderRadius: '10px' }} title="Shop">
              <ShoppingBag size={20} />
            </Link>
          )}
          <div style={navItemStyle} title="Contact Support"><span style={{ flexShrink: 0 }}><HelpCircle size={20} /></span>{!sidebarCollapsed && <span>Contact Support</span>}</div>
          <div onClick={handleLogout} style={{ ...navItemStyle, color: '#B91C1C', cursor: 'pointer' }} title="Sign Out"><span style={{ flexShrink: 0 }}><LogOut size={20} /></span>{!sidebarCollapsed && <span>Sign Out</span>}</div>
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ height: '72px', background: '#fff', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748B', padding: '8px', borderRadius: '8px' }}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', background: '#F1F5F9', padding: '8px 16px', borderRadius: '8px', width: '400px' }}>
              <span style={{ display: 'flex', alignItems: 'center', color: '#94A3B8' }}><Search size={20} /></span>
              <input type="text" placeholder="Search products, collections..." style={{ background: 'transparent', border: 'none', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '0.875rem' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link to="/category/women" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748B', textDecoration: 'none' }}><ShoppingBag size={24} /></Link>
            
            <div style={{ position: 'relative' }}>
              <span onClick={() => setShowNotifications(!showNotifications)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748B', position: 'relative' }}>
                <Bell size={24} />
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#B91C1C', color: 'white', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '10px', fontWeight: 'bold' }}>1</span>
              </span>
              
              {showNotifications && (
                <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '12px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '320px', zIndex: 50 }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', fontWeight: 600 }}>Notifications</div>
                  <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', fontSize: '0.875rem', cursor: 'pointer' }}>
                    <div style={{ fontWeight: 600, color: '#1E293B' }}>Order Shipped</div>
                    <div style={{ color: '#64748B', marginTop: '4px' }}>Your order #ORD-9821 has been shipped!</div>
                  </div>
                  <div style={{ padding: '12px 16px', textAlign: 'center', color: '#B91C1C', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Mark as read</div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, fontSize: '0.875rem', borderLeft: '1px solid #E2E8F0', paddingLeft: '24px' }}>
              <div>{user?.name || 'Customer'}</div>
            </div>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B91C1C', fontWeight: 600, padding: '8px 16px', backgroundColor: '#FEE2E2', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        <div style={{ padding: '32px', overflowY: 'auto', height: '100%', background: '#F8FAFC' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
