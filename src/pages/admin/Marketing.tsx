import { useEffect } from 'react';

export default function Marketing() {
  useEffect(() => {
    document.title = 'Marketing - BSC Exclusive Admin';
  }, []);

  const campaigns = [
    { id: 'CAMP-01', name: 'Diwali Festive Sale', status: 'Active', spend: 45000, revenue: 215000, roas: '4.78x' },
    { id: 'CAMP-02', name: 'Summer Bridal Collection', status: 'Completed', spend: 120000, revenue: 850000, roas: '7.08x' },
    { id: 'CAMP-03', name: 'New Arrivals - Men', status: 'Active', spend: 15000, revenue: 42000, roas: '2.80x' },
    { id: 'CAMP-04', name: 'Retargeting - Cart Abandoners', status: 'Active', spend: 8000, revenue: 54000, roas: '6.75x' },
  ];

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Marketing & Promotions</h1>
          <p>Manage campaigns, discount codes, and track return on ad spend (ROAS).</p>
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
          + New Campaign
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">Active Campaigns</div>
          <table>
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Status</th>
                <th>Spend</th>
                <th>Revenue</th>
                <th>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>
                    <span style={{
                      backgroundColor: c.status === 'Active' ? '#dcfce7' : '#f3f4f6',
                      color: c.status === 'Active' ? '#166534' : '#4b5563',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {c.status}
                    </span>
                  </td>
                  <td>₹{c.spend.toLocaleString('en-IN')}</td>
                  <td style={{ fontWeight: 600 }}>₹{c.revenue.toLocaleString('en-IN')}</td>
                  <td style={{ color: '#16a34a', fontWeight: 600 }}>{c.roas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dark-card">
          <div className="dark-card-title">Quick Discount Codes</div>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '24px' }}>Active promo codes across the store.</p>
          
          <div style={{ background: '#1f2937', padding: '16px', borderRadius: '8px', marginBottom: '12px', border: '1px dashed #4b5563', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em' }}>FESTIVE20</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>20% off all orders over ₹5,000</div>
            </div>
            <div style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 600 }}>142 Uses</div>
          </div>

          <div style={{ background: '#1f2937', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px dashed #4b5563', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em' }}>FREESHIP</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>Free shipping globally</div>
            </div>
            <div style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 600 }}>89 Uses</div>
          </div>
          
          <button style={{ width: '100%', padding: '12px', background: '#374151', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>Create Discount Code</button>
        </div>
      </div>
    </>
  );
}
