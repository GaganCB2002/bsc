import { useEffect } from 'react';
import { Settings } from 'lucide-react';

export default function Catalog() {
  useEffect(() => {
    document.title = 'Catalog - BS Channabasappa Admin';
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Luxe Category Manager</h1>
          <div style={{ display: 'flex', gap: '24px', marginTop: '16px', fontWeight: 500, color: '#6b7280' }}>
            <span style={{ cursor: 'pointer' }}>Overview</span>
            <span style={{ cursor: 'pointer', color: '#4f46e5', borderBottom: '2px solid #4f46e5', paddingBottom: '4px' }}>Departments</span>
            <span style={{ cursor: 'pointer' }}>Reports</span>
          </div>
        </div>
      </div>
      
      <div className="card" style={{ padding: '24px 32px' }}>
        <div className="card-title" style={{ marginBottom: '8px' }}>Department Performance</div>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '24px' }}>Live metrics for Q3 fashion cycles across key verticals.</p>
        <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', background: '#dcfce7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', fontSize: '1.25rem' }}>↗</div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Net Growth</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>+14.2%</div>
            </div>
          </div>
          <div style={{ width: '1px', background: '#e5e7eb' }}></div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', background: '#e0e7ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontSize: '1.25rem' }}>💵</div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Total Revenue</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹189.5k</div>
            </div>
          </div>
          <div style={{ width: '1px', background: '#e5e7eb' }}></div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', background: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', fontSize: '1.25rem' }}>📋</div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Active SKU Count</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>2,412</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="catalog-grid">
        <div className="catalog-card">
          <div style={{ position: 'relative' }}>
            <img className="catalog-img" src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800" alt="Saris" />
            <span style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '6px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', backdropFilter: 'blur(4px)' }}>Traditional Wear</span>
          </div>
          <div className="catalog-info">
            <div className="catalog-header">
              <h2 style={{ fontSize: '1.5rem' }}>Saris</h2>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16a34a' }}>+12%</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Growth Q3</div>
              </div>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '16px' }}>Intricate weaves & bridal collections</p>
            
            <div className="catalog-stats">
              <div className="catalog-stat-col">
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Revenue</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>₹42,000</div>
              </div>
              <div className="catalog-stat-col">
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Most Popular</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>Banarasi</div>
              </div>
            </div>
            
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sub-Categories</div>
            <div className="catalog-tags">
              <span className="catalog-tag">Kanchipuram Silk</span>
              <span className="catalog-tag">Chiffon Partywear</span>
              <span className="catalog-tag">Cotton Daily</span>
            </div>
            
            <button className="btn-manage" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Settings size={16} /> Manage Category</button>
          </div>
        </div>

        <div className="catalog-card">
          <div style={{ position: 'relative' }}>
            <img className="catalog-img" src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=800" alt="Kids Wear" />
            <span style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '6px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', backdropFilter: 'blur(4px)' }}>Youth Fashion</span>
          </div>
          <div className="catalog-info">
            <div className="catalog-header">
              <h2 style={{ fontSize: '1.5rem' }}>Kids' Wear</h2>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16a34a' }}>+18%</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Growth Q3</div>
              </div>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '16px' }}>Trendy essentials for ages 0-14</p>
            
            <div className="catalog-stats">
              <div className="catalog-stat-col">
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Revenue</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>₹28,000</div>
              </div>
              <div className="catalog-stat-col">
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Most Popular</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>Ethnic Sets</div>
              </div>
            </div>
            
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sub-Categories</div>
            <div className="catalog-tags">
              <span className="catalog-tag">Newborn Essentials</span>
              <span className="catalog-tag">Occasion Wear</span>
              <span className="catalog-tag">Summer Play</span>
            </div>
            
            <button className="btn-manage" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Settings size={16} /> Manage Category</button>
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.75rem', fontWeight: 500, marginTop: '32px' }}>
        Last updated: Oct 24, 2023, 11:45 AM • Data synced from BS Channabasappa Logistics Core
      </div>
    </>
  );
}
