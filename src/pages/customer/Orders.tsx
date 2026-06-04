import { useEffect, useState } from 'react';
import { Package, ChevronRight, Clock } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  total: number;
  items: number;
}

const mockOrders: Order[] = [
  { id: 'ORD-2026-001', date: '2026-05-28', status: 'delivered', total: 12499, items: 2 },
  { id: 'ORD-2026-002', date: '2026-05-15', status: 'shipped', total: 8500, items: 1 },
  { id: 'ORD-2026-003', date: '2026-04-20', status: 'processing', total: 22999, items: 3 },
  { id: 'ORD-2026-004', date: '2026-03-10', status: 'delivered', total: 5500, items: 1 },
  { id: 'ORD-2026-005', date: '2026-02-05', status: 'cancelled', total: 18750, items: 2 },
];

const statusColors: Record<string, string> = {
  delivered: '#2E7D32',
  shipped: '#1565C0',
  processing: '#E65100',
  cancelled: '#C62828',
};

export default function Orders() {
  const [orders] = useState<Order[]>(mockOrders);

  useEffect(() => {
    document.title = 'Order History - BS Channabasappa';
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <span style={{
          display: 'inline-block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)',
          padding: '3px 12px', marginBottom: '8px'
        }}>My Account</span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 300, color: '#1A1A1A' }}>Order <span style={{ fontWeight: 700, color: '#A05252' }}>History</span></h1>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', border: '1px solid #F0EBE5' }}>
          <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.2, color: '#A05252' }} />
          <p style={{ fontSize: '1rem', color: '#6B6B6B', marginBottom: '8px' }}>No orders yet</p>
          <p style={{ fontSize: '0.85rem', color: '#999' }}>Start shopping to see your orders here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.map(order => (
            <div key={order.id} style={{
              display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 24px',
              background: '#fff', border: '1px solid #F0EBE5', transition: 'all 0.2s',
              cursor: 'pointer', flexWrap: 'wrap'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#D4C5B5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#F0EBE5'; }}
            >
              <div style={{
                width: '48px', height: '48px', background: '#F5F0EB', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Package size={20} color="#A05252" />
              </div>
              <div style={{ flex: '1', minWidth: '120px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A1A1A' }}>{order.id}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#999', marginTop: '4px' }}>
                  <Clock size={12} /> {new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              <div style={{ textAlign: 'center', minWidth: '80px' }}>
                <div style={{
                  display: 'inline-block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.05em', padding: '3px 10px',
                  color: statusColors[order.status], background: `${statusColors[order.status]}15`
                }}>
                  {order.status}
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#A05252' }}>₹{order.total.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '0.72rem', color: '#999' }}>{order.items} item{order.items > 1 ? 's' : ''}</div>
              </div>
              <ChevronRight size={16} color="#ccc" style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
