import { useState, useEffect } from 'react';
import { Search, MapPin, Mail, Phone, Circle } from 'lucide-react';

export default function Customers() {
  const [activeUsers, setActiveUsers] = useState(14);
  const [customers] = useState([
    { id: 'CUST-8401', name: 'Ananya Sharma', email: 'ananya.s@example.com', phone: '+91 98765 43210', location: 'Bangalore, Karnataka', latLng: '12.9716° N, 77.5946° E', lastActive: 'Just now', status: 'active' },
    { id: 'CUST-8402', name: 'Rajesh Verma', email: 'rajesh.v@example.com', phone: '+91 91234 56789', location: 'Mumbai, Maharashtra', latLng: '19.0760° N, 72.8777° E', lastActive: '2 mins ago', status: 'active' },
    { id: 'CUST-8403', name: 'Priya Patel', email: 'priya.patel@example.com', phone: '+91 99887 76655', location: 'Ahmedabad, Gujarat', latLng: '23.0225° N, 72.5714° E', lastActive: '15 mins ago', status: 'idle' },
    { id: 'CUST-8404', name: 'Alexander Pierce', email: 'alexander@example.com', phone: '+1 555-0198', location: 'New York, USA', latLng: '40.7128° N, 74.0060° W', lastActive: '1 hour ago', status: 'offline' },
    { id: 'CUST-8405', name: 'Sunita Reddy', email: 'sunita.r@example.com', phone: '+91 98711 22334', location: 'Hyderabad, Telangana', latLng: '17.3850° N, 78.4867° E', lastActive: '3 hours ago', status: 'offline' },
  ]);

  // Simulate live active users fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.title = 'Customers - BSC Exclusive Admin';
  }, []);

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div className="page-title">
          <h1>Customers</h1>
          <p>Manage customer data, view live locations, and track activity.</p>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ position: 'absolute', width: '12px', height: '12px', backgroundColor: '#22c55e', borderRadius: '50%', animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite', opacity: 0.75 }}></span>
            <span style={{ position: 'relative', width: '10px', height: '10px', backgroundColor: '#16a34a', borderRadius: '50%' }}></span>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{activeUsers}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Visitors</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input type="text" placeholder="Search customers..." style={{ width: '100%', padding: '10px 10px 10px 38px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem' }} />
          </div>
          <button className="btn-manage" style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', padding: '10px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Export CSV</button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#fff', textAlign: 'left' }}>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Customer Details</th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Contact Info</th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Live Location</th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#fff' }}>
                <td style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 700 }}>
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{customer.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>ID: {customer.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#4b5563' }}><Mail size={14} /> {customer.email}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#4b5563' }}><Phone size={14} /> {customer.phone}</div>
                  </div>
                </td>
                <td style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}><MapPin size={14} color="#4f46e5" /> {customer.location}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', paddingLeft: '22px' }}>{customer.latLng}</div>
                  </div>
                </td>
                <td style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Circle size={10} fill={customer.status === 'active' ? '#22c55e' : customer.status === 'idle' ? '#eab308' : '#9ca3af'} color={customer.status === 'active' ? '#22c55e' : customer.status === 'idle' ? '#eab308' : '#9ca3af'} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563', textTransform: 'capitalize' }}>{customer.lastActive}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
