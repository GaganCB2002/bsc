import { useEffect, useState } from 'react';
import { Tag, Plus, Edit2, Trash2, Scissors, Copy, CheckCircle2 } from 'lucide-react';

export default function Coupons() {
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Coupons & Offers - BSC Exclusive Admin';
  }, []);

  const coupons = [
    { id: '1', code: 'FESTIVE20', type: 'Percentage', value: '20%', minPurchase: 5000, usageLimit: 500, used: 142, status: 'Active', expiry: 'Oct 31, 2026' },
    { id: '2', code: 'WELCOME500', type: 'Fixed Amount', value: '₹500', minPurchase: 2000, usageLimit: 1000, used: 845, status: 'Active', expiry: 'Dec 31, 2026' },
    { id: '3', code: 'BRIDALSPECIAL', type: 'Percentage', value: '15%', minPurchase: 25000, usageLimit: 100, used: 100, status: 'Expired', expiry: 'Aug 15, 2026' },
    { id: '4', code: 'FREESHIP', type: 'Free Shipping', value: 'Shipping', minPurchase: 999, usageLimit: 0, used: 2104, status: 'Active', expiry: 'Never' },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Coupons & Offers</h1>
          <p>Create and manage discount codes, promotional offers, and sales campaigns.</p>
        </div>
        <button style={{ backgroundColor: '#B91C1C', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-header">Active Coupons</div>
          <div className="stat-value" style={{ color: '#16a34a' }}>{coupons.filter(c => c.status === 'Active').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Total Redeemed</div>
          <div className="stat-value">3,191</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Discount Given</div>
          <div className="stat-value" style={{ color: '#D97706' }}>₹1.2L</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Expired Offers</div>
          <div className="stat-value" style={{ color: '#64748B' }}>{coupons.filter(c => c.status === 'Expired').length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Tag size={20} /> Promo Codes</span>
        </div>

        <table style={{ marginTop: '16px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Coupon Code</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Discount Value</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Conditions</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Usage (Used / Limit)</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Status & Expiry</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon.id}>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', border: '1px dashed #94A3B8', padding: '6px 12px', borderRadius: '6px' }}>
                    <Scissors size={14} color="#64748B" />
                    <span style={{ fontWeight: 700, color: '#1E293B', letterSpacing: '1px' }}>{coupon.code}</span>
                    <button onClick={() => handleCopy(coupon.code)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94A3B8' }} title="Copy Code">
                      {copied === coupon.code ? <CheckCircle2 size={14} color="#16a34a" /> : <Copy size={14} />}
                    </button>
                  </div>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#B91C1C' }}>{coupon.value}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{coupon.type}</div>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', fontSize: '0.85rem', color: '#1A1A2E' }}>
                  Min Purchase: ₹{coupon.minPurchase.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#B91C1C', width: coupon.usageLimit > 0 ? `${(coupon.used / coupon.usageLimit) * 100}%` : '100%' }}></div>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B' }}>{coupon.used} {coupon.usageLimit > 0 ? `/ ${coupon.usageLimit}` : '(Unlimited)'}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{
                    display: 'inline-block', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, marginBottom: '4px',
                    background: coupon.status === 'Active' ? '#DCFCE7' : '#F1F5F9',
                    color: coupon.status === 'Active' ? '#166534' : '#64748B'
                  }}>{coupon.status}</span>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Exp: {coupon.expiry}</div>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button title="Edit" style={{ background: '#F1F5F9', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#64748B' }}><Edit2 size={14} /></button>
                    <button title="Delete" style={{ background: '#FEE2E2', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#B91C1C' }}><Trash2 size={14} /></button>
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
