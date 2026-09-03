import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, XCircle, MapPin, Copy, Check, ArrowLeft, CreditCard, Calendar, Hash, Printer, AlertCircle } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { normalizeError } from '../../services/api';
import { showToast } from '../../components/Toast';
// TODO(integration): replace this with `import { orderService } from '../../services/orderService'`
// and call `orderService.getById(id)` when the order backend is implemented.
// For now we render an explicit empty state so users aren't shown fake data.

interface OrderItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface Order {
  paymentId: string;
  date: string;
  status: string;
  payment: string;
  paymentMethod: string;
  total: string;
  subtotal: string;
  shipping: string;
  discount: string;
  couponCode: string;
  items: OrderItem[];
  address: {
    name: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  tracking?: string;
  estimatedDelivery: string;
}

export default function OrderDetails() {
  const { formatPrice } = useCurrency();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // TODO(integration): replace with `orderService.getById(id)`.
    // The previous version rendered hardcoded demo data which leaked across users
    // and is being phased out. Until the order backend is wired up, we render an
    // explicit "not available" state.
    setOrder(null);
    setLoading(false);
    return () => {
      // Cancel any pending copy-feedback so it cannot fire setState after unmount.
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, [id, isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
        Loading order…
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <AlertCircle size={48} color="#f59e0b" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '1.3rem', color: '#1E293B', marginBottom: '8px' }}>Order details unavailable</h2>
        <p style={{ color: '#64748B', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
          The order lookup is not connected to a live backend yet. Once the orders API is implemented, your order history will appear here.
        </p>
        <Link to="/dashboard/orders" style={{ padding: '12px 24px', background: '#B91C1C', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Back to Orders</Link>
      </div>
    );
  }

  const copyToClipboard = (text: string, field: string) => {
    if (!navigator.clipboard) {
      showToast('error', 'Clipboard not available in this browser');
      return;
    }
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(field);
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = setTimeout(() => setCopied(''), 2000);
      },
      (err) => {
        // Clipboard write can fail in non-secure contexts. Surface the error.
        const { message } = normalizeError(err);
        showToast('error', `Could not copy: ${message}`);
      },
    );
  };

  const statusIcon = (s: string) => {
    if (s === 'Delivered') return <CheckCircle size={18} color="#16a34a" />;
    if (s === 'Shipped') return <Truck size={18} color="#3b82f6" />;
    if (s === 'Processing') return <Clock size={18} color="#f59e0b" />;
    if (s === 'Cancelled') return <XCircle size={18} color="#ef4444" />;
    return <Package size={18} />;
  };

  const statusColor = (s: string) => {
    if (s === 'Delivered') return { bg: '#DCFCE7', color: '#166534', border: '#86EFAC' };
    if (s === 'Shipped') return { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD' };
    if (s === 'Processing') return { bg: '#FEF3C7', color: '#92400E', border: '#FCD34D' };
    if (s === 'Cancelled') return { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5' };
    return { bg: '#F1F5F9', color: '#64748B', border: '#CBD5E1' };
  };

  const sc = statusColor(order.status);

  const timelineSteps = [
    { label: 'Order Placed', desc: 'Your order has been confirmed', done: true, icon: <CheckCircle size={16} /> },
    { label: 'Processing', desc: 'We are preparing your order', done: order.status !== 'Processing', icon: <Package size={16} /> },
    { label: 'Shipped', desc: 'Your order is on the way', done: order.status === 'Delivered' || order.status === 'Shipped', icon: <Truck size={16} /> },
    { label: 'Delivered', desc: 'Order delivered successfully', done: order.status === 'Delivered', icon: <CheckCircle size={16} /> },
  ];

  return (
    <div>
      <button onClick={() => navigate('/dashboard/orders')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: '0.85rem', marginBottom: '20px', fontFamily: 'inherit', padding: 0 }}>
        <ArrowLeft size={16} /> Back to Orders
      </button>

      {/* Order Header */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`, padding: '4px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {statusIcon(order.status)} {order.status}
              </span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 400, color: '#1E293B', margin: '0 0 8px' }}>Order <span style={{ fontWeight: 700, color: '#B91C1C' }}>#{order.paymentId}</span></h1>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.8rem', color: '#64748B' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {order.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Hash size={14} /> {order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, color: '#64748B', fontFamily: 'inherit' }}>
              <Printer size={14} /> Print
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        <div>
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '20px' }}>Order Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {timelineSteps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: step.done ? '#16a34a' : '#E2E8F0', color: step.done ? '#fff' : '#94A3B8', flexShrink: 0, zIndex: 1
                    }}>
                      {step.icon}
                    </div>
                    {i < timelineSteps.length - 1 && (
                      <div style={{ width: '2px', height: '32px', background: step.done ? '#16a34a' : '#E2E8F0' }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: '24px' }}>
                    <div style={{ fontWeight: step.done ? 600 : 400, fontSize: '0.9rem', color: step.done ? '#1E293B' : '#94A3B8' }}>{step.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '16px' }}>Items Ordered</h3>
            {order.items.map(item => (
              <Link key={item.id} to={`/product/${item.id}`} style={{ display: 'flex', gap: '16px', padding: '16px', background: '#F8FAFC', borderRadius: '12px', marginBottom: '10px', textDecoration: 'none', border: '1px solid #F1F5F9', transition: 'all 0.2s' }}>
                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', marginBottom: '4px' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '4px' }}>Category: {item.category}</div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#64748B' }}>
                    <span>Size: <strong>{item.size}</strong></span>
                    <span>Qty: <strong>{item.quantity}</strong></span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#B91C1C' }}>{formatPrice(item.price)}</div>
                  {item.quantity > 1 && <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{formatPrice((item.price / item.quantity))} each</div>}
                </div>
              </Link>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#B91C1C" /> Delivery Address
            </h3>
            <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #F1F5F9' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1E293B', marginBottom: '4px' }}>{order.address.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.7 }}>
                {order.address.line1}<br />
                {order.address.city}, {order.address.state} - {order.address.pincode}<br />
                Phone: {order.address.phone}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={18} color="#B91C1C" /> Payment Summary
            </h3>

            <div style={{ padding: '14px', background: '#F0FDF4', borderRadius: '10px', marginBottom: '16px', border: '1px solid #BBF7D0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Payment ID</span>
                <button onClick={() => copyToClipboard(order.paymentId, 'pid')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === 'pid' ? '#16a34a' : '#94A3B8', padding: 0 }}>
                  {copied === 'pid' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1E293B', fontSize: '0.9rem' }}>{order.paymentId}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748B' }}>Subtotal</span>
                <span style={{ color: '#1E293B', fontWeight: 500 }}>{order.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748B' }}>Shipping</span>
                <span style={{ color: order.shipping === 'Free' ? '#16a34a' : '#1E293B', fontWeight: 500 }}>{order.shipping}</span>
              </div>
              {order.discount !== '₹0' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#16a34a' }}>Discount {order.couponCode && `(${order.couponCode})`}</span>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>-{order.discount}</span>
                </div>
              )}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                <span style={{ color: '#1E293B' }}>Total</span>
                <span style={{ color: '#B91C1C' }}>{order.total}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                <span style={{ color: '#64748B' }}>Payment Method</span>
                <span style={{ color: '#1E293B', fontWeight: 600 }}>{order.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                <span style={{ color: '#64748B' }}>Payment Status</span>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>{order.payment}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: '#64748B' }}>Estimated Delivery</span>
                <span style={{ color: '#1E293B', fontWeight: 600 }}>{order.estimatedDelivery}</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>Need Help?</h4>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '12px' }}>Contact us for any queries about this order.</p>
            <Link to="/customer-service" style={{ display: 'inline-block', padding: '10px 24px', background: '#B91C1C', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem' }}>
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

