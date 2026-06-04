import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  User, Package, Heart, MapPin, 
  Settings, LogOut, HelpCircle, 
  ShoppingBag, Search, Bell 
} from 'lucide-react';
import './AdminLayout.css'; // We can reuse the admin layout CSS structure since it's a dashboard

export default function CustomerLayout() {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('role') !== 'customer') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="admin-app">
      <aside className="admin-sidebar" style={{ backgroundColor: '#2C2826' }}>
        <Link to="/" className="admin-brand" style={{ gap: '10px' }}>
          <img src="/brand-logo.png" alt="BS Channabasappa" style={{ height: '36px', width: '36px', borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#D4A574', lineHeight: 1 }}>B<span style={{ color: '#fff' }}>S</span></span>
          <div>
            <div className="admin-brand-text" style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.2 }}>Channabasappa</div>
            <div className="admin-brand-sub" style={{ color: '#D4A574', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Customer Portal</div>
          </div>
        </Link>
        
        <div className="admin-nav-menu">
          <NavLink to="/customer/dashboard" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <span className="nav-icon"><User size={20} /></span> My Account
          </NavLink>
          <NavLink to="/customer/orders" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <span className="nav-icon"><Package size={20} /></span> Order History
          </NavLink>
          <NavLink to="/customer/wishlist" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <span className="nav-icon"><Heart size={20} /></span> Wishlist
          </NavLink>
          <NavLink to="/customer/addresses" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <span className="nav-icon"><MapPin size={20} /></span> Saved Addresses
          </NavLink>
          <NavLink to="/customer/settings" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <span className="nav-icon"><Settings size={20} /></span> Account Settings
          </NavLink>
        </div>
        
        <div className="admin-nav-bottom">
          <Link to="/category/new-arrivals" className="btn-new-product" style={{ display: 'block', textDecoration: 'none', backgroundColor: '#fff', color: '#2C2826' }}>Shop New Arrivals</Link>
          <div className="admin-nav-item"><span className="nav-icon"><HelpCircle size={20} /></span> Contact Support</div>
          <Link to="/" onClick={() => localStorage.removeItem('role')} className="admin-nav-item" style={{ color: '#FDE0D0' }}><span className="nav-icon"><LogOut size={20} /></span> Sign Out</Link>
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
                <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '12px', background: 'white', border: '1px solid #E8D6C0', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '320px', zIndex: 50 }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #E8D6C0', fontWeight: 600 }}>Notifications</div>
                  <div style={{ padding: '16px', borderBottom: '1px solid #E8D6C0', fontSize: '0.875rem', cursor: 'pointer' }}>
                    <div style={{ fontWeight: 600, color: '#2C2826' }}>Order Shipped</div>
                    <div style={{ color: '#9A8A7A', marginTop: '4px' }}>Your order #ORD-9821 has been shipped and is on its way!</div>
                  </div>
                  <div style={{ padding: '12px 16px', textAlign: 'center', color: '#C47A6A', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Mark as read</div>
                </div>
              )}
            </div>
            <div className="user-profile">
              <div className="avatar" style={{ backgroundColor: '#E8D6C0', color: '#2C2826', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>A</div>
              Alexander
            </div>
            <Link to="/" onClick={() => localStorage.removeItem('role')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', textDecoration: 'none', fontWeight: 600, marginLeft: '16px', padding: '8px 16px', backgroundColor: '#FDE8E0', borderRadius: '8px' }}>
              <LogOut size={16} /> Logout
            </Link>
          </div>
        </header>

        <div className="view-content" style={{ backgroundColor: '#FDF8F3' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
