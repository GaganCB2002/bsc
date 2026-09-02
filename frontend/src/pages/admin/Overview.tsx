import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, ShoppingCart, Users, Tag, Plus, ArrowRight } from 'lucide-react';

export default function Overview() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Admin Dashboard - BSC Exclusive';
  }, []);

  const firstName = (user?.name || 'Admin').split(' ')[0];

  const quickActions = [
    { label: 'Add Product', desc: 'Create a new product listing', icon: <Package size={20} />, link: '/admin/products' },
    { label: 'Manage Orders', desc: 'View and process orders', icon: <ShoppingCart size={20} />, link: '/admin/orders' },
    { label: 'View Customers', desc: 'Browse customer accounts', icon: <Users size={20} />, link: '/admin/customers' },
    { label: 'Create Coupon', desc: 'Launch a new promotion', icon: <Tag size={20} />, link: '/admin/coupons' },
  ];

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <span style={{ display: 'inline-block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B91C1C', border: '1px solid rgba(185,28,28,0.3)', padding: '3px 12px', marginBottom: '8px' }}>Admin Dashboard</span>
        <h1 style={{ fontSize: '2rem', fontWeight: 300, color: '#1A1A1A', marginBottom: '4px' }}>Welcome back, <span style={{ fontWeight: 700, color: '#B91C1C' }}>{firstName}</span></h1>
        <p style={{ fontSize: '0.85rem', color: '#6B6B6B' }}>Manage your store, products, and customers from here</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        {[
          { icon: <Package size={22} />, label: 'Products', value: '24', color: '#3b82f6', link: '/admin/products' },
          { icon: <ShoppingCart size={22} />, label: 'Orders', value: '12', color: '#B91C1C', link: '/admin/orders' },
          { icon: <Users size={22} />, label: 'Customers', value: '156', color: '#16a34a', link: '/admin/customers' },
          { icon: <Tag size={22} />, label: 'Coupons', value: '3', color: '#1E3A8A', link: '/admin/coupons' },
        ].map((s, i) => (
          <Link key={i} to={s.link} style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'inherit', borderRadius: '8px', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A1A' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#8A7A6A', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '16px' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {quickActions.map((action, i) => (
            <Link key={i} to={action.link} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#fff', border: '1px solid #E2E8F0', padding: '20px', textDecoration: 'none', color: 'inherit', borderRadius: '8px', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#B91C1C'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E2E8F0'; }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B91C1C' }}>
                {action.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1A1A1A', marginBottom: '2px' }}>{action.label}</div>
                <div style={{ fontSize: '0.8rem', color: '#6B6B6B' }}>{action.desc}</div>
              </div>
              <ArrowRight size={18} color="#ccc" />
            </Link>
          ))}
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', borderRadius: '16px', padding: '32px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Manage Your Store</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Access products, orders, customers, and analytics from the sidebar</p>
          </div>
          <Link to="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#B91C1C', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
            <Plus size={18} /> Add Product
          </Link>
        </div>
      </div>
    </>
  );
}