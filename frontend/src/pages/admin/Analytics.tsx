import { useEffect } from 'react';
import { LineChart, BarChart2, TrendingUp, Users, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Analytics() {
  useEffect(() => {
    document.title = 'Analytics - BSC Exclusive Admin';
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Analytics & Reports</h1>
          <p>Detailed insights into your store's performance, sales, and customer behavior.</p>
        </div>
        <select style={{ padding: '10px 16px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', outline: 'none' }}>
          <option>Last 30 Days</option>
          <option>This Month</option>
          <option>Last Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="card" style={{ marginBottom: 0, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ background: '#EFF6FF', padding: '10px', borderRadius: '10px', color: '#1E40AF' }}><DollarSign size={20} /></div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#166534', background: '#DCFCE7', padding: '4px 8px', borderRadius: '16px' }}>
              <ArrowUpRight size={14} /> +12.5%
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Total Revenue</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1A1A2E', marginTop: '4px' }}>₹12.4L</div>
        </div>

        <div className="card" style={{ marginBottom: 0, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ background: '#FEF2F2', padding: '10px', borderRadius: '10px', color: '#B91C1C' }}><ShoppingCart size={20} /></div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#166534', background: '#DCFCE7', padding: '4px 8px', borderRadius: '16px' }}>
              <ArrowUpRight size={14} /> +8.2%
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Total Orders</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1A1A2E', marginTop: '4px' }}>426</div>
        </div>

        <div className="card" style={{ marginBottom: 0, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ background: '#F0FDF4', padding: '10px', borderRadius: '10px', color: '#16A34A' }}><Users size={20} /></div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#991B1B', background: '#FEE2E2', padding: '4px 8px', borderRadius: '16px' }}>
              <ArrowDownRight size={14} /> -2.1%
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>New Customers</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1A1A2E', marginTop: '4px' }}>184</div>
        </div>

        <div className="card" style={{ marginBottom: 0, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ background: '#FAF5FF', padding: '10px', borderRadius: '10px', color: '#9333EA' }}><TrendingUp size={20} /></div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#166534', background: '#DCFCE7', padding: '4px 8px', borderRadius: '16px' }}>
              <ArrowUpRight size={14} /> +4.3%
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Conversion Rate</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1A1A2E', marginTop: '4px' }}>3.2%</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="card">
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><LineChart size={20} /> Revenue Overview</span>
          </div>
          <div style={{ height: '300px', width: '100%', background: '#F8FAFC', borderRadius: '8px', display: 'flex', alignItems: 'flex-end', padding: '20px', gap: '20px' }}>
            {/* CSS Mock Chart */}
            {[40, 60, 45, 80, 50, 90, 75, 100].map((h, i) => (
              <div key={i} style={{ flex: 1, background: 'linear-gradient(to top, #B91C1C, #FCA5A5)', height: `${h}%`, borderRadius: '4px 4px 0 0', position: 'relative' }}>
                <span style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', color: '#64748B' }}>Week {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><BarChart2 size={20} /> Top Products</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {[
              { name: 'Bridal Silk Saree', sales: 124, rev: '₹4.2L', fill: '85%' },
              { name: 'Banarasi Georgette', sales: 98, rev: '₹2.1L', fill: '65%' },
              { name: 'Men\'s Sherwani', sales: 64, rev: '₹1.5L', fill: '45%' },
              { name: 'Tissue Silk Saree', sales: 42, rev: '₹1.1L', fill: '30%' },
              { name: 'Kids Ethnic Set', sales: 38, rev: '₹0.8L', fill: '25%' },
            ].map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>{p.name}</span>
                  <span style={{ color: '#64748B' }}>{p.rev}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: p.fill, height: '100%', background: '#B91C1C', borderRadius: '3px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
