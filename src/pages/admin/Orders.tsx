import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Orders() {
  useEffect(() => {
    document.title = 'Orders - BSC Exclusive Admin';
  }, []);

  const orders = [
    { id: '#ORD-2841', customer: 'Alexander Pierce', date: 'Oct 24, 2023', total: 214.50, status: 'Shipped', items: 3 },
    { id: '#ORD-2840', customer: 'Eleanor Shellstrop', date: 'Oct 24, 2023', total: 1432.00, status: 'Processing', items: 12 },
    { id: '#ORD-2839', customer: 'Chidi Anagonye', date: 'Oct 23, 2023', total: 89.00, status: 'Pending', items: 1 },
    { id: '#ORD-2838', customer: 'Tahani Al-Jamil', date: 'Oct 23, 2023', total: 560.25, status: 'Shipped', items: 4 },
    { id: '#ORD-2837', customer: 'Jason Mendoza', date: 'Oct 22, 2023', total: 120.00, status: 'Delivered', items: 2 },
    { id: '#ORD-2836', customer: 'Michael', date: 'Oct 22, 2023', total: 2450.00, status: 'Processing', items: 8 },
  ];

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Order Management</h1>
          <p>Track, manage, and fulfill customer orders across all channels.</p>
        </div>
        <button style={{
          backgroundColor: '#4f46e5',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Export CSV
        </button>
      </div>

      <div className="card">
        <div className="card-title">
          Recent Orders
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="text" placeholder="Search orders..." style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem' }} />
            <select style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem' }}>
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={{ fontWeight: 600 }}>{order.id}</td>
                <td style={{ color: '#6b7280' }}>{order.date}</td>
                <td>{order.customer}</td>
                <td>{order.items}</td>
                <td style={{ fontWeight: 600 }}>₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td>
                  <span className={
                    order.status === 'Shipped' || order.status === 'Delivered' ? 'status-shipped' :
                    order.status === 'Processing' ? 'status-processing' : 'status-pending'
                  }>
                    {order.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Link to="/admin/orders" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
