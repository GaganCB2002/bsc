import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, CheckCircle, XCircle } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt: string;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  validFrom: string;
  validTo: string;
  active: boolean;
  applicableCategories: string[];
}

const initialCoupons: Coupon[] = [
  { id: '1', code: 'WELCOME15', description: 'Welcome discount for new customers', discountType: 'percentage', discountValue: 15, minOrder: 1000, maxUses: 500, usedCount: 187, active: true, expiresAt: '2026-12-31' },
  { id: '2', code: 'DIWALI20', description: 'Diwali festive season special', discountType: 'percentage', discountValue: 20, minOrder: 5000, maxUses: 200, usedCount: 142, active: true, expiresAt: '2026-11-15' },
  { id: '3', code: 'FLAT500', description: 'Flat ₹500 off on orders above ₹3000', discountType: 'fixed', discountValue: 500, minOrder: 3000, maxUses: 100, usedCount: 34, active: true, expiresAt: '2026-10-31' },
  { id: '4', code: 'FREESHIP', description: 'Free shipping on all orders', discountType: 'fixed', discountValue: 0, minOrder: 0, maxUses: 999, usedCount: 89, active: true, expiresAt: '2026-12-31' },
  { id: '5', code: 'SUMMER10', description: 'Summer clearance sale', discountType: 'percentage', discountValue: 10, minOrder: 2000, maxUses: 300, usedCount: 300, active: false, expiresAt: '2026-08-01' },
];

const initialOffers: Offer[] = [
  { id: '1', title: 'Bridal Season Sale', description: 'Up to 25% off on bridal lehengas and sarees', discountPercent: 25, validFrom: '2026-09-01', validTo: '2026-10-31', active: true, applicableCategories: ['Women', 'Lehengas'] },
  { id: '2', title: 'Monsoon Mega Sale', description: 'Flat 30% off on cotton kurtis and casual wear', discountPercent: 30, validFrom: '2026-07-01', validTo: '2026-08-31', active: false, applicableCategories: ['Women', 'Men'] },
  { id: '3', title: 'New Arrival Launch', description: '15% off on first purchase of new arrivals', discountPercent: 15, validFrom: '2026-09-15', validTo: '2026-10-15', active: true, applicableCategories: ['New Arrivals'] },
  { id: '4', title: 'Festive Collection Offer', description: '20% off on silk sarees and traditional wear', discountPercent: 20, validFrom: '2026-11-01', validTo: '2026-11-30', active: true, applicableCategories: ['Women', 'Sarees'] },
];

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [activeTab, setActiveTab] = useState<'coupons' | 'offers'>('coupons');
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [newCoupon, setNewCoupon] = useState({ code: '', description: '', discountType: 'percentage' as 'percentage' | 'fixed', discountValue: 0, minOrder: 0, maxUses: 100, expiresAt: '2026-12-31' });
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [newOffer, setNewOffer] = useState({ title: '', description: '', discountPercent: 10, validFrom: '', validTo: '', applicableCategories: 'Women' });

  useEffect(() => {
    document.title = 'Coupons & Offers - BSC Exclusive Admin';
  }, []);

  const toggleCoupon = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const saveCoupon = () => {
    if (editingCoupon) {
      setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? { ...c, ...newCoupon } : c));
    } else {
      setCoupons(prev => [...prev, { ...newCoupon, id: String(Date.now()), usedCount: 0, active: true }]);
    }
    setShowModal(false);
    setEditingCoupon(null);
    setNewCoupon({ code: '', description: '', discountType: 'percentage', discountValue: 0, minOrder: 0, maxUses: 100, expiresAt: '2026-12-31' });
  };

  const editCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setNewCoupon({ code: coupon.code, description: coupon.description, discountType: coupon.discountType, discountValue: coupon.discountValue, minOrder: coupon.minOrder, maxUses: coupon.maxUses, expiresAt: coupon.expiresAt });
    setShowModal(true);
  };

  const toggleOffer = (id: string) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o));
  };

  const deleteOffer = (id: string) => {
    setOffers(prev => prev.filter(o => o.id !== id));
  };

  const saveOffer = () => {
    setOffers(prev => [...prev, { ...newOffer, id: String(Date.now()), active: true, applicableCategories: [newOffer.applicableCategories] }]);
    setShowOfferModal(false);
    setNewOffer({ title: '', description: '', discountPercent: 10, validFrom: '', validTo: '', applicableCategories: 'Women' });
  };

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem' };
  const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: 600 as const, marginBottom: '8px', color: '#1E293B' };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Coupons & Offers</h1>
          <p>Manage discount codes, promotional offers, and seasonal campaigns.</p>
        </div>
        <button onClick={() => activeTab === 'coupons' ? setShowModal(true) : setShowOfferModal(true)} style={{
          backgroundColor: '#B91C1C', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <Plus size={18} /> {activeTab === 'coupons' ? 'New Coupon' : 'New Offer'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: '2px solid #E2E8F0', paddingBottom: '0' }}>
        <button onClick={() => setActiveTab('coupons')} style={{ padding: '12px 4px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: activeTab === 'coupons' ? 600 : 400, color: activeTab === 'coupons' ? '#B91C1C' : '#64748B', borderBottom: activeTab === 'coupons' ? '2px solid #B91C1C' : '2px solid transparent', marginBottom: '-2px' }}>
          Discount Coupons ({coupons.length})
        </button>
        <button onClick={() => setActiveTab('offers')} style={{ padding: '12px 4px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: activeTab === 'offers' ? 600 : 400, color: activeTab === 'offers' ? '#B91C1C' : '#64748B', borderBottom: activeTab === 'offers' ? '2px solid #B91C1C' : '2px solid transparent', marginBottom: '-2px' }}>
          Promotional Offers ({offers.length})
        </button>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-header">Active Coupons</div>
          <div className="stat-value">{coupons.filter(c => c.active).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Total Redemptions</div>
          <div className="stat-value">{coupons.reduce((sum, c) => sum + c.usedCount, 0)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Active Offers</div>
          <div className="stat-value">{offers.filter(o => o.active).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Revenue Impact</div>
          <div className="stat-value" style={{ color: '#16a34a' }}>+18.4%</div>
        </div>
      </div>

      {activeTab === 'coupons' ? (
        <div className="card">
          <div className="card-title">All Coupons</div>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Usage</th>
                <th>Expires</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id}>
                  <td><span style={{ background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em' }}>{coupon.code}</span></td>
                  <td style={{ color: '#64748B', fontSize: '0.85rem' }}>{coupon.description}</td>
                  <td style={{ fontWeight: 600 }}>{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</td>
                  <td>₹{coupon.minOrder.toLocaleString('en-IN')}</td>
                  <td><span style={{ color: coupon.usedCount >= coupon.maxUses ? '#B91C1C' : '#16a34a', fontWeight: 600 }}>{coupon.usedCount}</span> / {coupon.maxUses}</td>
                  <td style={{ fontSize: '0.85rem', color: '#64748B' }}>{coupon.expiresAt}</td>
                  <td>
                    <span onClick={() => toggleCoupon(coupon.id)} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: coupon.active ? '#DCFCE7' : '#F1F5F9', color: coupon.active ? '#166534' : '#64748B' }}>
                      {coupon.active ? <><CheckCircle size={14} /> Active</> : <><XCircle size={14} /> Inactive</>}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => editCoupon(coupon)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}><Edit3 size={16} /></button>
                      <button onClick={() => deleteCoupon(coupon.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B91C1C', padding: '4px' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card">
          <div className="card-title">Promotional Offers</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '16px' }}>
            {offers.map(offer => (
              <div key={offer.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>{offer.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748B' }}>{offer.description}</p>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: '#B91C1C', color: '#fff' }}>
                    {offer.discountPercent}% OFF
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '0.8rem', color: '#64748B' }}>
                  <span>From: {offer.validFrom}</span>
                  <span>To: {offer.validTo}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {offer.applicableCategories.map(cat => (
                    <span key={cat} style={{ background: '#F1F5F9', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', color: '#64748B' }}>{cat}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span onClick={() => toggleOffer(offer.id)} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: offer.active ? '#DCFCE7' : '#F1F5F9', color: offer.active ? '#166534' : '#64748B' }}>
                    {offer.active ? <><CheckCircle size={14} /> Active</> : <><XCircle size={14} /> Inactive</>}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ background: '#F1F5F9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Edit</button>
                    <button onClick={() => deleteOffer(offer.id)} style={{ background: '#FEE2E2', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: '#B91C1C' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', width: '500px', maxHeight: '80vh', overflow: 'auto' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px' }}>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><label style={labelStyle}>Coupon Code</label><input style={inputStyle} value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} placeholder="e.g. SAVE20" /></div>
              <div><label style={labelStyle}>Description</label><input style={inputStyle} value={newCoupon.description} onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })} placeholder="e.g. 20% off on orders above ₹5000" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={labelStyle}>Discount Type</label><select style={inputStyle} value={newCoupon.discountType} onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value as 'percentage' | 'fixed' })}><option value="percentage">Percentage (%)</option><option value="fixed">Fixed Amount (₹)</option></select></div>
                <div><label style={labelStyle}>Discount Value</label><input style={inputStyle} type="number" value={newCoupon.discountValue} onChange={e => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={labelStyle}>Min Order (₹)</label><input style={inputStyle} type="number" value={newCoupon.minOrder} onChange={e => setNewCoupon({ ...newCoupon, minOrder: Number(e.target.value) })} /></div>
                <div><label style={labelStyle}>Max Uses</label><input style={inputStyle} type="number" value={newCoupon.maxUses} onChange={e => setNewCoupon({ ...newCoupon, maxUses: Number(e.target.value) })} /></div>
              </div>
              <div><label style={labelStyle}>Expiry Date</label><input style={inputStyle} type="date" value={newCoupon.expiresAt} onChange={e => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })} /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => { setShowModal(false); setEditingCoupon(null); }} style={{ padding: '10px 20px', background: '#F1F5F9', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveCoupon} style={{ padding: '10px 20px', background: '#B91C1C', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>{editingCoupon ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}

      {showOfferModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', width: '500px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px' }}>Create New Offer</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><label style={labelStyle}>Offer Title</label><input style={inputStyle} value={newOffer.title} onChange={e => setNewOffer({ ...newOffer, title: e.target.value })} placeholder="e.g. Diwali Sale" /></div>
              <div><label style={labelStyle}>Description</label><input style={inputStyle} value={newOffer.description} onChange={e => setNewOffer({ ...newOffer, description: e.target.value })} placeholder="e.g. Up to 30% off on all products" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={labelStyle}>Discount %</label><input style={inputStyle} type="number" value={newOffer.discountPercent} onChange={e => setNewOffer({ ...newOffer, discountPercent: Number(e.target.value) })} /></div>
                <div><label style={labelStyle}>Category</label><select style={inputStyle} value={newOffer.applicableCategories} onChange={e => setNewOffer({ ...newOffer, applicableCategories: e.target.value })}><option>Women</option><option>Men</option><option>New Arrivals</option><option>All</option></select></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={labelStyle}>Valid From</label><input style={inputStyle} type="date" value={newOffer.validFrom} onChange={e => setNewOffer({ ...newOffer, validFrom: e.target.value })} /></div>
                <div><label style={labelStyle}>Valid To</label><input style={inputStyle} type="date" value={newOffer.validTo} onChange={e => setNewOffer({ ...newOffer, validTo: e.target.value })} /></div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setShowOfferModal(false)} style={{ padding: '10px 20px', background: '#F1F5F9', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveOffer} style={{ padding: '10px 20px', background: '#B91C1C', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Create Offer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
