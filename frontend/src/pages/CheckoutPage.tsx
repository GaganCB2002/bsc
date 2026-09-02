import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { useCart } from '../context/CartContext';
import { showToast } from '../components/Toast';
import { CreditCard, Smartphone, QrCode, Banknote, ChevronRight, Check, Copy, ShieldCheck, Loader2, Tag, X, Ticket, Gift } from 'lucide-react';

type PaymentMethod = 'razorpay' | 'upi' | 'qr' | 'cod';
type CheckoutStep = 'payment' | 'verify' | 'success';

interface Coupon {
  code: string;
  type: 'percent' | 'flat' | 'freeship';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  description: string;
  expires: string;
  active: boolean;
}

const availableCoupons: Coupon[] = [
  { code: 'WELCOME20', type: 'percent', value: 20, minOrder: 1999, maxDiscount: 2000, description: '20% off for new customers', expires: 'Sep 30, 2026', active: true },
  { code: 'BSC500', type: 'flat', value: 500, minOrder: 5000, description: 'Flat ₹500 off on orders above ₹5,000', expires: 'Oct 15, 2026', active: true },
  { code: 'FESTIVE30', type: 'percent', value: 30, minOrder: 3000, maxDiscount: 5000, description: '30% off on festive collection', expires: 'Nov 30, 2026', active: true },
  { code: 'FREEDEL', type: 'freeship', value: 0, minOrder: 0, description: 'Free delivery on all orders', expires: 'Sep 15, 2026', active: true },
  { code: 'BRIDE10', type: 'percent', value: 10, minOrder: 10000, maxDiscount: 3000, description: '10% off on bridal collection', expires: 'Dec 31, 2026', active: true },
  { code: 'BSC2026', type: 'percent', value: 15, minOrder: 2500, maxDiscount: 3000, description: '15% off anniversary special', expires: 'Oct 31, 2026', active: true },
  { code: 'FLAT1000', type: 'flat', value: 1000, minOrder: 8000, description: 'Flat ₹1000 off on orders above ₹8,000', expires: 'Nov 15, 2026', active: true },
  { code: 'FIRSTRIDER', type: 'percent', value: 25, minOrder: 1500, maxDiscount: 1500, description: '25% off for first-time buyers', expires: 'Oct 31, 2026', active: true },
];

function calculateDiscount(coupon: Coupon, subtotal: number): number {
  if (subtotal < coupon.minOrder) return 0;
  if (coupon.type === 'percent') {
    const disc = Math.round(subtotal * coupon.value / 100);
    return coupon.maxDiscount ? Math.min(disc, coupon.maxDiscount) : disc;
  }
  if (coupon.type === 'flat') return coupon.value;
  return 0;
}

function generatePaymentId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BSC-${ts}-${rand}`;
}

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('razorpay');
  const [step, setStep] = useState<CheckoutStep>('payment');
  const [paymentId, setPaymentId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [verifyInput, setVerifyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [showCouponList, setShowCouponList] = useState(false);

  // Auto-apply best coupon on first render via lazy state init
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    let bestCoupon: Coupon | null = null;
    let bestDiscount = 0;
    for (const coupon of availableCoupons) {
      if (!coupon.active) continue;
      const disc = coupon.type === 'freeship' ? 99 : calculateDiscount(coupon, totalPrice);
      if (disc > bestDiscount) { bestDiscount = disc; bestCoupon = coupon; }
    }
    if (bestCoupon) {
      setTimeout(() => {
        const disc = bestCoupon!.type === 'freeship' ? 0 : calculateDiscount(bestCoupon!, totalPrice);
        if (disc > 0) showToast('success', `Auto-applied "${bestCoupon!.code}" — you save ₹${disc.toLocaleString('en-IN')}!`);
        else showToast('success', `Auto-applied "FREEDEL" — Free delivery!`);
      }, 300);
    }
    return bestCoupon;
  });

  const shipping = totalPrice >= 5000 ? 0 : 99;
  const freeShippingFromCoupon = appliedCoupon?.type === 'freeship';
  const effectiveShipping = (shipping === 0 || freeShippingFromCoupon) ? 0 : shipping;
  const discount = appliedCoupon ? calculateDiscount(appliedCoupon, totalPrice) : 0;
  const total = totalPrice + effectiveShipping - discount;

  useEffect(() => {
    document.title = 'Checkout - BSC Exclusive';
    if (items.length === 0 && step !== 'success') {
      navigate('/cart');
    }
  }, [items.length, navigate, step]);

  const handlePlaceOrder = () => {
    const id = generatePaymentId();
    setPaymentId(id);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('verify');
    }, 1500);
  };

  const handleVerifyPayment = () => {
    if (selectedMethod === 'cod') {
      setStep('success');
      clearCart();
      showToast('success', `Order placed! Payment ID: ${paymentId}`);
      return;
    }
    if (!verifyInput.trim()) {
      showToast('error', 'Please enter the UPI Transaction ID or Reference Number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      clearCart();
      showToast('success', `Payment verified! Order confirmed: ${paymentId}`);
    }, 2000);
  };

  const copyPaymentId = () => {
    navigator.clipboard.writeText(paymentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const coupon = availableCoupons.find(c => c.code === code && c.active);
    if (!coupon) { showToast('error', 'Invalid coupon code'); return; }
    if (totalPrice < coupon.minOrder) {
      showToast('error', `Minimum order ₹${coupon.minOrder.toLocaleString('en-IN')} required for "${code}"`);
      return;
    }
    setAppliedCoupon(coupon);
    setCouponInput('');
    setShowCouponList(false);
    const disc = coupon.type === 'freeship' ? 0 : calculateDiscount(coupon, totalPrice);
    showToast('success', `Coupon "${code}" applied! ${coupon.type === 'freeship' ? 'Free delivery!' : `You save ₹${disc.toLocaleString('en-IN')}`}`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast('info', 'Coupon removed');
  };

  const handleSelectCoupon = (coupon: Coupon) => {
    if (totalPrice < coupon.minOrder) {
      showToast('error', `Minimum order ₹${coupon.minOrder.toLocaleString('en-IN')} required`);
      return;
    }
    setAppliedCoupon(coupon);
    setShowCouponList(false);
    const disc = coupon.type === 'freeship' ? 0 : calculateDiscount(coupon, totalPrice);
    showToast('success', `Coupon "${coupon.code}" applied! ${coupon.type === 'freeship' ? 'Free delivery!' : `You save ₹${disc.toLocaleString('en-IN')}`}`);
  };

  if (items.length === 0 && step !== 'success') return null;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <PublicHeader />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1E3A8A', border: '1px solid rgba(30,58,138,0.3)', padding: '4px 14px', marginBottom: '12px' }}>Checkout</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 300, color: '#1A1A2E', margin: 0 }}>Secure <span style={{ fontWeight: 700, color: '#B91C1C' }}>Checkout</span></h1>
        </div>

        {step === 'success' ? (
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Check size={40} color="#16A34A" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '8px' }}>Order Confirmed!</h2>
            <p style={{ color: '#64748B', marginBottom: '16px' }}>Your order has been placed successfully.</p>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '16px', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Payment ID:</span>
              <span style={{ fontWeight: 700, color: '#B91C1C', fontSize: '0.95rem' }}>{paymentId}</span>
              <button onClick={copyPaymentId} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#16A34A' : '#64748B' }}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/dashboard/orders" style={{ padding: '12px 28px', background: '#B91C1C', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' }}>View Orders</Link>
              <Link to="/" style={{ padding: '12px 28px', background: '#F1F5F9', color: '#1A1A2E', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Continue Shopping</Link>
            </div>
          </div>
        ) : step === 'verify' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#16A34A" /> Verify Payment
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
                {selectedMethod === 'cod' ? 'Confirm your Cash on Delivery order.' : 'Enter the UPI Transaction ID from your payment app to confirm.'}
              </p>

              {selectedMethod !== 'cod' && (
                <>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {selectedMethod === 'upi' ? 'Send Payment To' : 'Scan QR & Pay'}
                    </div>
                    {selectedMethod === 'upi' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ flex: 1, padding: '12px 16px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 600, color: '#1A1A2E' }}>
                          bscexclusive@upi
                        </div>
                        <button onClick={() => { navigator.clipboard.writeText('bscexclusive@upi'); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ padding: '10px', background: '#FEE2E2', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#B91C1C' }}>
                          {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '20px', background: '#fff', border: '2px dashed #E2E8F0', borderRadius: '10px' }}>
                        <QrCode size={120} color="#1A1A2E" style={{ margin: '0 auto 8px' }} />
                        <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Scan with any UPI app</p>
                      </div>
                    )}
                    <div style={{ marginTop: '12px', padding: '10px 16px', background: '#FEF3C7', borderRadius: '8px', fontSize: '0.8rem', color: '#92400E', fontWeight: 500 }}>
                      Pay exactly ₹{total.toLocaleString('en-IN')} — no more, no less
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>UPI Transaction ID / Reference Number</label>
                    <input
                      value={verifyInput}
                      onChange={(e) => setVerifyInput(e.target.value)}
                      placeholder="e.g. 412345678901"
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'monospace' }}
                    />
                    <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>Find this in your UPI app under transaction history</p>
                  </div>
                </>
              )}

              {selectedMethod === 'cod' && (
                <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
                  <p style={{ fontSize: '0.85rem', color: '#92400E', fontWeight: 500 }}>
                    You will pay ₹{total.toLocaleString('en-IN')} upon delivery. Please keep the exact change ready.
                  </p>
                </div>
              )}

              <button onClick={handleVerifyPayment} disabled={loading} style={{ width: '100%', padding: '14px', background: '#16A34A', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? <><Loader2 size={18} className="spin" /> Verifying...</> : <><Check size={18} /> {selectedMethod === 'cod' ? 'Confirm Order' : 'Verify & Confirm'}</>}
              </button>
            </div>

            <div>
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '16px' }}>Order Summary</h4>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '4px' }}>Payment ID</div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#B91C1C', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {paymentId}
                    <button onClick={copyPaymentId} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#16A34A' : '#94A3B8' }}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '4px' }}>Items: {totalItems}</div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#16A34A', marginBottom: '4px', fontWeight: 600 }}>
                    <span>Coupon ({appliedCoupon?.code})</span><span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1A1A2E' }}>
                  <span>Total</span>
                  <span style={{ color: '#B91C1C' }}>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '20px' }}>Select Payment Method</h3>

              {[
                { id: 'razorpay' as PaymentMethod, icon: <CreditCard size={22} />, label: 'Razorpay', desc: 'Credit Cards, Debit Cards, NetBanking', color: '#1E3A8A' },
                { id: 'upi' as PaymentMethod, icon: <Smartphone size={22} />, label: 'UPI Pay', desc: 'GPay, PhonePe, Paytm, BHIM', color: '#16A34A' },
                { id: 'qr' as PaymentMethod, icon: <QrCode size={22} />, label: 'QR Code', desc: 'Scan and pay via any UPI app', color: '#EA580C' },
                { id: 'cod' as PaymentMethod, icon: <Banknote size={22} />, label: 'Cash on Delivery', desc: 'Pay when you receive your order', color: '#1A1A2E' },
              ].map(m => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  style={{
                    border: selectedMethod === m.id ? `2px solid ${m.color}` : '1px solid #E2E8F0',
                    borderRadius: '12px', padding: '18px 20px', marginBottom: '12px',
                    display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer',
                    background: selectedMethod === m.id ? `${m.color}08` : '#fff',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color }}>
                    {m.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1A1A2E' }}>{m.label}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{m.desc}</div>
                  </div>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: selectedMethod === m.id ? `2px solid ${m.color}` : '2px solid #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedMethod === m.id && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: m.color }} />}
                  </div>
                </div>
              ))}

              {selectedMethod === 'upi' && (
                <div style={{ marginTop: '8px', marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>Your UPI ID (optional)</label>
                  <input
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>
              )}

              <button onClick={handlePlaceOrder} disabled={loading} style={{ width: '100%', padding: '14px', marginTop: '16px', background: '#B91C1C', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? <><Loader2 size={18} className="spin" /> Processing...</> : <>Place Order — ₹{total.toLocaleString('en-IN')} <ChevronRight size={18} /></>}
              </button>
            </div>

            <div>
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '16px' }}>Order Summary ({totalItems} items)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {items.map(item => (
                    <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', background: '#F1F5F9', flexShrink: 0, overflow: 'hidden', borderRadius: '4px' }}>
                        <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#1A1A2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Qty: {item.quantity}</div>
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1A1A2E' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>

                {/* Coupon Section */}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <Ticket size={16} color="#B91C1C" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1A1A2E' }}>Apply Coupon</span>
                  </div>
                  {appliedCoupon ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tag size={14} color="#16A34A" />
                        <div>
                          <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#16A34A', fontFamily: 'monospace' }}>{appliedCoupon.code}</span>
                          <span style={{ fontSize: '0.7rem', color: '#64748B', marginLeft: '6px' }}>
                            {appliedCoupon.type === 'freeship' ? 'Free delivery' : `₹${discount} off`}
                          </span>
                        </div>
                      </div>
                      <button onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '2px' }}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          placeholder="Enter coupon code"
                          style={{ flex: 1, padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'monospace', textTransform: 'uppercase' }}
                        />
                        <button onClick={handleApplyCoupon} style={{ padding: '10px 16px', background: '#B91C1C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                          Apply
                        </button>
                      </div>
                      <button onClick={() => setShowCouponList(!showCouponList)} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#B91C1C', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'inherit', padding: 0 }}>
                        <Gift size={12} /> View available coupons ({availableCoupons.length})
                      </button>
                      {showCouponList && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: '280px', overflowY: 'auto', marginTop: '4px' }}>
                          {availableCoupons.filter(c => c.active).map(coupon => {
                            const eligible = totalPrice >= coupon.minOrder;
                            const disc = coupon.type === 'freeship' ? 0 : calculateDiscount(coupon, totalPrice);
                            return (
                              <div key={coupon.code} onClick={() => eligible && handleSelectCoupon(coupon)} style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9', cursor: eligible ? 'pointer' : 'not-allowed', opacity: eligible ? 1 : 0.5, transition: 'background 0.15s' }}
                                onMouseEnter={(e) => { if (eligible) e.currentTarget.style.background = '#F8FAFC'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                  <span style={{ fontWeight: 700, fontSize: '0.8rem', fontFamily: 'monospace', color: '#1A1A2E' }}>{coupon.code}</span>
                                  <span style={{ fontSize: '0.7rem', color: '#B91C1C', fontWeight: 600 }}>
                                    {coupon.type === 'freeship' ? 'FREE DEL' : disc > 0 ? `₹${disc} OFF` : `${coupon.value}% OFF`}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{coupon.description}</div>
                                <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '2px' }}>
                                  {!eligible ? `Min order ₹${coupon.minOrder.toLocaleString('en-IN')}` : `Expires ${coupon.expires}`}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748B', marginBottom: '6px' }}>
                    <span>Subtotal</span><span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748B', marginBottom: '6px' }}>
                    <span>Shipping</span><span>{effectiveShipping === 0 ? <span style={{ color: '#16A34A', fontWeight: 600 }}>Free</span> : `₹${shipping}`}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#16A34A', marginBottom: '6px', fontWeight: 600 }}>
                      <span>Coupon Discount</span><span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div style={{ padding: '6px 10px', background: '#F0FDF4', borderRadius: '6px', fontSize: '0.7rem', color: '#16A34A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={12} /> Best coupon auto-applied for maximum savings
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, color: '#1A1A2E', marginTop: '8px', borderTop: '1px solid #E2E8F0', paddingTop: '8px' }}>
                    <span>Total</span><span style={{ color: '#B91C1C' }}>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ textAlign: 'center', marginTop: '8px', padding: '6px', background: '#FEF3C7', borderRadius: '6px', fontSize: '0.75rem', color: '#92400E', fontWeight: 600 }}>
                      You are saving ₹{discount.toLocaleString('en-IN')} on this order!
                    </div>
                  )}
                </div>
              </div>
              <div style={{ marginTop: '16px', padding: '16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="#16A34A" />
                <span style={{ fontSize: '0.8rem', color: '#166534' }}>All payments are encrypted and secure</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}