import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function Inventory() {
  useEffect(() => {
    document.title = 'Inventory - BS Channabasappa Admin';
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Inventory & Forecasting</h1>
          <p>Global warehouse status and predictive stock orchestration.</p>
        </div>
      </div>
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-header">Total Inventory Value</div>
          <div className="stat-value">₹1,248,590.00</div>
          <div className="stat-sub" style={{ color: '#16a34a', fontWeight: 600, marginTop: '8px' }}>↗ 4.2% from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Stock Turn Rate</div>
          <div className="stat-value">6.8x</div>
          <div className="stat-sub" style={{ color: '#16a34a', fontWeight: 600, marginTop: '8px' }}>✓ Above industry average (5.2x)</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Critical SKUs</div>
          <div className="stat-value" style={{ color: '#dc2626' }}>12 Items</div>
          <div className="stat-sub" style={{ color: '#dc2626', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={16} /> Immediate reorder required</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Projected Stockouts</div>
          <div className="stat-value" style={{ color: '#4f46e5' }}>28 SKUs</div>
          <div className="stat-sub" style={{ marginTop: '8px' }}>⏱ Within next 14 days</div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-title">
          Inventory & Forecasting
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ padding: '10px 16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}><span>≡</span> Filter</button>
            <button style={{ padding: '10px 16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}><span>↓</span> Export</button>
          </div>
        </div>
        <table style={{ marginTop: '16px' }}>
          <thead>
            <tr>
              <th>Product / SKU</th>
              <th>Movement (7D)</th>
              <th>Status</th>
              <th>On Hand</th>
              <th>Predictive Stock</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: '#e5e7eb', borderRadius: '8px', overflow: 'hidden' }}><img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=100" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Premium Cotton Tee - XL" /></div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>Premium Cotton Tee - XL</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>SKU: APP-TSS-001</div>
                </div>
              </td>
              <td><svg width="80" height="30"><path d="M0,25 L20,20 L40,22 L60,10 L80,5" fill="none" stroke="#10b981" strokeWidth="2"/></svg></td>
              <td><span className="status-shipped">Healthy</span></td>
              <td>1,240<br/><span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Units</span></td>
              <td>
                <div style={{ color: '#16a34a', fontWeight: 600, marginBottom: '2px' }}>42 Days Left</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Velocity: 29.5/day</div>
              </td>
              <td style={{ textAlign: 'right' }}><Link to="/admin/inventory" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>Details</Link></td>
            </tr>
            <tr>
              <td style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: '#e5e7eb', borderRadius: '8px', overflow: 'hidden' }}><img src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=100" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Slim-Fit Denim Jeans - 32" /></div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>Slim-Fit Denim Jeans - 32</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>SKU: APP-DNM-442</div>
                </div>
              </td>
              <td><svg width="80" height="30"><path d="M0,5 L20,10 L40,18 L60,22 L80,25" fill="none" stroke="#f59e0b" strokeWidth="2"/></svg></td>
              <td><span className="status-pending">Low</span></td>
              <td>145<br/><span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Units</span></td>
              <td>
                <div style={{ color: '#d97706', fontWeight: 600, marginBottom: '2px' }}>8 Days Left</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Velocity: 18.1/day</div>
              </td>
              <td style={{ textAlign: 'right' }}><button style={{ background: '#000', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Reorder Now</button></td>
            </tr>
            <tr>
              <td style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: '#e5e7eb', borderRadius: '8px', overflow: 'hidden' }}><img src="https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=100" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Wool Overcoat - Charcoal" /></div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>Wool Overcoat - Charcoal</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>SKU: APP-CT-908</div>
                </div>
              </td>
              <td><svg width="80" height="30"><path d="M0,5 L20,15 L40,25 L60,28 L80,29" fill="none" stroke="#ef4444" strokeWidth="2"/></svg></td>
              <td><span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Critical</span></td>
              <td>12<br/><span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Units</span></td>
              <td>
                <div style={{ color: '#dc2626', fontWeight: 600, marginBottom: '2px' }}>1 Day Left</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Velocity: 11.4/day</div>
              </td>
              <td style={{ textAlign: 'right' }}><button style={{ background: '#dc2626', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Reorder Now</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">
            Inventory Health Trend
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', fontWeight: 500 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div> Optimal</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div> At Risk</span>
            </div>
          </div>
          <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '16px', paddingTop: '32px' }}>
            <div style={{ flex: 1, background: '#e5e7eb', height: '30%', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ flex: 1, background: '#e0e7ff', height: '45%', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ flex: 1, background: '#e0e7ff', height: '70%', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ flex: 1, background: '#e0e7ff', height: '85%', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ flex: 1, background: '#e0e7ff', height: '50%', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ flex: 1, background: '#e0e7ff', height: '90%', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ flex: 1, background: '#111827', height: '95%', borderRadius: '4px 4px 0 0' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
        <div className="dark-card">
          <div className="dark-card-title">Smart Reorder Engine</div>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '24px' }}>Based on current velocity, we recommend restocking the following categories to avoid seasonal stockouts.</p>
          
          <div style={{ background: '#1f2937', padding: '16px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Outerwear (Q4 Prep)</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>Estimated Shortfall: 420 units</div>
            </div>
            <div style={{ color: '#f59e0b', fontSize: '1.25rem' }}>!</div>
          </div>
          
          <div style={{ background: '#1f2937', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Footwear (Trending)</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>Velocity increased by 22%</div>
            </div>
            <div style={{ color: '#10b981', fontSize: '1.25rem' }}>↗</div>
          </div>
          
          <button style={{ width: '100%', padding: '14px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>Generate Bulk Order</button>
        </div>
      </div>
    </>
  );
}
