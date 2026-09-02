import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  User, Package, Heart, MapPin, 
  Settings, HelpCircle, 
  ShoppingBag, Search, Bell 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import './AdminLayout.css'; // We can reuse the admin layout CSS structure since it's a dashboard

export default function CustomerLayout() {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  useEffect(() => {
    document.title = 'My Account - BS Channabasappa';
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-app">
      <aside className="admin-sidebar" style={{ backgroundColor: '#1A1A2E' }}>
        <Link to="/" className="admin-brand" style={{ gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
            <img src="/bsc-logo.png" alt="BSC Exclusive" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </Link>
        
        <div className="admin-nav-menu">
          <NavLink to="/dashboard" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon"><User size={20} /></span> My Account
          </NavLink>
          <NavLink to="/dashboard/orders" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon"><Package size={20} /></span> Order History
          </NavLink>
          <NavLink to="/dashboard/wishlist" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon"><Heart size={20} /></span> Wishlist
          </NavLink>
          <NavLink to="/dashboard/addresses" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon"><MapPin size={20} /></span> Saved Addresses
          </NavLink>
          <NavLink to="/dashboard/settings" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon"><Settings size={20} /></span> Account Settings
          </NavLink>
        </div>
        
        <div className="admin-nav-bottom">
          <Link to="/category/new-arrivals" className="btn-new-product" style={{ display: 'block', textDecoration: 'none', backgroundColor: '#fff', color: '#1A1A2E' }}>Shop New Arrivals</Link>
          <div className="admin-nav-item"><span className="nav-icon"><HelpCircle size={20} /></span> Contact Support</div>
          <div onClick={handleLogout} className="admin-nav-item" style={{ color: '#FDE0D0', cursor: 'pointer' }}><span className="nav-icon"><LogOut size={20} /></span> Sign Out</div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="search-bar">
            <span style={{ display: 'flex', alignItems: 'center', color: '#9A8A7A' }}><Search size={20} /></span>
            <input type="text" placeholder="Search products, collections..." />
          </div>
          <div className="header-actions">
            <Link to="/category/women" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#8A7A6A', textDecoration: 'none' }}><ShoppingBag size={24} /></Link>
            
            <div style={{ position: 'relative' }}>
              <span onClick={() => setShowNotifications(!showNotifications)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#8A7A6A', position: 'relative' }}>
                <Bell size={24} />
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#dc2626', color: 'white', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '10px', fontWeight: 'bold' }}>1</span>
              </span>
              
              {showNotifications && (
                <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '12px', background: 'white', border: '1px solid #F1F5F9', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '320px', zIndex: 50 }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #F1F5F9', fontWeight: 600 }}>Notifications</div>
                  <div style={{ padding: '16px', borderBottom: '1px solid #F1F5F9', fontSize: '0.875rem', cursor: 'pointer' }}>
                    <div style={{ fontWeight: 600, color: '#1A1A2E' }}>Order Shipped</div>
                    <div style={{ color: '#9A8A7A', marginTop: '4px' }}>Your order #ORD-9821 has been shipped and is on its way!</div>
                  </div>
                  <div style={{ padding: '12px 16px', textAlign: 'center', color: '#B91C1C', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Mark as read</div>
                </div>
              )}
            </div>
            <div className="user-profile">
              <div className="profile-name">{user?.name || 'Customer'}</div>
              <div className="profile-email">{user?.email || 'customer@example.com'}</div>
            </div>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', textDecoration: 'none', fontWeight: 600, marginLeft: '16px', padding: '8px 16px', backgroundColor: '#FDE8E0', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        <div className="view-content" style={{ backgroundColor: '#FDF8F3' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
