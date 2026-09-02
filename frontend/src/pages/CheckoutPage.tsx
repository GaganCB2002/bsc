import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { useCart } from '../context/CartContext';
import { showToast } from '../components/Toast';
import { CreditCard, Smartphone, QrCode, Banknote, ChevronRight, Check, Copy, ShieldCheck, Loader2, Tag, X, Ticket, Gift, Download, FileText } from 'lucide-react';

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
  const [animPhase, setAnimPhase] = useState<'idle' | 'coin' | 'verifying' | 'receipt' | 'done'>('idle');
  const receiptRef = useRef<HTMLDivElement>(null);

  const sparkles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      top: `${20 + (((i * 17 + 7) % 60))}%`,
      left: `${10 + (((i * 23 + 3) % 80))}%`,
      duration: `${0.8 + (((i * 11) % 40)) / 100}s`,
      delay: `${i * 0.08}s`,
      color: ['#F59E0B', '#B91C1C', '#16a34a', '#3b82f6'][i % 4],
    })),
    []);

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
      setAnimPhase('coin');
      setTimeout(() => setAnimPhase('verifying'), 1500);
      setTimeout(() => {
        setAnimPhase('receipt');
        clearCart();
        showToast('success', `Order confirmed! Payment ID: ${paymentId}`);
      }, 3500);
      setTimeout(() => setAnimPhase('done'), 5000);
      setStep('success');
      return;
    }
    if (!verifyInput.trim()) {
      showToast('error', 'Please enter the UPI Transaction ID or Reference Number');
      return;
    }
    setAnimPhase('coin');
    setTimeout(() => setAnimPhase('verifying'), 1500);
    setTimeout(() => {
      setAnimPhase('receipt');
      clearCart();
      showToast('success', `Payment verified! Order confirmed: ${paymentId}`);
    }, 3500);
    setTimeout(() => setAnimPhase('done'), 5000);
    setStep('success');
  };

  const printReceipt = () => {
    window.print();
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
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '48px', textAlign: 'center', overflow: 'hidden', position: 'relative' }}>

            {/* Phase 1: Coin Spin Animation */}
            {animPhase === 'coin' && (
              <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                <div className="coin-container" style={{ width: '120px', height: '120px', margin: '0 auto 32px', perspective: '600px' }}>
                  <div className="coin" style={{
                    width: '120px', height: '120px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #F59E0B 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(245,158,11,0.4), inset 0 -4px 8px rgba(0,0,0,0.1)',
                    animation: 'coinSpin 1.5s ease-in-out', position: 'relative',
                    border: '4px solid #FCD34D'
                  }}>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: '#92400E', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>₹</span>
                    <div style={{ position: 'absolute', inset: '6px', borderRadius: '50%', border: '2px dashed rgba(146,64,14,0.3)' }} />
                  </div>
                </div>
                <div className="sparkle-container" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                  {sparkles.map((s, i) => (
                    <div key={i} className="sparkle" style={{
                      position: 'absolute', width: '6px', height: '6px', borderRadius: '50%',
                      background: s.color, top: s.top, left: s.left,
                      animation: `sparkle ${s.duration} ease ${s.delay} forwards`, opacity: 0
                    }} />
                  ))}
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>Processing Payment</h2>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Please wait while we confirm your payment...</p>
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '4px' }}>
                  {[0,1,2].map(i => <div key={i} className="bounce-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#B91C1C', animation: `bounce 1.2s ease ${i * 0.15}s infinite` }} />)}
                </div>
              </div>
            )}

            {/* Phase 2: Payment Verifying */}
            {animPhase === 'verifying' && (
              <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                <div style={{ width: '100px', height: '100px', margin: '0 auto 32px', position: 'relative' }}>
                  <div style={{
                    width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #E2E8F0',
                    position: 'relative', overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      border: '4px solid transparent', borderTopColor: '#16a34a',
                      animation: 'spin 1s linear infinite'
                    }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldCheck size={36} color="#16a34a" className="pulse-icon" />
                    </div>
                  </div>
                  <div className="ripple" style={{
                    position: 'absolute', inset: '-10px', borderRadius: '50%', border: '2px solid #16a34a',
                    animation: 'ripple 1.5s ease-out infinite', opacity: 0
                  }} />
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>Verifying Payment</h2>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Checking payment ID: <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#B91C1C' }}>{paymentId}</span></p>
                <div style={{ marginTop: '20px', padding: '12px 20px', background: '#F0FDF4', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #BBF7D0' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', animation: 'pulse 1.5s ease infinite' }} />
                  <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 500 }}>Secure verification in progress...</span>
                </div>
              </div>
            )}

            {/* Phase 3: Receipt */}
            {animPhase === 'receipt' && (
              <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                <div ref={receiptRef} className="receipt-container" style={{
                  maxWidth: '380px', margin: '0 auto', background: '#fff', borderRadius: '16px',
                  border: '2px dashed #E2E8F0', padding: '32px 24px', textAlign: 'left',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)', position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '20px', background: '#F8FAFC', borderRadius: '0 0 20px 20px', border: '2px dashed #E2E8F0', borderTop: 'none' }} />
                  <div style={{ position: 'absolute', bottom: '-1px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '20px', background: '#F8FAFC', borderRadius: '20px 20px 0 0', border: '2px dashed #E2E8F0', borderBottom: 'none' }} />

                  <div style={{ textAlign: 'center', marginBottom: '20px', paddingTop: '8px' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B91C1C', marginBottom: '4px' }}>BSC Exclusive</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>Payment Receipt</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>

                  <div style={{ borderTop: '2px dashed #E2E8F0', margin: '0 -24px', padding: '0 24px' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Payment ID</span>
                      <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 700, color: '#B91C1C' }}>{paymentId}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Payment Method</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B' }}>{selectedMethod === 'cod' ? 'Cash on Delivery' : selectedMethod === 'upi' ? 'UPI Pay' : selectedMethod === 'qr' ? 'QR Code' : 'Razorpay'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Items</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B' }}>{totalItems}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Subtotal</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1E293B' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    {discount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.8rem', color: '#16a34a' }}>Discount ({appliedCoupon?.code})</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#16a34a' }}>-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Shipping</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 500, color: effectiveShipping === 0 ? '#16a34a' : '#1E293B' }}>{effectiveShipping === 0 ? 'Free' : `₹${shipping}`}</span>
                    </div>
                  </div>

                  <div style={{ borderTop: '2px dashed #E2E8F0', margin: '0 -24px', padding: '0 24px' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', padding: '12px', background: '#FEF3C7', borderRadius: '10px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>Total Paid</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#B91C1C' }}>₹{total.toLocaleString('en-IN')}</span>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '20px', padding: '10px', background: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                    <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>✓ Payment Verified & Confirmed</span>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.7rem', color: '#94A3B8' }}>
                    This is a digitally generated receipt.<br />Thank you for shopping with BSC Exclusive!
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
                  <button onClick={printReceipt} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 24px', background: '#B91C1C', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <Download size={16} /> Download Receipt
                  </button>
                  <Link to="/dashboard/orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 24px', background: '#F1F5F9', color: '#1E293B', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' }}>
                    <FileText size={16} /> View Orders
                  </Link>
                </div>
              </div>
            )}

            {/* Phase 4: Done - Final */}
            {animPhase === 'done' && (
              <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: 'scaleIn 0.4s ease' }}>
                  <Check size={40} color="#16A34A" strokeWidth={3} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '8px' }}>Order Confirmed!</h2>
                <p style={{ color: '#64748B', marginBottom: '16px', fontSize: '0.9rem' }}>Your order has been placed successfully. We'll send you tracking details soon.</p>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '16px', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Payment ID:</span>
                  <span style={{ fontWeight: 700, color: '#B91C1C', fontSize: '0.95rem', fontFamily: 'monospace' }}>{paymentId}</span>
                  <button onClick={copyPaymentId} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#16A34A' : '#64748B' }}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={printReceipt} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 28px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <Download size={16} /> Download Receipt
                  </button>
                  <Link to="/dashboard/orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 28px', background: '#B91C1C', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' }}>
                    <FileText size={16} /> View Orders
                  </Link>
                  <Link to="/" style={{ padding: '12px 28px', background: '#F1F5F9', color: '#1A1A2E', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' }}>Continue Shopping</Link>
                </div>
              </div>
            )}
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

      <style>{`
        @keyframes coinSpin {
          0% { transform: rotateY(0deg) scale(0.5); opacity: 0; }
          30% { transform: rotateY(180deg) scale(1.2); opacity: 1; }
          60% { transform: rotateY(360deg) scale(1); }
          80% { transform: rotateY(360deg) scale(1.05); }
          100% { transform: rotateY(360deg) scale(1); }
        }
        @keyframes sparkle {
          0% { opacity: 0; transform: scale(0) translateY(0); }
          50% { opacity: 1; transform: scale(1.5) translateY(-20px); }
          100% { opacity: 0; transform: scale(0) translateY(-40px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-12px); }
        }
        @keyframes scaleIn {
          from { transform: scale(0) rotate(-45deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pulse-icon { animation: pulse 1.5s ease infinite; }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
          * { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}