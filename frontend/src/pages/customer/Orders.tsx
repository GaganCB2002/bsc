import { useState, useEffect } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { Link } from 'react-router-dom';
import { Package, Search, ChevronDown, ChevronUp, Truck, CheckCircle, Clock, XCircle, MapPin, ExternalLink, AlertCircle } from 'lucide-react';

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

export default function CustomerOrders() {
  const { formatPrice } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  // TODO(integration): populate via `orderService.list()` once the orders backend
  // is implemented. Until then, render an explicit empty state.
  const [orders] = useState<Order[]>([]);
  const [loading] = useState(false);

  useEffect(() => { document.title = 'Order History - BSC Exclusive'; }, []);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.items.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
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

      {!loading && orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', border: '1px solid #F0EBE5', borderRadius: '12px' }}>
          <AlertCircle size={48} color="#f59e0b" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '1.2rem', color: '#1E293B', marginBottom: '8px' }}>Order history not connected</h2>
          <p style={{ color: '#64748B', marginBottom: '16px', maxWidth: '480px', margin: '0 auto 16px' }}>
            Your order history will appear here once the orders backend is implemented. Until then, this is a placeholder.
          </p>
          <Link to="/category/new-arrivals" style={{ display: 'inline-block', padding: '10px 24px', background: '#B91C1C', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>Start Shopping</Link>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', border: '1px solid #F0EBE5', borderRadius: '12px' }}>
          <Package size={48} style={{ color: '#ddd', margin: '0 auto 12px' }} />
          <p style={{ color: '#999', marginBottom: '16px' }}>No orders match your filters</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((order) => {
            const sc = statusColor(order.status);
            const isExpanded = expandedOrder === order.paymentId;
            const firstItem = order.items[0];
            if (!firstItem) return null;
            return (
              <div key={order.paymentId} style={{ background: '#fff', border: '1px solid #F0EBE5', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
                  <img src={firstItem.image} alt="" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1A1A1A' }}>{firstItem.name}{order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}</div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#6B6B6B', marginTop: '4px' }}>
                      <span style={{ fontFamily: 'monospace' }}>{order.paymentId}</span>
                      <span>{order.date}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1A1A1A' }}>{order.total}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '4px' }}>
                        {statusIcon(order.status)}
                        <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 600, background: sc.bg, color: sc.color }}>{order.status}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <Link
                        to={`/dashboard/orders/${order.paymentId}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px', background: '#B91C1C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
                      >
                        View Order <ExternalLink size={12} />
                      </Link>
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.paymentId)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 14px', background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.7rem', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
                      >
                        {isExpanded ? 'Less' : 'Quick View'} {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    </div>
                  </div>
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
                          <div style={{ fontWeight: 600 }}>{formatPrice(item.price)}</div>
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
                        <div style={{ fontSize: '0.8rem', color: '#1A1A2E' }}>Status: <span style={{ color: order.payment === 'Paid' ? '#16a34a' : '#ef4444', fontWeight: 600 }}>{order.payment}</span></div>
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

