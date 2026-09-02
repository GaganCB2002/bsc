import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Package, Heart, MapPin, Settings, ShoppingBag, ChevronRight, CreditCard, Truck, Clock } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  status: string;
  amount: string;
  items: string;
  image: string;
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const [orders] = useState<Order[]>([
    { id: 'BSC-M1K8X2-A7B3C', date: 'Sep 1, 2026', status: 'Delivered', amount: '₹4,599', items: 'Kanchipuram Silk Saree', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&h=100&fit=crop' },
    { id: 'BSC-L2J9Y3-D4E5F', date: 'Aug 28, 2026', status: 'Shipped', amount: '₹2,899', items: 'Banarasi Silk Dupatta', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100&h=100&fit=crop' },
    { id: 'BSC-K3H7Z1-G6H8I', date: 'Aug 20, 2026', status: 'Processing', amount: '₹6,299', items: 'Mysore Silk Saree', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop' },
  ]);

  useEffect(() => { document.title = 'My Account - BSC Exclusive'; }, []);

  const firstName = (user?.name || 'Customer').split(' ')[0];

  const stats = [
    { icon: <Package size={22} />, label: 'Total Orders', value: orders.length.toString(), color: '#3b82f6', link: '/dashboard/orders' },
    { icon: <Heart size={22} />, label: 'Wishlist', value: 'View', color: '#B91C1C', link: '/dashboard/wishlist' },
    { icon: <MapPin size={22} />, label: 'Addresses', value: 'Manage', color: '#16a34a', link: '/dashboard/addresses' },
    { icon: <Settings size={22} />, label: 'Settings', value: 'Edit', color: '#1E3A8A', link: '/dashboard/settings' },
  ];

  const statusColor = (s: string) => {
    if (s === 'Delivered') return { bg: '#DCFCE7', color: '#166534' };
    if (s === 'Shipped') return { bg: '#DBEAFE', color: '#1E40AF' };
    if (s === 'Processing') return { bg: '#FEF3C7', color: '#92400E' };
    return { bg: '#F1F5F9', color: '#64748B' };
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <span style={{ display: 'inline-block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B91C1C', border: '1px solid rgba(185,28,28,0.3)', padding: '3px 12px', marginBottom: '8px' }}>My Account</span>
        <h1 style={{ fontSize: '2rem', fontWeight: 300, color: '#1A1A1A', marginBottom: '4px' }}>Welcome back, <span style={{ fontWeight: 700, color: '#B91C1C' }}>{firstName}</span></h1>
        <p style={{ fontSize: '0.85rem', color: '#6B6B6B' }}>Manage your orders, wishlist, and account settings</p>
      </div>

      {/* Profile Card */}
      <div style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', borderRadius: '16px', padding: '28px', color: '#fff', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #B91C1C, #991B1B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 }}>
          {user?.name?.[0] || 'C'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>{user?.name || 'Customer'}</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{user?.email || 'customer@bscexclusive.com'}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '4px' }}>{user?.phone || '+91 XXXXX XXXXX'} · {user?.location || 'India'}</div>
        </div>
        <Link to="/dashboard/settings" style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>Edit Profile</Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map((s, i) => (
          <Link key={i} to={s.link} style={{ background: '#fff', border: '1px solid #F0EBE5', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', color: 'inherit', borderRadius: '10px', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1A1A1A' }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', color: '#8A7A6A', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '32px' }}>
        <Link to="/category/new-arrivals" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#B91C1C', color: '#fff', padding: '14px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
          <ShoppingBag size={18} /> Continue Shopping
        </Link>
        <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', border: '1px solid #E2E8F0', color: '#1A1A2E', padding: '14px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
          <CreditCard size={18} /> View Cart ({totalItems})
        </Link>
        <Link to="/dashboard/orders" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', border: '1px solid #E2E8F0', color: '#1A1A2E', padding: '14px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
          <Truck size={18} /> Track Orders
        </Link>
      </div>

      {/* Recent Orders */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1A1A2E' }}>Recent Orders</h2>
          <Link to="/dashboard/orders" style={{ color: '#B91C1C', fontSize: '0.8rem', fontWeight: 600 }}>View All →</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.map((order) => {
            const sc = statusColor(order.status);
            return (
              <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#fff', border: '1px solid #F0EBE5', padding: '16px 20px', borderRadius: '10px' }}>
                <img src={order.image} alt="" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1A1A1A' }}>{order.items}</div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#6B6B6B', marginTop: '4px' }}>
                    <span style={{ fontFamily: 'monospace' }}>{order.id}</span>
                    <span>{order.date}</span>
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: '#1A1A1A', fontSize: '0.95rem' }}>{order.amount}</div>
                <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, background: sc.bg, color: sc.color }}>{order.status}</span>
                <ChevronRight size={18} color="#ccc" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Shop Banner */}
      <div style={{ background: 'linear-gradient(135deg, #B91C1C, #991B1B)', borderRadius: '14px', padding: '28px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>New Collection Arrived</h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Explore the latest silk sarees and ethnic wear</p>
        </div>
        <Link to="/category/new-arrivals" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', color: '#B91C1C', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
          Shop Now <ChevronRight size={16} />
        </Link>
      </div>

      {/* Help */}
      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#fff', border: '1px solid #F0EBE5', padding: '20px', borderRadius: '10px' }}>
          <Clock size={20} color="#1E3A8A" style={{ marginBottom: '8px' }} />
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '4px' }}>Order Support</h4>
          <p style={{ fontSize: '0.8rem', color: '#6B6B6B' }}>Need help with an order? Contact us at +91 8192 272180</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #F0EBE5', padding: '20px', borderRadius: '10px' }}>
          <Truck size={20} color="#16a34a" style={{ marginBottom: '8px' }} />
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '4px' }}>Free Shipping</h4>
          <p style={{ fontSize: '0.8rem', color: '#6B6B6B' }}>Free delivery on orders above ₹5,000 across India</p>
        </div>
      </div>
    </div>
  );
}