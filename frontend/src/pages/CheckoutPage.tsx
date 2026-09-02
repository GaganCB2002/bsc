import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { useCart } from '../context/CartContext';
import { showToast } from '../components/Toast';
import { CreditCard, Smartphone, QrCode, Banknote, ChevronRight, Check, Copy, ShieldCheck, Loader2 } from 'lucide-react';

type PaymentMethod = 'razorpay' | 'upi' | 'qr' | 'cod';
type CheckoutStep = 'payment' | 'verify' | 'success';

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

  const shipping = totalPrice >= 5000 ? 0 : 99;
  const total = totalPrice + shipping;

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
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748B', marginBottom: '6px' }}>
                    <span>Subtotal</span><span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748B', marginBottom: '6px' }}>
                    <span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, color: '#1A1A2E', marginTop: '8px' }}>
                    <span>Total</span><span style={{ color: '#B91C1C' }}>₹{total.toLocaleString('en-IN')}</span>
                  </div>
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