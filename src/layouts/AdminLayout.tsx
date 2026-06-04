import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Tag, Package, ShoppingCart, 
  Users, Megaphone, LineChart, Settings, 
  Shield, HelpCircle, LogOut, Search, Bell 
} from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Order #ORD-2841', text: 'Alexander Pierce placed an order for ₹214.50' },
    { id: 2, title: 'Low Stock Alert', text: 'Oxford Cotton Shirt is running critically low.', isAlert: true }
  ]);
  const [unreadCount, setUnreadCount] = useState(2);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('role') !== 'admin') {
      navigate('/login');
      return;
    }
    
    const interval = setInterval(() => {
      const liveEvents = [
        { id: Date.now(), title: 'New Visitor', text: 'A new member is viewing Kanchipuram Silks from Mumbai.' },
        { id: Date.now() + 1, title: 'New User Registered', text: 'Priya S. just created an account.' },
        { id: Date.now() + 2, title: 'Live Activity', text: '3 users added items to their wishlist in the last minute.' }
      ];
      const randomEvent = liveEvents[Math.floor(Math.random() * liveEvents.length)];
      setNotifications(prev => [randomEvent, ...prev].slice(0, 6));
      setUnreadCount(prev => prev + 1);
    }, 12000); // New live notification every 12 seconds
    return () => clearInterval(interval);
  }, [navigate]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) setUnreadCount(0);
  };
  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand" style={{ gap: '10px' }}>
          <img src="/brand-logo.png" alt="BS Channabasappa" style={{ height: '36px', width: '36px', borderRadius: '50%', objectFit: 'cover', marginRight: '12px' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#D4A574', lineHeight: 1 }}>B<span style={{ color: '#fff' }}>S</span></span>
          <div>
            <div className="admin-brand-text" style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.2 }}>Channabasappa</div>
            <div className="admin-brand-sub" style={{ color: '#D4A574', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Portal</div>
          </div>
        </Link>
        
        <div className="admin-nav-menu">
          <NavLink to="/admin/overview" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <span className="nav-icon"><LayoutDashboard size={20} /></span> Dashboard
          </NavLink>
          <NavLink to="/admin/catalog" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <span className="nav-icon"><Tag size={20} /></span> Catalog
          </NavLink>
          <NavLink to="/admin/inventory" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <span className="nav-icon"><Package size={20} /></span> Inventory
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <span className="nav-icon"><ShoppingCart size={20} /></span> Orders
          </NavLink>
          <NavLink to="/admin/customers" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <span className="nav-icon"><Users size={20} /></span> Customers
          </NavLink>
          <NavLink to="/admin/marketing" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <span className="nav-icon"><Megaphone size={20} /></span> Marketing
          </NavLink>
          <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <span className="nav-icon"><LineChart size={20} /></span> Analytics
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <span className="nav-icon"><Settings size={20} /></span> Settings
          </NavLink>
          <NavLink to="/admin/roles" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <span className="nav-icon"><Shield size={20} /></span> User Roles
          </NavLink>
        </div>
        
        <div className="admin-nav-bottom">
          <Link to="/admin/products/new" className="btn-new-product" style={{ display: 'block', textDecoration: 'none' }}>+ New Product</Link>
          <div className="admin-nav-item"><span className="nav-icon"><HelpCircle size={20} /></span> Help Center</div>
          <Link to="/" onClick={() => localStorage.removeItem('role')} className="admin-nav-item"><span className="nav-icon"><LogOut size={20} /></span> Logout</Link>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="search-bar">
            <span style={{ display: 'flex', alignItems: 'center', color: '#9A8A7A' }}><Search size={20} /></span>
            <input type="text" placeholder="Search orders, products, customers..." />
          </div>
          <div className="header-actions">
            <div style={{ position: 'relative' }}>
              <span onClick={toggleNotifications} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#8A7A6A', position: 'relative' }}>
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#dc2626', color: 'white', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '10px', fontWeight: 'bold' }}>{unreadCount}</span>
                )}
              </span>
              
              {showNotifications && (
                <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '12px', background: 'white', border: '1px solid #E8D6C0', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '320px', zIndex: 50 }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #E8D6C0', fontWeight: 600 }}>Live Notifications</div>
                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {notifications.map(notif => (
                      <div key={notif.id} style={{ padding: '16px', borderBottom: '1px solid #E8D6C0', fontSize: '0.875rem', cursor: 'pointer', animation: 'fadeIn 0.3s ease-in' }}>
                        <div style={{ fontWeight: 600, color: '#2C2826' }}>{notif.title}</div>
                        <div style={{ color: notif.isAlert ? '#dc2626' : '#9A8A7A', marginTop: '4px' }}>{notif.text}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '12px 16px', textAlign: 'center', color: '#C47A6A', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => setShowNotifications(false)}>Close</div>
                </div>
              )}
            </div>
            
            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#8A7A6A' }}><HelpCircle size={24} /></span>
            <div className="user-profile">
              <div className="avatar"></div>
              BSSC Admin
            </div>
            <Link to="/" onClick={() => localStorage.removeItem('role')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', textDecoration: 'none', fontWeight: 600, marginLeft: '16px', padding: '8px 16px', backgroundColor: '#FDE8E0', borderRadius: '8px' }}>
              <LogOut size={16} /> Logout
            </Link>
          </div>
        </header>

        <div className="view-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
