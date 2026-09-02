import { useEffect } from 'react';

export default function Settings() {
  useEffect(() => {
    document.title = 'Admin Settings - BSC Exclusive';
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Store Settings</h1>
          <p>Configure your storefront, payments, and system preferences.</p>
        </div>
        <button style={{
          backgroundColor: '#000',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Save Changes
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="col-left">
          <div className="card">
            <div className="card-title">General Details</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Store Name</label>
                <input type="text" defaultValue="BSC Exclusive" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Contact Email</label>
                <input type="email" defaultValue="support@bscexclusive.com" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Store Currency</label>
                <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem' }}>
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Billing & Payments</div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '16px' }}>Manage how customers pay you at checkout.</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '24px', background: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>Stripe</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Credit Card Processing</div>
                  <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>Active</div>
                </div>
              </div>
              <button style={{ border: '1px solid #e5e7eb', background: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Manage</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '24px', background: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>UPI</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Razorpay UPI</div>
                  <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>Active</div>
                </div>
              </div>
              <button style={{ border: '1px solid #e5e7eb', background: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Manage</button>
            </div>
          </div>
        </div>

        <div className="col-right">
          <div className="card">
            <div className="card-title">Notifications</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email on new order</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email on low inventory (critical)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>SMS on order cancellation</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Daily performance summary report</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
