import { useEffect, useState } from 'react';
import { ShoppingCart, Search, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    document.title = 'Orders - BSC Exclusive Admin';
  }, []);

  const orders = [
    { id: '#ORD-9821', customer: 'Anjali Sharma', date: 'Sep 1, 2026', total: 4599.00, items: 1, payment: 'Paid', status: 'Delivered' },
    { id: '#ORD-9822', customer: 'Rahul Verma', date: 'Sep 2, 2026', total: 18500.00, items: 2, payment: 'Paid', status: 'Processing' },
    { id: '#ORD-9823', customer: 'Priya Iyer', date: 'Sep 2, 2026', total: 12999.00, items: 1, payment: 'Pending', status: 'Pending' },
    { id: '#ORD-9824', customer: 'Vikram Singh', date: 'Sep 3, 2026', total: 8999.00, items: 1, payment: 'Paid', status: 'Shipped' },
    { id: '#ORD-9825', customer: 'Neha Gupta', date: 'Sep 3, 2026', total: 25000.00, items: 3, payment: 'Paid', status: 'Processing' },
    { id: '#ORD-9826', customer: 'Arjun Das', date: 'Sep 4, 2026', total: 3499.00, items: 1, payment: 'Failed', status: 'Cancelled' },
  ];

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || o.status.toLowerCase() === filterStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Orders Management</h1>
          <p>Track, manage, and process customer orders.</p>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-header">Total Orders</div>
          <div className="stat-value">{orders.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Processing</div>
          <div className="stat-value" style={{ color: '#D97706' }}>{orders.filter(o => o.status === 'Processing').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Delivered</div>
          <div className="stat-value" style={{ color: '#16a34a' }}>{orders.filter(o => o.status === 'Delivered').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Total Revenue</div>
          <div className="stat-value" style={{ color: '#1E3A8A' }}>₹{orders.reduce((acc, o) => acc + (o.status !== 'Cancelled' ? o.total : 0), 0).toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShoppingCart size={20} /> All Orders ({filtered.length})</span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#F1F5F9', borderRadius: '8px', padding: '0 12px' }}>
              <Search size={16} color="#94A3B8" />
              <input type="text" placeholder="Search orders..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ border: 'none', background: 'transparent', padding: '8px', fontSize: '0.85rem', outline: 'none', width: '200px' }} />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem' }}>
              <option value="all">All Status</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <table style={{ marginTop: '16px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Order ID</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Customer</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Date</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', textAlign: 'right' }}>Total</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Payment</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Status</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id}>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', fontWeight: 600, color: '#1A1A2E' }}>{order.id}</td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{order.customer}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{order.items} {order.items === 1 ? 'item' : 'items'}</div>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', fontSize: '0.875rem', color: '#64748B' }}>{order.date}</td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', textAlign: 'right', fontWeight: 700, color: '#1A1A2E' }}>₹{order.total.toLocaleString('en-IN')}</td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: order.payment === 'Paid' ? '#166534' : order.payment === 'Failed' ? '#991B1B' : '#92400E', background: order.payment === 'Paid' ? '#DCFCE7' : order.payment === 'Failed' ? '#FEE2E2' : '#FEF3C7', padding: '4px 8px', borderRadius: '4px' }}>
                    {order.payment === 'Paid' ? <CheckCircle2 size={12} /> : order.payment === 'Failed' ? <XCircle size={12} /> : <Clock size={12} />}
                    {order.payment}
                  </span>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600,
                    background: order.status === 'Delivered' ? '#DCFCE7' : order.status === 'Processing' ? '#DBEAFE' : order.status === 'Cancelled' ? '#FEE2E2' : order.status === 'Shipped' ? '#E0E7FF' : '#FEF3C7',
                    color: order.status === 'Delivered' ? '#166534' : order.status === 'Processing' ? '#1E40AF' : order.status === 'Cancelled' ? '#991B1B' : order.status === 'Shipped' ? '#3730A3' : '#92400E'
                  }}>{order.status}</span>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', textAlign: 'right' }}>
                  <button title="View Details" style={{ background: '#F1F5F9', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#64748B' }}>
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
