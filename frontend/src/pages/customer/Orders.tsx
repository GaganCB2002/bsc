import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, ChevronDown, ChevronUp, Truck, CheckCircle, Clock, XCircle, MapPin } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  paymentId: string;
  date: string;
  status: string;
  payment: string;
  total: string;
  items: OrderItem[];
  address: string;
  tracking?: string;
}

const ORDERS: Order[] = [
  {
    paymentId: 'BSC-M1K8X2-A7B3C', date: 'Sep 1, 2026', status: 'Delivered', payment: 'Paid', total: '₹4,599',
    address: '123 Main St, Davangere, Karnataka 577001',
    tracking: 'DELivered',
    items: [
      { id: '1', name: 'Kanchipuram Pure Silk Saree', size: 'Free Size', price: 4599, quantity: 1, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&h=100&fit=crop' },
    ],
  },
  {
    paymentId: 'BSC-L2J9Y3-D4E5F', date: 'Aug 28, 2026', status: 'Shipped', payment: 'Paid', total: '₹2,899',
    address: '456 Gandhi Rd, Belgaum, Karnataka 590001',
    tracking: 'IN-transit',
    items: [
      { id: '2', name: 'Banarasi Silk Dupatta', size: '2.5m', price: 2899, quantity: 1, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100&h=100&fit=crop' },
    ],
  },
  {
    paymentId: 'BSC-K3H7Z1-G6H8I', date: 'Aug 20, 2026', status: 'Processing', payment: 'Paid', total: '₹6,299',
    address: '789 MG Road, Shivamogga, Karnataka 577201',
    items: [
      { id: '3', name: 'Mysore Pure Silk Saree', size: 'Free Size', price: 6299, quantity: 1, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop' },
    ],
  },
  {
    paymentId: 'BSC-J4G6W5-M8N0P', date: 'Aug 15, 2026', status: 'Delivered', payment: 'Paid', total: '₹3,499',
    address: '123 Main St, Davangere, Karnataka 577001',
    items: [
      { id: '4', name: 'Tussar Silk Stole', size: '1.8m', price: 3499, quantity: 1, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&h=100&fit=crop' },
    ],
  },
];

export default function CustomerOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => { document.title = 'Order History - BSC Exclusive'; }, []);

  const filtered = ORDERS.filter(o => {
    const matchSearch = o.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) || o.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = filterStatus === 'all' || o.status.toLowerCase() === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusIcon = (s: string) => {
    if (s === 'Delivered') return <CheckCircle size={14} color="#16a34a" />;
    if (s === 'Shipped') return <Truck size={14} color="#3b82f6" />;
    if (s === 'Processing') return <Clock size={14} color="#f59e0b" />;
    if (s === 'Cancelled') return <XCircle size={14} color="#ef4444" />;
    return <Package size={14} />;
  };

  const statusColor = (s: string) => {
    if (s === 'Delivered') return { bg: '#DCFCE7', color: '#166534' };
    if (s === 'Shipped') return { bg: '#DBEAFE', color: '#1E40AF' };
    if (s === 'Processing') return { bg: '#FEF3C7', color: '#92400E' };
    if (s === 'Cancelled') return { bg: '#FEE2E2', color: '#991B1B' };
    return { bg: '#F1F5F9', color: '#64748B' };
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <span style={{ display: 'inline-block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B91C1C', border: '1px solid rgba(185,28,28,0.3)', padding: '3px 12px', marginBottom: '8px' }}>Orders</span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 300, color: '#1A1A1A' }}>Order <span style={{ fontWeight: 700, color: '#B91C1C' }}>History</span></h1>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 14px', gap: '8px' }}>
          <Search size={18} color="#94A3B8" />
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by order ID or product..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.85rem', background: 'transparent' }} />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem', background: '#fff', cursor: 'pointer' }}>
          <option value="all">All Status</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', border: '1px solid #F0EBE5', borderRadius: '12px' }}>
          <Package size={48} style={{ color: '#ddd', margin: '0 auto 12px' }} />
          <p style={{ color: '#999', marginBottom: '16px' }}>No orders found</p>
          <Link to="/category/new-arrivals" style={{ display: 'inline-block', padding: '10px 24px', background: '#B91C1C', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((order) => {
            const sc = statusColor(order.status);
            const isExpanded = expandedOrder === order.paymentId;
            return (
              <div key={order.paymentId} style={{ background: '#fff', border: '1px solid #F0EBE5', borderRadius: '12px', overflow: 'hidden' }}>
                <div
                  onClick={() => setExpandedOrder(isExpanded ? null : order.paymentId)}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', cursor: 'pointer' }}
                >
                  <img src={order.items[0].image} alt="" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1A1A1A' }}>{order.items[0].name}{order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}</div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#6B6B6B', marginTop: '4px' }}>
                      <span style={{ fontFamily: 'monospace' }}>{order.paymentId}</span>
                      <span>{order.date}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#1A1A1A' }}>{order.total}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '4px' }}>
                      {statusIcon(order.status)}
                      <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 600, background: sc.bg, color: sc.color }}>{order.status}</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={18} color="#999" /> : <ChevronDown size={18} color="#999" />}
                </div>

                {isExpanded && (
                  <div style={{ borderTop: '1px solid #F0EBE5', padding: '20px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items Ordered</h4>
                      {order.items.map(item => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #F8FAFC' }}>
                          <img src={item.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Size: {item.size} · Qty: {item.quantity}</div>
                          </div>
                          <div style={{ fontWeight: 600 }}>₹{item.price.toLocaleString('en-IN')}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Delivery Address</div>
                        <div style={{ fontSize: '0.8rem', color: '#1A1A2E', display: 'flex', alignItems: 'flex-start', gap: '6px' }}><MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} />{order.address}</div>
                      </div>
                      <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Payment</div>
                        <div style={{ fontSize: '0.8rem', color: '#1A1A2E' }}>Method: UPI · Status: <span style={{ color: order.payment === 'Paid' ? '#16a34a' : '#ef4444', fontWeight: 600 }}>{order.payment}</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}