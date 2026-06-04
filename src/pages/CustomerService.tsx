import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import StoreLocator from '../components/StoreLocator';
import { Truck, RotateCcw, Ruler, WashingMachine, HelpCircle, ChevronRight, Clock, Shield, MapPin, Phone, Mail, Navigation } from 'lucide-react';
import './LandingPage.css';

const sections = [
  { id: 'shipping', icon: Truck, label: 'Shipping & Delivery' },
  { id: 'returns', icon: RotateCcw, label: 'Returns & Exchanges' },
  { id: 'size-guide', icon: Ruler, label: 'Size Guide' },
  { id: 'care', icon: WashingMachine, label: 'Care Instructions' },
  { id: 'faq', icon: HelpCircle, label: 'FAQs' },
];

const faqData = [
  { q: 'How do I place an order?', a: 'Browse our collection, select your desired product, choose size and quantity, and proceed to checkout. You can order as a guest or create an account for faster future purchases.' },
  { q: 'Can I modify or cancel my order?', a: 'Orders can be modified or cancelled within 2 hours of placement. Please contact our customer service team immediately with your order ID for assistance.' },
  { q: 'How do I track my order?', a: 'Once your order ships, you will receive an email and SMS with tracking details. You can also track your order by logging into your account and visiting the Order History section.' },
  { q: 'Do you offer gift wrapping?', a: 'Yes, we offer complimentary gift wrapping for all orders above ₹8,000. You can add a personalized message during checkout.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI (GPay, PhonePe, Paytm), Net Banking, and Cash on Delivery for orders up to ₹25,000.' },
  { q: 'How do I contact customer support?', a: 'You can reach us via phone at +91 98765 43210, email at hello@bschannabasappa.com, or use the live chat feature on our website. We are available 10 AM to 8 PM IST, Monday to Saturday.' },
];

export default function CustomerService() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [showStores, setShowStores] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('shipping');

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        setExpandedSection(id);
        const el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    const els = document.querySelectorAll('.reveal');
    els.forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    document.title = 'Customer Service - BS Channabasappa';
  }, []);

  return (
    <div className="lp-page" style={{ minHeight: '100vh' }}>
      <PublicHeader />

      <section style={{ background: '#2C2826', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div className="container">
          <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4A574', border: '1px solid rgba(201,168,76,0.3)', padding: '4px 14px', marginBottom: '16px' }}>Customer Service</span>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 300, color: '#fff', marginBottom: '12px' }}>We're Here to <span style={{ fontWeight: 700, color: '#D4A574' }}>Help</span></h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', maxWidth: '520px', margin: '0 auto' }}>Everything you need to know about your order, from delivery to care instructions.</p>
        </div>
      </section>

      <div className="container" style={{ display: 'flex', gap: '48px', padding: '60px 24px', flexWrap: 'wrap' }}>
        {/* Sidebar */}
        <nav style={{ flex: '0 0 240px', position: 'sticky', top: '100px', alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {sections.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => { e.preventDefault(); toggleSection(s.id); window.location.hash = s.id; }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
                color: expandedSection === s.id ? '#C47A6A' : '#8A7A6A', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500,
                borderLeft: expandedSection === s.id ? '2.5px solid #C47A6A' : '2.5px solid transparent', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#C47A6A'; e.currentTarget.style.borderLeftColor = '#C47A6A'; }}
              onMouseLeave={(e) => { if (expandedSection !== s.id) { e.currentTarget.style.color = '#8A7A6A'; e.currentTarget.style.borderLeftColor = 'transparent'; } }}
            >
              <s.icon size={16} /> {s.label}
            </a>
          ))}
          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #E8E0D6' }}>
            <Link to="/" style={{ color: '#C47A6A', fontSize: '0.82rem', textDecoration: 'none' }}>← Back to Home</Link>
          </div>
        </nav>

        {/* Main Content */}
        <div style={{ flex: '1', minWidth: '0' }}>
          {/* Shipping & Delivery */}
          <section id="shipping" style={{ marginBottom: '40px', border: '1px solid #E8E0D6', background: '#fff' }}>
            <div
              onClick={() => toggleSection('shipping')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 24px', cursor: 'pointer', userSelect: 'none', background: expandedSection === 'shipping' ? '#F5E6D3' : '#FDF8F3', transition: 'background 0.2s' }}
            >
              <div style={{ width: '48px', height: '48px', background: '#F5E6D3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Truck size={22} color="#C47A6A" /></div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#2C2826', flex: 1 }}>Shipping & <span style={{ fontWeight: 600, color: '#C47A6A' }}>Delivery</span></h2>
              <ChevronRight size={18} color="#8A7A6A" style={{ transform: expandedSection === 'shipping' ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }} />
            </div>
            <div style={{ overflow: 'hidden', maxHeight: expandedSection === 'shipping' ? '1200px' : '0px', transition: 'max-height 0.4s ease' }}>
              <div style={{ padding: '24px', borderTop: '1px solid #E8E0D6' }}>
                <div className="reveal" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '32px' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <p style={{ fontSize: '0.9rem', color: '#8A7A6A', lineHeight: 1.7, marginBottom: '20px' }}>We offer reliable shipping across India and select international destinations. Every order is carefully packed in premium fabric pouches to ensure your silk reaches you in pristine condition.</p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ background: '#F5E6D3', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 500, color: '#2C2826' }}><Clock size={14} color="#C47A6A" /> 3-5 Business Days</div>
                      <div style={{ background: '#F5E6D3', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 500, color: '#2C2826' }}><Shield size={14} color="#C47A6A" /> Free above ₹5,000</div>
                    </div>
                  </div>
                  <div style={{ flex: '1 1 280px' }}>
                    <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600&h=400" alt="Shipping" style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }} />
                  </div>
                </div>
                <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {[
                    { title: 'Standard Delivery', time: '3-5 business days', cost: 'Free (orders above ₹5,000)', note: '₹99 for orders below ₹5,000' },
                    { title: 'Express Delivery', time: '1-2 business days', cost: '₹199 flat', note: 'Available for metro cities' },
                    { title: 'International Shipping', time: '7-14 business days', cost: '$15 USD flat', note: 'Free on orders above $200' },
                    { title: 'Store Pickup', time: 'Within 24 hours', cost: 'Free', note: 'Available at Gandhi Bazaar store' },
                  ].map((item, i) => (
                    <div key={i} style={{ background: '#FDF8F3', border: '1px solid #E8E0D6', padding: '20px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2C2826', marginBottom: '8px' }}>{item.title}</h4>
                      <div style={{ fontSize: '0.78rem', color: '#8A7A6A', marginBottom: '4px' }}><Clock size={12} /> {item.time}</div>
                      <div style={{ fontSize: '0.78rem', color: '#C47A6A', fontWeight: 600 }}>{item.cost}</div>
                      <div style={{ fontSize: '0.7rem', color: '#A89888', marginTop: '4px' }}>{item.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Returns & Exchanges */}
          <section id="returns" style={{ marginBottom: '40px', border: '1px solid #E8E0D6', background: '#fff' }}>
            <div
              onClick={() => toggleSection('returns')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 24px', cursor: 'pointer', userSelect: 'none', background: expandedSection === 'returns' ? '#F5E6D3' : '#FDF8F3', transition: 'background 0.2s' }}
            >
              <div style={{ width: '48px', height: '48px', background: '#F5E6D3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><RotateCcw size={22} color="#C47A6A" /></div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#2C2826', flex: 1 }}>Returns & <span style={{ fontWeight: 600, color: '#C47A6A' }}>Exchanges</span></h2>
              <ChevronRight size={18} color="#8A7A6A" style={{ transform: expandedSection === 'returns' ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }} />
            </div>
            <div style={{ overflow: 'hidden', maxHeight: expandedSection === 'returns' ? '1200px' : '0px', transition: 'max-height 0.4s ease' }}>
              <div style={{ padding: '24px', borderTop: '1px solid #E8E0D6' }}>
                <div className="reveal" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '32px' }}>
                  <div style={{ flex: '1 1 280px' }}>
                    <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600&h=400" alt="Returns" style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ flex: '1 1 300px' }}>
                    <p style={{ fontSize: '0.9rem', color: '#8A7A6A', lineHeight: 1.7, marginBottom: '20px' }}>We want you to love your purchase. If something isn't perfect, we offer hassle-free returns and exchanges within 30 days of delivery.</p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ background: '#F5E6D3', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 500, color: '#2C2826' }}><RotateCcw size={14} color="#C47A6A" /> 30-Day Returns</div>
                      <div style={{ background: '#F5E6D3', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 500, color: '#2C2826' }}><Shield size={14} color="#C47A6A" /> Free Exchange</div>
                    </div>
                  </div>
                </div>
                <div className="reveal" style={{ background: '#FDF8F3', border: '1px solid #E8E0D6', padding: '32px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#2C2826', marginBottom: '16px' }}>Return Policy</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem', color: '#8A7A6A', lineHeight: 1.7 }}>
                    {[
                      'Items must be unused, unworn, and in original condition with all tags attached.',
                      'Silk sarees, lehengas, and other fabric items must not be washed, altered, or damaged.',
                      'Return requests must be initiated within 30 days of delivery via your account or by contacting support.',
                      'Once approved, you will receive a return label via email. Drop the package at any partner courier location.',
                      'Refunds are processed within 5-7 business days after we receive and inspect the returned item.',
                      'Exchanges are free of charge. If the exchanged item costs more, the difference will be charged; if less, the difference will be refunded.',
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ color: '#C47A6A', fontWeight: 700, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}.</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Size Guide */}
          <section id="size-guide" style={{ marginBottom: '40px', border: '1px solid #E8E0D6', background: '#fff' }}>
            <div
              onClick={() => toggleSection('size-guide')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 24px', cursor: 'pointer', userSelect: 'none', background: expandedSection === 'size-guide' ? '#F5E6D3' : '#FDF8F3', transition: 'background 0.2s' }}
            >
              <div style={{ width: '48px', height: '48px', background: '#F5E6D3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Ruler size={22} color="#C47A6A" /></div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#2C2826', flex: 1 }}>Size <span style={{ fontWeight: 600, color: '#C47A6A' }}>Guide</span></h2>
              <ChevronRight size={18} color="#8A7A6A" style={{ transform: expandedSection === 'size-guide' ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }} />
            </div>
            <div style={{ overflow: 'hidden', maxHeight: expandedSection === 'size-guide' ? '2000px' : '0px', transition: 'max-height 0.4s ease' }}>
              <div style={{ padding: '24px', borderTop: '1px solid #E8E0D6' }}>
                <div className="reveal" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '32px' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <p style={{ fontSize: '0.9rem', color: '#8A7A6A', lineHeight: 1.7, marginBottom: '20px' }}>Find your perfect fit with our detailed size guide. Measurements are in inches. For custom tailoring, please contact our team.</p>
                  </div>
                  <div style={{ flex: '1 1 280px' }}>
                    <img src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=600&h=400" alt="Size Guide" style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }} />
                  </div>
                </div>
                <div className="reveal" style={{ overflowX: 'auto' }}>
                  <h3 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#2C2826', marginBottom: '16px' }}>Women's Saree & Ethnic Wear</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '32px' }}>
                    <thead>
                      <tr style={{ background: '#2C2826', color: '#fff' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>Size</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>Bust (in)</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>Waist (in)</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>Hip (in)</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>Saree Length (m)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { size: 'XS', bust: '30-32', waist: '24-26', hip: '34-36', length: '5.5' },
                        { size: 'S', bust: '32-34', waist: '26-28', hip: '36-38', length: '5.5' },
                        { size: 'M', bust: '34-36', waist: '28-30', hip: '38-40', length: '5.5' },
                        { size: 'L', bust: '36-39', waist: '30-33', hip: '40-43', length: '5.5' },
                        { size: 'XL', bust: '39-42', waist: '33-36', hip: '43-46', length: '6' },
                        { size: 'XXL', bust: '42-45', waist: '36-39', hip: '46-49', length: '6' },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #E8E0D6', background: i % 2 === 0 ? '#FDF8F3' : '#fff' }}>
                          <td style={{ padding: '10px 16px', fontWeight: 600, color: '#2C2826' }}>{row.size}</td>
                          <td style={{ padding: '10px 16px', color: '#8A7A6A' }}>{row.bust}</td>
                          <td style={{ padding: '10px 16px', color: '#8A7A6A' }}>{row.waist}</td>
                          <td style={{ padding: '10px 16px', color: '#8A7A6A' }}>{row.hip}</td>
                          <td style={{ padding: '10px 16px', color: '#8A7A6A' }}>{row.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h3 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#2C2826', marginBottom: '16px' }}>Men's Kurta & Sherwani</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: '#2C2826', color: '#fff' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>Size</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>Chest (in)</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>Waist (in)</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>Length (in)</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>Shoulder (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { size: 'S', chest: '36-38', waist: '30-32', length: '44', shoulder: '17' },
                        { size: 'M', chest: '38-40', waist: '32-34', length: '45', shoulder: '18' },
                        { size: 'L', chest: '40-42', waist: '34-36', length: '46', shoulder: '19' },
                        { size: 'XL', chest: '42-44', waist: '36-38', length: '47', shoulder: '20' },
                        { size: 'XXL', chest: '44-46', waist: '38-40', length: '48', shoulder: '21' },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #E8E0D6', background: i % 2 === 0 ? '#FDF8F3' : '#fff' }}>
                          <td style={{ padding: '10px 16px', fontWeight: 600, color: '#2C2826' }}>{row.size}</td>
                          <td style={{ padding: '10px 16px', color: '#8A7A6A' }}>{row.chest}</td>
                          <td style={{ padding: '10px 16px', color: '#8A7A6A' }}>{row.waist}</td>
                          <td style={{ padding: '10px 16px', color: '#8A7A6A' }}>{row.length}</td>
                          <td style={{ padding: '10px 16px', color: '#8A7A6A' }}>{row.shoulder}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p style={{ fontSize: '0.75rem', color: '#A89888', marginTop: '16px' }}>Measurements may vary slightly due to the handcrafted nature of our products. For custom sizing, please contact our team.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Care Instructions */}
          <section id="care" style={{ marginBottom: '40px', border: '1px solid #E8E0D6', background: '#fff' }}>
            <div
              onClick={() => toggleSection('care')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 24px', cursor: 'pointer', userSelect: 'none', background: expandedSection === 'care' ? '#F5E6D3' : '#FDF8F3', transition: 'background 0.2s' }}
            >
              <div style={{ width: '48px', height: '48px', background: '#F5E6D3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><WashingMachine size={22} color="#C47A6A" /></div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#2C2826', flex: 1 }}>Care <span style={{ fontWeight: 600, color: '#C47A6A' }}>Instructions</span></h2>
              <ChevronRight size={18} color="#8A7A6A" style={{ transform: expandedSection === 'care' ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }} />
            </div>
            <div style={{ overflow: 'hidden', maxHeight: expandedSection === 'care' ? '1200px' : '0px', transition: 'max-height 0.4s ease' }}>
              <div style={{ padding: '24px', borderTop: '1px solid #E8E0D6' }}>
                <div className="reveal" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '32px' }}>
                  <div style={{ flex: '1 1 280px' }}>
                    <img src="https://images.unsplash.com/photo-1545179605-12c3c105f98e?auto=format&fit=crop&q=80&w=600&h=400" alt="Care Instructions" style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ flex: '1 1 300px' }}>
                    <p style={{ fontSize: '0.9rem', color: '#8A7A6A', lineHeight: 1.7 }}>Proper care ensures your silk and ethnic wear remain beautiful for generations. Follow these simple guidelines to preserve the fabric, color, and zari work.</p>
                  </div>
                </div>
                <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  {[
                    { title: 'Dry Clean Only', desc: 'All silk sarees, lehengas, and sherwanis must be dry cleaned only. Machine or hand washing can damage the delicate fabric and zari work.', icon: '🧼' },
                    { title: 'Store in Muslin', desc: 'Wrap your silk in a muslin or cotton cloth before storing. Avoid plastic covers as they trap moisture and can cause discoloration.', icon: '📦' },
                    { title: 'Avoid Direct Sunlight', desc: 'Dry your silk garments in shade. Direct sunlight can fade the rich colors over time.', icon: '☀️' },
                    { title: 'Iron on Low Heat', desc: 'Always iron silk on the reverse side at low temperature. Use a cotton cloth as a protective layer between the iron and the fabric.', icon: '🔥' },
                    { title: 'Keep Away from Perfume', desc: 'Apply perfume, deodorant, and hairspray before wearing your silk. Direct contact with chemicals can stain or damage the fabric.', icon: '🧴' },
                    { title: 'Fold, Don\'t Hang', desc: 'Heavy silk sarees and garments should be folded rather than hung to prevent stretching and distortion of the fabric.', icon: '👗' },
                  ].map((item, i) => (
                    <div key={i} style={{ background: '#FDF8F3', border: '1px solid #E8E0D6', padding: '24px' }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{item.icon}</div>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#2C2826', marginBottom: '8px' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#8A7A6A', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section id="faq" style={{ marginBottom: '40px', border: '1px solid #E8E0D6', background: '#fff' }}>
            <div
              onClick={() => toggleSection('faq')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 24px', cursor: 'pointer', userSelect: 'none', background: expandedSection === 'faq' ? '#F5E6D3' : '#FDF8F3', transition: 'background 0.2s' }}
            >
              <div style={{ width: '48px', height: '48px', background: '#F5E6D3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><HelpCircle size={22} color="#C47A6A" /></div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 500, color: '#2C2826', flex: 1 }}>Frequently Asked <span style={{ fontWeight: 600, color: '#C47A6A' }}>Questions</span></h2>
              <ChevronRight size={18} color="#8A7A6A" style={{ transform: expandedSection === 'faq' ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }} />
            </div>
            <div style={{ overflow: 'hidden', maxHeight: expandedSection === 'faq' ? '2000px' : '0px', transition: 'max-height 0.4s ease' }}>
              <div style={{ padding: '24px', borderTop: '1px solid #E8E0D6' }}>
                <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {faqData.map((item, i) => (
                    <details key={i} style={{ background: '#FDF8F3', border: '1px solid #E8E0D6', cursor: 'pointer' }}>
                      <summary style={{ padding: '18px 24px', fontSize: '0.88rem', fontWeight: 600, color: '#2C2826', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {item.q}
                        <ChevronRight size={16} style={{ transition: 'transform 0.2s' }} />
                      </summary>
                      <div style={{ padding: '0 24px 18px', fontSize: '0.85rem', color: '#8A7A6A', lineHeight: 1.7 }}>{item.a}</div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section style={{ marginTop: '60px', padding: '32px', background: '#2C2826', color: '#fff' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Still have questions?</h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '24px', lineHeight: 1.6 }}>Our customer service team is available Monday to Saturday, 10 AM to 8 PM IST.</p>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                <Phone size={16} color="#D4A574" /> +91 98765 43210
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                <Mail size={16} color="#D4A574" /> hello@bschannabasappa.com
              </div>
              <button
                onClick={() => setShowStores(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
              >
                <MapPin size={16} color="#D4A574" /> Davangere — P.B. Road
              </button>
              <button
                onClick={() => setShowStores(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
              >
                <MapPin size={16} color="#D4A574" /> Gandhi Bazaar, Bangalore
              </button>
            </div>
            <button
              onClick={() => setShowStores(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px',
                padding: '10px 20px', background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'inherit'
              }}
            >
              <Navigation size={14} /> View All Store Locations
            </button>
          </section>

          {showStores && <StoreLocator onClose={() => setShowStores(false)} />}
        </div>
      </div>
    </div>
  );
}
