import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Store, CreditCard, Bell, Shield, Save } from 'lucide-react';
import { showToast } from '../../components/Toast';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Settings - BSC Exclusive Admin';
  }, []);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('success', 'Settings saved successfully!');
    }, 800);
  };

  const tabs = [
    { id: 'general', name: 'General Settings', icon: <Store size={18} /> },
    { id: 'payments', name: 'Payments', icon: <CreditCard size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', name: 'Security & Privacy', icon: <Shield size={18} /> },
  ];

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem' };
  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600 as const, marginBottom: '6px', color: '#1E293B' };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Store Settings</h1>
          <p>Manage your store configurations, payment gateways, and notifications.</p>
        </div>
        <button onClick={handleSave} disabled={loading} style={{ backgroundColor: '#B91C1C', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, textAlign: 'left',
                background: activeTab === tab.id ? '#FEE2E2' : 'transparent',
                color: activeTab === tab.id ? '#B91C1C' : '#64748B',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SettingsIcon size={20} /> {tabs.find(t => t.id === activeTab)?.name}
            </span>
          </div>

          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Store Name</label>
                  <input style={inputStyle} defaultValue="BSC Exclusive" />
                </div>
                <div>
                  <label style={labelStyle}>Contact Email</label>
                  <input style={inputStyle} defaultValue="contact@bscexclusive.com" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input style={inputStyle} defaultValue="+91 800 123 4567" />
                </div>
                <div>
                  <label style={labelStyle}>Currency</label>
                  <select style={inputStyle} defaultValue="INR">
                    <option value="INR">₹ Indian Rupee (INR)</option>
                    <option value="USD">$ US Dollar (USD)</option>
                    <option value="EUR">€ Euro (EUR)</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Store Address</label>
                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} defaultValue="123 Silk Board Layout, Davangere, Karnataka 577002, India" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Timezone</label>
                  <select style={inputStyle} defaultValue="IST">
                    <option value="IST">Asia/Kolkata (IST)</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Order Prefix</label>
                  <input style={inputStyle} defaultValue="#ORD-" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
              <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '8px' }}>Enable or disable payment methods available to customers during checkout.</p>
              
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#F8FAFC', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1E3A8A', fontSize: '0.75rem' }}>RZP</div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1A1A2E' }}>Razorpay (Credit Cards, NetBanking)</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>Primary payment gateway for Indian customers.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#16A34A', background: '#DCFCE7', padding: '4px 10px', borderRadius: '12px' }}>Active</span>
                  <button style={{ padding: '8px 16px', background: '#F1F5F9', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>Manage</button>
                </div>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#F0FDF4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#16A34A', fontSize: '0.7rem' }}>UPI</div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1A1A2E' }}>UPI Pay</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>Direct UPI payment via GPay, PhonePe, Paytm, BHIM.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#16A34A', background: '#DCFCE7', padding: '4px 10px', borderRadius: '12px' }}>Active</span>
                  <button style={{ padding: '8px 16px', background: '#F1F5F9', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>Manage</button>
                </div>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#FFF7ED', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#EA580C', fontSize: '0.65rem' }}>QR</div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1A1A2E' }}>QR Code Payment</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>Scan QR code to pay via any UPI app.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#16A34A', background: '#DCFCE7', padding: '4px 10px', borderRadius: '12px' }}>Active</span>
                  <button style={{ padding: '8px 16px', background: '#F1F5F9', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>Manage</button>
                </div>
              </div>
              
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#F8FAFC', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1A1A2E', fontSize: '0.6rem' }}>COD</div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1A1A2E' }}>Cash on Delivery (COD)</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>Allow customers to pay upon delivery.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#16A34A', background: '#DCFCE7', padding: '4px 10px', borderRadius: '12px' }}>Active</span>
                  <button style={{ padding: '8px 16px', background: '#F1F5F9', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>Manage</button>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'notifications' || activeTab === 'security') && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', flexDirection: 'column', gap: '16px', color: '#94A3B8' }}>
              <SettingsIcon size={48} opacity={0.3} />
              <p>These settings are currently managed through external services.</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}