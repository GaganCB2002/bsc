import { useEffect } from 'react';

export default function Analytics() {
  useEffect(() => {
    document.title = 'Analytics - BS Channabasappa Admin';
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Analytics & Reports</h1>
          <p>Deep dive into your store's performance metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff' }}>
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Year to Date</option>
          </select>
          <button style={{
            backgroundColor: '#000',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Download Report
          </button>
        </div>
      </div>

      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-header">Total Sales</div>
          <div className="stat-value">₹4,250,890</div>
          <div className="stat-sub" style={{ color: '#16a34a', fontWeight: 600, marginTop: '8px' }}>↗ 15% vs previous 30 days</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Online Store Sessions</div>
          <div className="stat-value">124,592</div>
          <div className="stat-sub" style={{ color: '#16a34a', fontWeight: 600, marginTop: '8px' }}>↗ 8% vs previous 30 days</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Returning Customer Rate</div>
          <div className="stat-value">42.8%</div>
          <div className="stat-sub" style={{ color: '#dc2626', fontWeight: 600, marginTop: '8px' }}>↘ 1.2% vs previous 30 days</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Average Order Value</div>
          <div className="stat-value">₹8,450</div>
          <div className="stat-sub" style={{ color: '#16a34a', fontWeight: 600, marginTop: '8px' }}>↗ 5% vs previous 30 days</div>
        </div>
      </div>

      <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
        <div className="card-title">Sales Over Time</div>
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', paddingBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
            <svg viewBox="0 0 800 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <path d="M0,180 C100,150 150,180 250,120 C350,60 400,90 500,40 C600,-10 700,50 800,20" fill="none" stroke="#4f46e5" strokeWidth="4"/>
              <path d="M0,200 L0,180 C100,150 150,180 250,120 C350,60 400,90 500,40 C600,-10 700,50 800,20 L800,200 Z" fill="rgba(79, 70, 229, 0.1)" stroke="none"/>
            </svg>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>
            <span>Oct 01</span><span>Oct 05</span><span>Oct 10</span><span>Oct 15</span><span>Oct 20</span><span>Oct 25</span><span>Oct 30</span>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">Top Sales by Region</div>
          <table style={{ marginTop: '16px' }}>
            <thead>
              <tr>
                <th>Region</th>
                <th style={{ textAlign: 'right' }}>Orders</th>
                <th style={{ textAlign: 'right' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Karnataka</td>
                <td style={{ textAlign: 'right' }}>1,245</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>₹1,500,000</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Maharashtra</td>
                <td style={{ textAlign: 'right' }}>890</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>₹980,500</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Delhi NCR</td>
                <td style={{ textAlign: 'right' }}>720</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>₹840,200</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Tamil Nadu</td>
                <td style={{ textAlign: 'right' }}>650</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>₹620,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-title">Traffic Sources</div>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                <span>Direct Search</span><span>45%</span>
              </div>
              <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px' }}>
                <div style={{ width: '45%', height: '100%', background: '#4f46e5', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                <span>Social Media (Instagram)</span><span>30%</span>
              </div>
              <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px' }}>
                <div style={{ width: '30%', height: '100%', background: '#ec4899', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                <span>Paid Ads (Google)</span><span>15%</span>
              </div>
              <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px' }}>
                <div style={{ width: '15%', height: '100%', background: '#3b82f6', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                <span>Referral</span><span>10%</span>
              </div>
              <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px' }}>
                <div style={{ width: '10%', height: '100%', background: '#10b981', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
