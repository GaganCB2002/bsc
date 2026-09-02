import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Plus, Package, Tag } from 'lucide-react';

export default function Overview() {
  useEffect(() => {
    document.title = 'Admin Dashboard - BSC Exclusive';
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Executive Overview</h1>
          <p>Real-time performance metrics for BSC Exclusive Retail ecosystem.</p>
        </div>
        <div className="alert-box">
          <div className="alert-icon"><AlertTriangle size={24} /></div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>Low Stock Alert</div>
            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>5 items in 'Essentials' are critically low.</div>
          </div>
          <div style={{ marginLeft: '20px', cursor: 'pointer', color: '#9ca3af' }}>✕</div>
        </div>
      </div>
      
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-header">
            <span>Net Revenue</span>
            <span className="badge-green">↗ 12%</span>
          </div>
          <div className="stat-value">₹128,430.00</div>
          <div className="stat-sub" style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '24px', marginTop: '12px' }}>
            <div style={{ flex: 1, background: '#e0e7ff', height: '30%', borderRadius: '2px' }}></div>
            <div style={{ flex: 1, background: '#e0e7ff', height: '40%', borderRadius: '2px' }}></div>
            <div style={{ flex: 1, background: '#c7d2fe', height: '35%', borderRadius: '2px' }}></div>
            <div style={{ flex: 1, background: '#c7d2fe', height: '50%', borderRadius: '2px' }}></div>
            <div style={{ flex: 1, background: '#a5b4fc', height: '60%', borderRadius: '2px' }}></div>
            <div style={{ flex: 1, background: '#818cf8', height: '80%', borderRadius: '2px' }}></div>
            <div style={{ flex: 1, background: '#4f46e5', height: '100%', borderRadius: '2px' }}></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span>Total Orders</span>
            <span className="badge-green">↗ 8%</span>
          </div>
          <div className="stat-value">1,240</div>
          <div className="stat-sub" style={{ marginTop: '16px' }}>Across 4 retail channels</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span>Conversion Rate</span>
            <span className="badge-red">↘ 0.5%</span>
          </div>
          <div className="stat-value">3.42%</div>
          <div className="stat-sub" style={{ height: '6px', background: '#e5e7eb', borderRadius: '4px', marginTop: '24px' }}>
            <div style={{ width: '30%', height: '100%', background: '#4f46e5', borderRadius: '4px' }}></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span>Avg. Order Value</span>
            <span className="badge-green">↗ 5%</span>
          </div>
          <div className="stat-value">₹103.57</div>
          <div className="stat-sub" style={{ marginTop: '16px' }}>Up from ₹98.20 last month</div>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="col-left">
          <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
            <div className="card-title">
              Revenue vs Previous Period
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
                <span style={{ padding: '6px 16px', border: '1px solid #e5e7eb', borderRadius: '16px', cursor: 'pointer' }}>DAILY</span>
                <span style={{ padding: '6px 16px', background: '#000', color: '#fff', borderRadius: '16px', cursor: 'pointer' }}>WEEKLY</span>
                <span style={{ padding: '6px 16px', border: '1px solid #e5e7eb', borderRadius: '16px', cursor: 'pointer' }}>MONTHLY</span>
              </div>
            </div>
            <div style={{ flex: 1, borderBottom: '1px solid #e5e7eb', position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
               <svg viewBox="0 0 600 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                 <path d="M0,130 C100,100 150,140 250,90 C350,40 380,20 450,110 C520,200 550,60 600,40" fill="none" stroke="#4f46e5" strokeWidth="3"/>
                 <path d="M0,145 C100,120 150,150 250,130 C350,110 380,80 450,130 C520,180 550,110 600,90" fill="none" stroke="#F1F5F9" strokeWidth="2" strokeDasharray="5,5"/>
               </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
                <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
            </div>
          </div>
          
          <div className="card">
            <div className="card-title">
              Recent Orders
              <Link to="/admin/orders" style={{ fontSize: '0.75rem', color: '#4f46e5', textDecoration: 'none', textTransform: 'uppercase' }}>VIEW ALL &rarr;</Link>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>#ORD-2841</td>
                  <td>Alexander Pierce</td>
                  <td><span className="status-shipped">SHIPPED</span></td>
                  <td>Oct 24, 2023</td>
                  <td style={{ fontWeight: 600, textAlign: 'right' }}>₹214.50</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>#ORD-2840</td>
                  <td>Eleanor Shellstrop</td>
                  <td><span className="status-processing">PROCESSING</span></td>
                  <td>Oct 24, 2023</td>
                  <td style={{ fontWeight: 600, textAlign: 'right' }}>₹1,432.00</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>#ORD-2839</td>
                  <td>Chidi Anagonye</td>
                  <td><span className="status-pending">PENDING</span></td>
                  <td>Oct 23, 2023</td>
                  <td style={{ fontWeight: 600, textAlign: 'right' }}>₹89.00</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>#ORD-2838</td>
                  <td>Tahani Al-Jamil</td>
                  <td><span className="status-shipped">SHIPPED</span></td>
                  <td>Oct 23, 2023</td>
                  <td style={{ fontWeight: 600, textAlign: 'right' }}>₹560.25</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="col-right">
          <div className="card" style={{ paddingBottom: '16px' }}>
            <div className="card-title">Best Selling Products</div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
                <span>Oxford Cotton Shirt</span><span style={{ fontWeight: 400, color: '#4b5563' }}>420 sold</span>
              </div>
              <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '4px' }}>
                <div style={{ width: '100%', height: '100%', background: '#4f46e5', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
                <span>Slim Fit Chinos</span><span style={{ fontWeight: 400, color: '#4b5563' }}>380 sold</span>
              </div>
              <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '4px' }}>
                <div style={{ width: '85%', height: '100%', background: '#4f46e5', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
                <span>Cashmere Sweater</span><span style={{ fontWeight: 400, color: '#4b5563' }}>290 sold</span>
              </div>
              <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '4px' }}>
                <div style={{ width: '65%', height: '100%', background: '#4f46e5', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
                <span>Silk Tie - Burgundy</span><span style={{ fontWeight: 400, color: '#4b5563' }}>210 sold</span>
              </div>
              <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '4px' }}>
                <div style={{ width: '50%', height: '100%', background: '#4f46e5', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link to="/admin/catalog" style={{ fontSize: '0.75rem', color: '#4f46e5', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>VIEW CATALOG INSIGHTS</Link>
            </div>
          </div>
          
          <div className="dark-card">
            <div className="dark-card-title">Quick Actions</div>
            <div className="action-item">
              <div style={{ width: '40px', height: '40px', background: '#111827', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #4b5563' }}><Plus size={20} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Create Product</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Add new items to catalog</div>
              </div>
              <div style={{ color: '#6b7280' }}>›</div>
            </div>
            <div className="action-item">
              <div style={{ width: '40px', height: '40px', background: '#111827', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #4b5563' }}><Package size={20} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Ship Order</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Manage logistics and tracking</div>
              </div>
              <div style={{ color: '#6b7280' }}>›</div>
            </div>
            <div className="action-item">
              <div style={{ width: '40px', height: '40px', background: '#111827', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #4b5563' }}><Tag size={20} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Add Discount</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Launch a new promotion</div>
              </div>
              <div style={{ color: '#6b7280' }}>›</div>
            </div>
            
            <div style={{ background: 'rgba(67, 56, 202, 0.3)', padding: '20px', borderRadius: '8px', marginTop: '24px', border: '1px solid rgba(79, 70, 229, 0.4)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c7d2fe', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>WEEKLY INSIGHT</div>
              <div style={{ fontSize: '0.875rem', fontStyle: 'italic', color: '#e0e7ff', lineHeight: 1.5 }}>"Sundays at 8 PM see a 24% spike in Mobile conversions. Consider scheduling flash sales then."</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
