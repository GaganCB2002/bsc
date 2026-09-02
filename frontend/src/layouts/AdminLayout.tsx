import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Tag, Package, ShoppingCart, 
  Users, Megaphone, LineChart, Settings, 
  Shield, HelpCircle, LogOut, Search, Bell, Menu, X, Ticket, Box
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Order #ORD-2841', text: 'Alexander Pierce placed an order for ₹214.50' },
    { id: 2, title: 'Low Stock Alert', text: 'Oxford Cotton Shirt is running critically low.', isAlert: true }
  ]);
  const [unreadCount, setUnreadCount] = useState(2);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin Portal - BSC Exclusive';
    
    const interval = setInterval(() => {
      const liveEvents = [
        { id: Date.now(), title: 'New Visitor', text: 'A new member is viewing Kanchipuram Silks from Mumbai.' },
        { id: Date.now() + 1, title: 'New User Registered', text: 'Priya S. just created an account.' },
        { id: Date.now() + 2, title: 'Live Activity', text: '3 users added items to their wishlist in the last minute.' }
      ];
      const randomEvent = liveEvents[Math.floor(Math.random() * liveEvents.length)];
      setNotifications(prev => [randomEvent, ...prev].slice(0, 6));
      setUnreadCount(prev => prev + 1);
    }, 12000);
    return () => clearInterval(interval);
  }, [navigate]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) setUnreadCount(0);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-app">
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="admin-brand" style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
          {!sidebarCollapsed && (
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                <img src="/bsc-logo.png" alt="BSC Exclusive" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Link>
          )}
          {sidebarCollapsed && (
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                <img src="/bsc-logo.png" alt="BSC" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Link>
          )}
        </div>
        
        <div className="admin-nav-menu">
          <NavLink to="/admin/overview" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} title="Dashboard">
            <span className="nav-icon"><LayoutDashboard size={20} /></span>
            {!sidebarCollapsed && <span>Dashboard</span>}
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} title="Products">
            <span className="nav-icon"><Box size={20} /></span>
            {!sidebarCollapsed && <span>Products</span>}
          </NavLink>
          <NavLink to="/admin/catalog" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} title="Catalog">
            <span className="nav-icon"><Tag size={20} /></span>
            {!sidebarCollapsed && <span>Catalog</span>}
          </NavLink>
          <NavLink to="/admin/inventory" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} title="Inventory">
            <span className="nav-icon"><Package size={20} /></span>
            {!sidebarCollapsed && <span>Inventory</span>}
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} title="Orders">
            <span className="nav-icon"><ShoppingCart size={20} /></span>
            {!sidebarCollapsed && <span>Orders</span>}
          </NavLink>
          <NavLink to="/admin/customers" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} title="Customers">
            <span className="nav-icon"><Users size={20} /></span>
            {!sidebarCollapsed && <span>Customers</span>}
          </NavLink>
          <NavLink to="/admin/marketing" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} title="Marketing">
            <span className="nav-icon"><Megaphone size={20} /></span>
            {!sidebarCollapsed && <span>Marketing</span>}
          </NavLink>
          <NavLink to="/admin/coupons" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} title="Coupons & Offers">
            <span className="nav-icon"><Ticket size={20} /></span>
            {!sidebarCollapsed && <span>Coupons & Offers</span>}
          </NavLink>
          <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} title="Analytics">
            <span className="nav-icon"><LineChart size={20} /></span>
            {!sidebarCollapsed && <span>Analytics</span>}
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} title="Settings">
            <span className="nav-icon"><Settings size={20} /></span>
            {!sidebarCollapsed && <span>Settings</span>}
          </NavLink>
          <NavLink to="/admin/roles" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'} title="User Roles">
            <span className="nav-icon"><Shield size={20} /></span>
            {!sidebarCollapsed && <span>User Roles</span>}
          </NavLink>
        </div>
        
        <div className="admin-nav-bottom">
          {!sidebarCollapsed && (
            <Link to="/admin/products/new" className="btn-new-product" style={{ display: 'block', textDecoration: 'none' }}>+ New Product</Link>
          )}
          {sidebarCollapsed && (
            <Link to="/admin/products/new" className="btn-new-product" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '10px' }} title="New Product">
              + 
            </Link>
          )}
          <div className="admin-nav-item" title="Help Center"><span className="nav-icon"><HelpCircle size={20} /></span>{!sidebarCollapsed && <span>Help Center</span>}</div>
          <div onClick={handleLogout} className="admin-nav-item" style={{ cursor: 'pointer' }} title="Logout"><span className="nav-icon"><LogOut size={20} /></span>{!sidebarCollapsed && <span>Logout</span>}</div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748B', padding: '8px', borderRadius: '8px' }}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
            <div className="search-bar">
              <span style={{ display: 'flex', alignItems: 'center', color: '#94A3B8' }}><Search size={20} /></span>
              <input type="text" placeholder="Search orders, products, customers..." />
            </div>
          </div>
          <div className="header-actions">
            <div style={{ position: 'relative' }}>
              <span onClick={toggleNotifications} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748B', position: 'relative' }}>
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#B91C1C', color: 'white', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '10px', fontWeight: 'bold' }}>{unreadCount}</span>
                )}
              </span>
              
              {showNotifications && (
                <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '12px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '320px', zIndex: 50 }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', fontWeight: 600 }}>Live Notifications</div>
                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {notifications.map(notif => (
                      <div key={notif.id} style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', fontSize: '0.875rem', cursor: 'pointer', animation: 'fadeIn 0.3s ease-in' }}>
                        <div style={{ fontWeight: 600, color: '#1E293B' }}>{notif.title}</div>
                        <div style={{ color: notif.isAlert ? '#B91C1C' : '#64748B', marginTop: '4px' }}>{notif.text}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '12px 16px', textAlign: 'center', color: '#B91C1C', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => setShowNotifications(false)}>Close</div>
                </div>
              )}
            </div>
            
            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748B' }}><HelpCircle size={24} /></span>
            <div className="user-profile">
              <div className="avatar" style={{ backgroundColor: '#E2E8F0', color: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{user?.name?.[0] || 'A'}</div>
              {user?.name || 'Admin'}
            </div>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B91C1C', textDecoration: 'none', fontWeight: 600, marginLeft: '16px', padding: '8px 16px', backgroundColor: '#FEE2E2', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        <div className="view-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
