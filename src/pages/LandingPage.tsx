import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, ChevronRight, Star, MapPin, Phone, Mail, Globe, Award, Shield, Truck, Leaf, Navigation } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import { useCart } from '../context/CartContext';
import StoreLocator from '../components/StoreLocator';
import './LandingPage.css';

const collections = [
  { title: 'Bridal Silk Collection', desc: 'Exquisite handwoven silks for your special day', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800' },
  { title: 'Kanchipuram Silks', desc: 'Authentic silk sarees with pure zari work', image: 'https://images.unsplash.com/photo-1771654099745-73a4a4d09bcd?auto=format&fit=crop&q=80&w=800' },
  { title: 'Designer Partywear', desc: 'Contemporary designs with traditional elegance', image: 'https://images.unsplash.com/photo-1771654805161-442c6aab7b55?auto=format&fit=crop&q=80&w=800' },
];

const testimonials = [
  { name: 'Ananya Sharma', text: 'The finest Kanchipuram silk I have ever owned. The craftsmanship is absolutely breathtaking.', role: 'Loyal Customer' },
  { name: 'Priya Patel', text: 'BS Channabasappa has been our family\'s go-to for wedding sarees for generations. Unmatched quality.', role: 'Bridal Client' },
  { name: 'Rajesh Verma', text: 'The attention to detail and the richness of the fabrics are truly world-class.', role: 'Premium Member' },
];

const modules = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,avif}', { eager: true });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const heroImages = Object.values(modules).map((mod: any) => mod.default);

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { totalItems } = useCart();
  const [showStores, setShowStores] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(timer);
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
    document.title = 'BS Channabasappa Silks & Sarees - Since 1938';
  }, []);

  return (
    <div className="lp-page">
      <header className={`lp-header${scrolled ? ' scrolled' : ''}`}>
        <div className="lp-header-inner">
          <Link to="/" className="lp-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <BrandLogo size={48} variant="gold" />
            <div>
              <span className="lp-logo-text" style={{ fontSize: '0.72rem', opacity: 1, margin: 0, lineHeight: 1.2 }}>Channabasappa</span>
              <div style={{ fontSize: '0.5rem', color: 'inherit', opacity: 0.6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Silks &amp; Sarees</div>
            </div>
          </Link>
          <nav className="lp-nav">
            <Link to="/category/new-arrivals">New Arrivals</Link>
            <Link to="/category/women">Women</Link>
            <Link to="/category/men">Men</Link>
            <Link to="/category/kids">Kids</Link>
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="lp-header-actions">
            <Link to="/category/new-arrivals?search=1" className="lp-icon-btn" aria-label="Search"><Search size={18} /></Link>
            <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }} className="lp-icon-btn" aria-label="Cart">
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: '-2px', right: '-2px', background: '#C47A6A', color: '#fff',
                  fontSize: '0.55rem', fontWeight: 700, width: '15px', height: '15px',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{totalItems}</span>
              )}
            </Link>
            <Link to="/login" className="lp-btn-outline lp-btn-sm">Sign In</Link>
            <button className="lp-menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Menu"><Menu size={24} /></button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="lp-mobile-menu">
          <div className="lp-mobile-header">
            <span className="lp-logo-icon">B<span className="lp-logo-accent">S</span></span>
            <button onClick={() => setMenuOpen(false)} aria-label="Close"><X size={24} /></button>
          </div>
          <nav className="lp-mobile-nav">
            <Link to="/category/new-arrivals" onClick={() => setMenuOpen(false)}>New Arrivals</Link>
            <Link to="/category/women" onClick={() => setMenuOpen(false)}>Women</Link>
            <Link to="/category/men" onClick={() => setMenuOpen(false)}>Men</Link>
            <Link to="/category/kids" onClick={() => setMenuOpen(false)}>Kids</Link>
            <a href="#about" onClick={() => setMenuOpen(false)}>About Us</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
          <div className="lp-mobile-actions">
            <Link to="/login" className="lp-btn-primary" onClick={() => setMenuOpen(false)}>Sign In</Link>
          </div>
        </div>
      )}

      <section className="lp-hero">
        {heroImages.map((img, i) => (
          <div
            key={i}
            className={`lp-hero-bg${i === slideIndex ? ' active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="lp-hero-overlay" />
        <div className="lp-hero-content">
          <div className="lp-hero-badge reveal">Since 1938</div>
          <h1 className="lp-hero-title reveal">
            BS <span className="lp-hero-highlight">Channabasappa</span>
            <span className="lp-hero-highlight">Silks &amp; Sarees</span>
          </h1>
          <p className="lp-hero-desc reveal">
            Authentic handloom silk sarees and traditional ethnic wear — crafted by master weavers and cherished by connoisseurs for four generations.
          </p>
          <div className="lp-hero-buttons reveal">
            <Link to="/category/new-arrivals" className="lp-btn-primary lp-btn-lg">
              Explore Collection <ChevronRight size={16} />
            </Link>
            <a href="#legacy" className="lp-btn-outline lp-btn-light lp-btn-lg">
              Our Legacy
            </a>
          </div>
          <div className="lp-hero-stats reveal">
            <div className="lp-stat">
              <span className="lp-stat-num">4+</span>
              <span className="lp-stat-label">Generations</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-num">10K+</span>
              <span className="lp-stat-label">Happy Patrons</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-num">500+</span>
              <span className="lp-stat-label">Designs</span>
            </div>
          </div>
          <div className="lp-hero-dots">
            {heroImages.map((_, i) => (
              <button
                key={i}
                className={`lp-hero-dot${i === slideIndex ? ' active' : ''}`}
                onClick={() => setSlideIndex(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="lp-about" id="about">
        <div className="container">
          <div className="lp-about-grid">
            <div className="lp-about-image reveal">
              <div className="lp-about-img-wrap">
                <img src="https://images.unsplash.com/photo-1771507056578-f9675a2a8f8a?auto=format&fit=crop&q=80&w=800" alt="Our craftsmanship" />
              </div>
              <div className="lp-about-badge"><Award size={20} /><span>Since 1938</span></div>
            </div>
            <div className="lp-about-text reveal">
              <span className="lp-section-tag">About Us</span>
              <h2>Preserving the Art of <span className="lp-text-accent">Handloom Silk</span> Since 1938</h2>
              <p>For over eight decades, BS Channabasappa Silks & Sarees has been synonymous with authentic South Indian handloom traditions. Based in the heart of Karnataka, we source directly from master weavers in Kanchipuram, Banaras, and Dharmavaram.</p>
              <p>Every piece in our collection tells a story of heritage — from the careful selection of raw silk threads to the intricate handwoven zari work perfected over centuries.</p>
              <div className="lp-values">
                <div className="lp-value"><Shield size={18} /><span>100% Authentic Silk</span></div>
                <div className="lp-value"><Award size={18} /><span>Certified Craftsmanship</span></div>
                <div className="lp-value"><Truck size={18} /><span>Pan-India Delivery</span></div>
                <div className="lp-value"><Leaf size={18} /><span>Eco-Friendly Dyes</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-collections">
        <div className="container">
          <div className="lp-section-head reveal">
            <span className="lp-section-tag">Collections</span>
            <h2>Curated for Every Occasion</h2>
            <p>From bridal trousseau to everyday elegance</p>
          </div>
          <div className="lp-collection-grid">
            {collections.map((col, i) => (
              <div className="lp-collection-card reveal" key={i}>
                <div className="lp-collection-img">
                  <img src={col.image} alt={col.title} />
                  <div className="lp-collection-overlay">
                    <Link to="/category/women" className="lp-collection-link">Explore <ChevronRight size={14} /></Link>
                  </div>
                </div>
                <h3>{col.title}</h3>
                <p>{col.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-legacy" id="legacy">
        <div className="container">
          <div className="lp-legacy-grid">
            <div className="lp-legacy-text reveal">
              <span className="lp-section-tag">Our Heritage</span>
              <h2>The Art Behind <span className="lp-text-accent">Every Thread</span></h2>
              <p>Each silk saree at BS Channabasappa passes through the hands of skilled artisans who have inherited centuries-old weaving techniques. From the dyeing of raw silk to the final finishing touches, every step is a testament to India's rich handloom heritage.</p>
              <p>Founded in 1938 by Sri Basavaraj Channabasappa, our journey began in a small weaving unit in Kanchipuram with just four handlooms. Today, we collaborate with over 200 master weavers across Karnataka, Tamil Nadu, and Uttar Pradesh, preserving the art of handloom silk weaving for future generations.</p>
              <ul className="lp-legacy-list">
                <li><span className="lp-legacy-dot" />Pure mulberry silk sourced from Karnataka's Sericulture belt</li>
                <li><span className="lp-legacy-dot" />Authentic Kanchipuram zari woven with real silver thread dipped in gold</li>
                <li><span className="lp-legacy-dot" />Natural azo-free dyes for lasting vibrancy and skin safety</li>
                <li><span className="lp-legacy-dot" />Handwoven by master craftsmen with 30+ years of experience</li>
                <li><span className="lp-legacy-dot" />Each saree takes 15–25 days of meticulous handwork to complete</li>
                <li><span className="lp-legacy-dot" />GI-tagged authentic Kanchipuram silk from certified weavers</li>
              </ul>
              <div style={{ display: 'flex', gap: '24px', marginTop: '32px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px', background: '#F5E6D3' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: '#C47A6A' }}>1938</span>
                  <span style={{ fontSize: '0.65rem', color: '#8A7A6A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Founded</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px', background: '#F5E6D3' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: '#C47A6A' }}>200+</span>
                  <span style={{ fontSize: '0.65rem', color: '#8A7A6A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Master Weavers</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px', background: '#F5E6D3' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: '#C47A6A' }}>10K+</span>
                  <span style={{ fontSize: '0.65rem', color: '#8A7A6A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sarees Yearly</span>
                </div>
              </div>
            </div>
            <div className="lp-legacy-image reveal">
              <div className="lp-legacy-img-wrap">
                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800" alt="Handloom weaving" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-testimonials">
        <div className="container">
          <div className="lp-section-head reveal">
            <span className="lp-section-tag">Testimonials</span>
            <h2>What Our Patrons Say</h2>
          </div>
          <div className="lp-testimonial-grid">
            {testimonials.map((t, i) => (
              <div className="lp-testimonial-card reveal" key={i}>
                <div className="lp-testimonial-stars">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#D4A574" color="#D4A574" />)}
                </div>
                <p>"{t.text}"</p>
                <div className="lp-testimonial-author">
                  <div className="lp-testimonial-avatar">{t.name.charAt(0)}</div>
                  <div><strong>{t.name}</strong><span>{t.role}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-newsletter" id="contact">
        <div className="container">
          <div className="lp-newsletter-content reveal">
            <h2>Stay Connected</h2>
            <p>Be the first to know about new collections, exclusive offers, and weaving traditions.</p>
            <form className="lp-newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="lp-btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="container">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <Link to="/" className="lp-logo" style={{ gap: '10px', marginBottom: '12px' }}>
                <span className="lp-logo-icon" style={{ fontSize: '1.6rem', color: '#D4A574' }}>B<span style={{ color: '#fff' }}>S</span></span>
                <div>
                  <span className="lp-logo-text" style={{ fontSize: '0.8rem', opacity: 1, color: '#fff', margin: 0, lineHeight: 1.2 }}>Channabasappa</span>
                  <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Silks &amp; Sarees</div>
                </div>
              </Link>
              <p>India's premier destination for authentic handloom silk sarees and traditional ethnic wear, serving connoisseurs of fine craftsmanship since 1938.</p>
              <div className="lp-social">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Globe size={18} /></a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Globe size={18} /></a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Globe size={18} /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Globe size={18} /></a>
              </div>
            </div>
            <div className="lp-footer-col">
              <h4>Shop</h4>
              <ul>
                <li><Link to="/category/women">Women's Silk</Link></li>
                <li><Link to="/category/men">Men's Wear</Link></li>
                <li><Link to="/category/kids">Kids' Collection</Link></li>
                <li><Link to="/category/new-arrivals">New Arrivals</Link></li>
                <li><Link to="/category/collections">Special Collections</Link></li>
              </ul>
            </div>
            <div className="lp-footer-col">
                <h4>Customer Service</h4>
              <ul>
                <li><a href="/customer-service#shipping">Shipping & Delivery</a></li>
                <li><a href="/customer-service#returns">Returns & Exchanges</a></li>
                <li><a href="/customer-service#size-guide">Size Guide</a></li>
                <li><a href="/customer-service#care">Care Instructions</a></li>
                <li><a href="/customer-service#faq">FAQs</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Visit Our Stores</h4>
              <ul className="lp-contact-list">
                <li>
                  <button
                    onClick={() => setShowStores(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit', fontFamily: 'inherit', fontSize: '0.82rem', textAlign: 'left' }}
                  >
                    <MapPin size={14} /> Davangere — P.B. Road
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowStores(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit', fontFamily: 'inherit', fontSize: '0.82rem', textAlign: 'left' }}
                  >
                    <MapPin size={14} /> Gandhi Bazaar, Bangalore
                  </button>
                </li>
                <li><Phone size={14} /><span>+91 98765 43210</span></li>
                <li><Mail size={14} /><span>hello@bschannabasappa.com</span></li>
              </ul>
              <button
                onClick={() => setShowStores(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px',
                  padding: '10px 18px', background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  fontFamily: 'inherit', transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
              >
                <Navigation size={14} /> View All Stores
              </button>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <p>&copy; {new Date().getFullYear()} BS Channabasappa Silks & Sarees. All Rights Reserved.</p>
            <div className="lp-footer-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {showStores && <StoreLocator onClose={() => setShowStores(false)} />}
    </div>
  );
}
