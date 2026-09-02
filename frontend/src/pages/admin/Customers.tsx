import { useEffect, useState } from 'react';
import { Users, Search, Mail, Phone, MapPin, Eye } from 'lucide-react';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = 'Customers - BSC Exclusive Admin';
  }, []);

  const customers = [
    { id: 'CUST-101', name: 'Anjali Sharma', email: 'anjali@example.com', phone: '+91 9876543210', location: 'Mumbai, MH', orders: 12, spent: 45000, joined: 'Mar 2025', status: 'Active' },
    { id: 'CUST-102', name: 'Rahul Verma', email: 'rahul.v@example.com', phone: '+91 8765432109', location: 'Bangalore, KA', orders: 4, spent: 18500, joined: 'Jan 2026', status: 'Active' },
    { id: 'CUST-103', name: 'Priya Iyer', email: 'priya.iyer@example.com', phone: '+91 7654321098', location: 'Chennai, TN', orders: 8, spent: 32000, joined: 'Nov 2025', status: 'Inactive' },
    { id: 'CUST-104', name: 'Vikram Singh', email: 'vikram.s@example.com', phone: '+91 6543210987', location: 'Delhi, DL', orders: 1, spent: 8999, joined: 'Aug 2026', status: 'Active' },
    { id: 'CUST-105', name: 'Neha Gupta', email: 'neha.g@example.com', phone: '+91 5432109876', location: 'Pune, MH', orders: 15, spent: 125000, joined: 'Feb 2024', status: 'VIP' },
  ];

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Customer Management</h1>
          <p>View and manage registered customers and their purchase history.</p>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-header">Total Customers</div>
          <div className="stat-value">{customers.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Active Members</div>
          <div className="stat-value" style={{ color: '#16a34a' }}>{customers.filter(c => c.status === 'Active' || c.status === 'VIP').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">VIP Customers</div>
          <div className="stat-value" style={{ color: '#9333EA' }}>{customers.filter(c => c.status === 'VIP').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Avg Order Value</div>
          <div className="stat-value" style={{ color: '#B91C1C' }}>₹14,250</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={20} /> Customer Directory ({filtered.length})</span>
          <div style={{ display: 'flex', alignItems: 'center', background: '#F1F5F9', borderRadius: '8px', padding: '0 12px' }}>
            <Search size={16} color="#94A3B8" />
            <input type="text" placeholder="Search name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ border: 'none', background: 'transparent', padding: '8px', fontSize: '0.85rem', outline: 'none', width: '240px' }} />
          </div>
        </div>

        <table style={{ marginTop: '16px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Customer</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Contact Details</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Location</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', textAlign: 'center' }}>Orders</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', textAlign: 'right' }}>Total Spent</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Status</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(customer => (
              <tr key={customer.id}>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F1F5F9', color: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A1A2E' }}>{customer.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Joined {customer.joined}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748B', marginBottom: '4px' }}>
                    <Mail size={12} /> {customer.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748B' }}>
                    <Phone size={12} /> {customer.phone}
                  </div>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#1A1A2E' }}>
                    <MapPin size={12} color="#94A3B8" /> {customer.location}
                  </div>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', textAlign: 'center', fontWeight: 600, color: '#1A1A2E' }}>
                  {customer.orders}
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', textAlign: 'right', fontWeight: 700, color: '#B91C1C' }}>
                  ₹{customer.spent.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600,
                    background: customer.status === 'Active' ? '#DCFCE7' : customer.status === 'VIP' ? '#F3E8FF' : '#F1F5F9',
                    color: customer.status === 'Active' ? '#166534' : customer.status === 'VIP' ? '#7E22CE' : '#64748B'
                  }}>{customer.status}</span>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', textAlign: 'right' }}>
                  <button title="View Profile" style={{ background: '#F1F5F9', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#64748B' }}>
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
