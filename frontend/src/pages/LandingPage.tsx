import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, ChevronRight, Star, MapPin, Phone, Mail, Award, Shield, Truck, Leaf, Navigation, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductsByCategory, getProductsByTag, type Product } from '../data/mockProducts';
import StoreLocator from '../components/StoreLocator';
import Chatbot from '../components/Chatbot';
import CookieConsent from '../components/CookieConsent';
import './LandingPage.css';

const featuredProducts = [
  { id: 'w-1', title: 'Royal Crimson Kanchipuram Silk Saree', category: 'Handloom Silk', price: '₹45,000', rating: 4.9, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600', badge: 'New Arrival' },
  { id: 'w-2', title: 'Golden Zari Banarasi Brocade Saree', category: 'Banarasi Heritage', price: '₹38,500', rating: 4.8, image: 'https://images.unsplash.com/photo-1771654099745-73a4a4d09bcd?auto=format&fit=crop&q=80&w=600', badge: 'Best Seller' },
  { id: 'w-3', title: 'Pure Mulberry Tissue Silk Saree', category: 'Mulberry Special', price: '₹28,900', rating: 4.9, image: 'https://images.unsplash.com/photo-1771654805161-442c6aab7b55?auto=format&fit=crop&q=80&w=600', badge: 'Exclusive' },
  { id: 'w-4', title: 'Emerald Green Temple Border Silk', category: 'Kanchipuram Classic', price: '₹52,000', rating: 5.0, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600', badge: 'Heritage' },
];

const collections = [
  { title: 'Bridal Silk Collection', desc: 'Exquisite handwoven silks for your special day', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800' },
  { title: 'Kanchipuram Silks', desc: 'Authentic silk sarees with pure zari work', image: 'https://images.unsplash.com/photo-1771654099745-73a4a4d09bcd?auto=format&fit=crop&q=80&w=800' },
  { title: 'Designer Partywear', desc: 'Contemporary designs with traditional elegance', image: 'https://images.unsplash.com/photo-1771654805161-442c6aab7b55?auto=format&fit=crop&q=80&w=800' },
];

const testimonials = [
  { name: 'Ananya Sharma', text: 'The finest Kanchipuram silk I have ever owned. The craftsmanship is absolutely breathtaking.', role: 'Loyal Customer' },
  { name: 'Priya Patel', text: 'BSC Exclusive has been our family\'s go-to for wedding sarees for generations. Unmatched quality.', role: 'Bridal Client' },
  { name: 'Rajesh Verma', text: 'The attention to detail and the richness of the fabrics are truly world-class.', role: 'Premium Member' },
];

const modules = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,avif}', { eager: true });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const heroImages = Object.values(modules).map((mod: any) => mod.default);

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #E2E8F0' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '20px 0', background: 'none', border: 'none',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer', textAlign: 'left', gap: '16px'
        }}
      >
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1E293B' }}>{question}</span>
        <span style={{
          width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
          background: open ? '#B91C1C' : '#F1F5F9', color: open ? '#fff' : '#64748B',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem', transition: 'all 0.3s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)'
        }}>+</span>
      </button>
      <div style={{
        maxHeight: open ? '300px' : '0', overflow: 'hidden',
        transition: 'max-height 0.3s ease', paddingBottom: open ? '20px' : '0'
      }}>
        <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.7, margin: 0 }}>{answer}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const newArrivals = useMemo(() => getProductsByCategory('new-arrivals').slice(0, 8), []);
  const bestsellers = useMemo(() => getProductsByCategory('bestsellers').slice(0, 4), []);
  const menCollection = useMemo(() => getProductsByCategory('men').slice(0, 4), []);
  const kidsCollection = useMemo(() => getProductsByCategory('kids').slice(0, 4), []);
  const weddingProducts = useMemo(() => getProductsByTag('wedding').slice(0, 4), []);
  const festiveProducts = useMemo(() => getProductsByTag('festive').slice(0, 4), []);
  const [slideIndex, setSlideIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [showStores, setShowStores] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % (heroImages.length || 1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const els = document.querySelectorAll('.reveal');
    els.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const renderProductGrid = (products: Product[]) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
      {products.map((product) => (
        <div key={product.id} className="reveal" style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #F0EBE5', transition: 'all 0.3s' }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          <div style={{ position: 'relative' }}>
            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
            </Link>
            <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {product.isNew && <span style={{ background: '#16a34a', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700 }}>NEW</span>}
              {product.isBestseller && <span style={{ background: '#B91C1C', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700 }}>BESTSELLER</span>}
              {product.isSale && <span style={{ background: '#f59e0b', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700 }}>SALE</span>}
            </div>
            <button onClick={() => {
              if (isInWishlist(product.id)) { removeFromWishlist(product.id); }
              else { addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category, description: product.description, comparePrice: product.comparePrice }); }
            }} style={{ position: 'absolute', top: '8px', right: '8px', width: '32px', height: '32px', background: '#fff', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <span style={{ color: isInWishlist(product.id) ? '#B91C1C' : '#94A3B8', fontSize: '1rem' }}>{isInWishlist(product.id) ? '♥' : '♡'}</span>
            </button>
          </div>
          <div style={{ padding: '16px' }}>
            <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A89888', fontWeight: 500 }}>{product.subcategory || product.category}</span>
            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', margin: '4px 0', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h4>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < Math.floor(product.rating) ? '#F59E0B' : '#E5E7EB'} color={i < Math.floor(product.rating) ? '#F59E0B' : '#E5E7EB'} />
              ))}
              <span style={{ fontSize: '0.7rem', color: '#94A3B8', marginLeft: '4px' }}>({product.reviews})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: '#B91C1C' }}>₹{product.price.toLocaleString('en-IN')}</span>
              {product.comparePrice && (
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{product.comparePrice.toLocaleString('en-IN')}</span>
              )}
              {product.comparePrice && product.comparePrice > product.price && (
                <span style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 600 }}>{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to={`/product/${product.id}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px', background: '#B91C1C', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}>
                <ShoppingBag size={13} /> View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    document.title = 'BSC Exclusive - Premium Handloom Since 1938';
  }, []);

  return (
    <div className="lp-page">
      <header className={`lp-header${scrolled ? ' scrolled' : ''}`}>
        <div className="lp-header-inner">
          <Link to="/" className="lp-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
              <img src="/bsc-logo.png" alt="BSC Exclusive" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.05em', lineHeight: 1 }}>
                BSC EXCLUSIVE
              </div>
              <div style={{ color: '#1E3A8A', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '2px' }}>
                Since 1938
              </div>
            </div>
          </Link>
          <nav className="lp-nav">
            <Link to="/category/women">Women</Link>
            <Link to="/category/men">Men</Link>
            <Link to="/category/kids">Kids</Link>
            <Link to="/category/new-arrivals">New Arrivals</Link>
            <Link to="/customer-service">Contact</Link>
          </nav>
          <div className="lp-header-actions">
            <Link to="/category/new-arrivals?search=1" className="lp-icon-btn" aria-label="Search"><Search size={18} /></Link>
            <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }} className="lp-icon-btn" aria-label="Cart">
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: '-2px', right: '-2px', background: '#B91C1C', color: '#fff',
                  fontSize: '0.55rem', fontWeight: 700, width: '15px', height: '15px',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{totalItems}</span>
              )}
            </Link>
            {isAuthenticated && user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link
                  to="/dashboard"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none',
                    color: scrolled ? '#1A1A2E' : '#fff', fontSize: '0.8rem', fontWeight: 600,
                    background: scrolled ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.2)',
                    padding: '4px 10px', borderRadius: '16px'
                  }}
                >
                  <User size={14} color={scrolled ? '#B91C1C' : '#E5E7EB'} />
                  <span>{user.name}</span>
                  {user.role === 'admin' && (
                    <span style={{ fontSize: '0.6rem', background: '#1E3A8A', color: '#fff', padding: '1px 5px', borderRadius: '8px', textTransform: 'uppercase' }}>
                      Admin
                    </span>
                  )}
                </Link>
                <button
                  onClick={logout}
                  title="Sign Out"
                  style={{ background: 'none', border: 'none', color: scrolled ? '#666' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="lp-btn-outline lp-btn-sm">Sign In</Link>
            )}
            <button className="lp-menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Menu"><Menu size={24} /></button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="lp-mobile-menu">
          <div className="lp-mobile-header">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <div style={{ background: '#fff', padding: '4px 8px', borderRadius: '50%', overflow: 'hidden', width: '32px', height: '32px', flexShrink: 0 }}>
                <img src="/bsc-logo.png" alt="BSC" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1A1A2E', letterSpacing: '0.04em' }}>BSC EXCLUSIVE</span>
            </Link>
            <button onClick={() => setMenuOpen(false)} aria-label="Close">
              <X size={24} />
            </button>
          </div>
          <nav className="lp-mobile-nav">
            <Link to="/category/women" onClick={() => setMenuOpen(false)}>Women</Link>
            <Link to="/category/men" onClick={() => setMenuOpen(false)}>Men</Link>
            <Link to="/category/kids" onClick={() => setMenuOpen(false)}>Kids</Link>
            <Link to="/category/new-arrivals" onClick={() => setMenuOpen(false)}>New Arrivals</Link>
            <Link to="/customer-service" onClick={() => setMenuOpen(false)}>Contact</Link>
          </nav>          <div className="lp-mobile-actions">
            {isAuthenticated && user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <Link to="/dashboard" className="lp-btn-primary" onClick={() => setMenuOpen(false)}>
                  Go to Dashboard ({user.name})
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="lp-btn-outline" style={{ color: '#fff', borderColor: '#fff' }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" className="lp-btn-primary" onClick={() => setMenuOpen(false)}>Sign In</Link>
            )}
          </div>
        </div>
      )}

      {/* HERO SECTION */}
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
            <span className="lp-hero-highlight">BSC</span> Exclusive
          </h1>
          <p className="lp-hero-desc reveal">
            Authentic handloom silk sarees and traditional ethnic wear — curated from 200+ master weavers across Karnataka, Tamil Nadu, and Uttar Pradesh. Trusted by 10,000+ families since 1938.
          </p>
          <div className="lp-hero-buttons reveal">
            <Link to="/category/new-arrivals" className="lp-btn-primary lp-btn-lg">
              Shop New Arrivals <ChevronRight size={16} />
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

      {/* ABOUT SECTION */}
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
              <p>For over eight decades, BSC Exclusive has been synonymous with authentic South Indian handloom traditions. Based in the heart of Karnataka, we source directly from master weavers in Kanchipuram, Banaras, and Dharmavaram.</p>
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

      {/* FEATURED PRODUCTS & HANDLOOM SHOWCASE SECTION */}
      <section className="lp-collections" style={{ background: '#FAF7F2', padding: '80px 0' }}>
        <div className="container">
          <div className="lp-section-header reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="lp-section-tag">Featured Masterpieces</span>
            <h2>Exclusive <span className="lp-text-accent">Handloom Collections</span></h2>
            <p style={{ maxWidth: '600px', margin: '12px auto 0', color: '#666', fontSize: '0.95rem' }}>
              Explore our handwoven silk sarees crafted by master artisans since 1938.
            </p>
          </div>

          <div className="marquee-container" style={{ marginTop: '32px' }}>
            <div className="marquee-content">
              {/* Duplicate array for seamless infinite scroll loop */}
              {[...featuredProducts, ...featuredProducts].map((product, idx) => (
                <div key={`${product.id}-${idx}`} className="card-3d">
                  <div className="card-3d-inner">
                    <Link to={`/product/${product.id}`} style={{ position: 'relative', height: '260px', overflow: 'hidden', display: 'block' }}>
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{
                        position: 'absolute', top: '14px', left: '14px', background: '#B91C1C', color: '#fff',
                        fontSize: '0.65rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>
                        {product.badge}
                      </span>
                    </Link>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '0.75rem', color: '#1E3A8A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {product.category}
                      </span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1A1A2E', margin: '8px 0', lineHeight: 1.3 }}>
                        {product.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                        <Star size={15} fill="#F59E0B" color="#F59E0B" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1A1A2E' }}>{product.rating}</span>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>(Verified Artisan)</span>
                      </div>
                      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #F1F5F9' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#B91C1C' }}>{product.price}</span>
                        <Link
                          to={`/product/${product.id}`}
                          style={{
                            background: '#1A1A2E', color: '#fff', textDecoration: 'none',
                            padding: '8px 16px', borderRadius: '6px', fontSize: '0.8rem',
                            fontWeight: 600, transition: 'background 0.2s'
                          }}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTIONS SECTION */}
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
                    <Link to={i === 0 ? "/category/women" : i === 1 ? "/category/women" : "/category/men"} className="lp-collection-link">Explore <ChevronRight size={14} /></Link>
                  </div>
                </div>
                <h3>{col.title}</h3>
                <p>{col.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS SECTION */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div className="lp-section-header reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="lp-section-tag">Fresh Collection</span>
            <h2>New <span className="lp-text-accent">Arrivals</span></h2>
            <p style={{ maxWidth: '600px', margin: '12px auto 0', color: '#64748B', fontSize: '0.9rem' }}>
              Discover our latest handloom silk sarees and ethnic wear additions.
            </p>
          </div>
          {renderProductGrid(newArrivals)}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/category/new-arrivals" className="lp-btn-primary">View All New Arrivals</Link>
          </div>
        </div>
      </section>

      {/* MEN'S HERITAGE COLLECTION */}
      <section style={{ padding: '80px 0', background: '#F8FAFC' }}>
        <div className="container">
          <div className="lp-section-header reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="lp-section-tag">For Him</span>
            <h2>Men's <span className="lp-text-accent">Heritage Wear</span></h2>
            <p style={{ maxWidth: '600px', margin: '12px auto 0', color: '#64748B', fontSize: '0.9rem' }}>
              Premium kurtas, sherwanis, and jackets crafted for the modern Indian man.
            </p>
          </div>
          {renderProductGrid(menCollection)}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/category/men" className="lp-btn-primary">Shop Men's Collection</Link>
          </div>
        </div>
      </section>

      {/* KIDS FESTIVE WEAR */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div className="lp-section-header reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="lp-section-tag">Little Royals</span>
            <h2>Kids <span className="lp-text-accent">Festive Wear</span></h2>
            <p style={{ maxWidth: '600px', margin: '12px auto 0', color: '#64748B', fontSize: '0.9rem' }}>
              Adorable, comfortable, and traditional outfits for your little ones.
            </p>
          </div>
          {renderProductGrid(kidsCollection)}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/category/kids" className="lp-btn-primary">Shop Kids Wear</Link>
          </div>
        </div>
      </section>

      {/* BESTSELLERS SECTION */}
      <section style={{ padding: '80px 0', background: '#F8FAFC' }}>
        <div className="container">
          <div className="lp-section-header reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="lp-section-tag">Most Popular</span>
            <h2>Our <span className="lp-text-accent">Bestsellers</span></h2>
            <p style={{ maxWidth: '600px', margin: '12px auto 0', color: '#64748B', fontSize: '0.9rem' }}>
              Loved by thousands of customers across India. These are the pieces everyone is talking about.
            </p>
          </div>
          {renderProductGrid(bestsellers)}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/category/bestsellers" className="lp-btn-primary">View All Bestsellers</Link>
          </div>
        </div>
      </section>

      {/* SHOP BY OCCASION */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div className="lp-section-header reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="lp-section-tag">Shop by Occasion</span>
            <h2>Find the Perfect <span className="lp-text-accent">Look</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { tag: 'wedding', label: 'Wedding', icon: '💍', desc: 'Bridal & trousseau', color: '#B91C1C' },
              { tag: 'festive', label: 'Festive', icon: '🪔', desc: 'Puja & celebrations', color: '#D97706' },
              { tag: 'party', label: 'Party', icon: '✨', desc: 'Cocktail & evening', color: '#7C3AED' },
              { tag: 'casual', label: 'Casual', icon: '🌿', desc: 'Everyday elegance', color: '#059669' },
              { tag: 'office', label: 'Office', icon: '💼', desc: 'Professional wear', color: '#1E3A8A' },
              { tag: 'traditional', label: 'Traditional', icon: '🙏', desc: 'Heritage classics', color: '#9333EA' },
            ].map((occ, i) => (
              <Link key={i} to={`/category/new-arrivals?search=${occ.tag}`} className="reveal" style={{ textDecoration: 'none' }}>
                <div style={{ padding: '28px 20px', background: '#fff', borderRadius: '12px', textAlign: 'center', border: '1px solid #F0EBE5', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = occ.color; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#F0EBE5'; }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '10px' }}>{occ.icon}</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>{occ.label}</h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748B' }}>{occ.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WEDDING & FESTIVE SHOWCASE */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #FDF2F8 0%, #FFF7ED 100%)' }}>
        <div className="container">
          <div className="lp-section-header reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="lp-section-tag">Wedding Season</span>
            <h2>Special <span className="lp-text-accent">Bridal Collection</span></h2>
            <p style={{ maxWidth: '600px', margin: '12px auto 0', color: '#64748B', fontSize: '0.9rem' }}>
              Curated silk sarees and lehengas for the most special day of your life.
            </p>
          </div>
          {renderProductGrid(weddingProducts)}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/category/women" className="lp-btn-primary">Explore Bridal Collection</Link>
          </div>
        </div>
      </section>

      {/* FESTIVE COLLECTION */}
      <section style={{ padding: '80px 0', background: '#FAF7F2' }}>
        <div className="container">
          <div className="lp-section-header reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="lp-section-tag">Festive Special</span>
            <h2>Celebrate in <span className="lp-text-accent">Style</span></h2>
            <p style={{ maxWidth: '600px', margin: '12px auto 0', color: '#64748B', fontSize: '0.9rem' }}>
              Colorful, vibrant outfits perfect for pujas, Diwali, Eid, and every celebration.
            </p>
          </div>
          {renderProductGrid(festiveProducts)}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/category/new-arrivals?search=festive" className="lp-btn-primary">Shop Festive Collection</Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section style={{ padding: '80px 0', background: '#F8FAFC' }}>
        <div className="container">
          <div className="lp-section-header reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="lp-section-tag">Why Choose Us</span>
            <h2>The <span className="lp-text-accent">BSC Exclusive</span> Promise</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { icon: '🏆', title: '100% Authentic Silk', desc: 'GI-tagged genuine silk sourced directly from certified sericulture farms in Karnataka.' },
              { icon: '🤝', title: 'Direct from Weavers', desc: 'No middlemen. We partner with 200+ master weavers across South India.' },
              { icon: '🔒', title: 'Secure Payments', desc: 'UPI, Razorpay, and Cash on Delivery — your money is always safe.' },
              { icon: '🚚', title: 'Pan-India Delivery', desc: 'Free shipping on orders above ₹5,000. Delivered to your doorstep.' },
              { icon: '💎', title: 'Quality Guaranteed', desc: 'Every saree undergoes 6-point quality check before dispatch.' },
              { icon: '↩️', title: 'Easy Returns', desc: '7-day return policy for unused items with original tags.' },
            ].map((item, i) => (
              <div key={i} className="reveal" style={{ padding: '28px 20px', background: '#fff', borderRadius: '12px', textAlign: 'center', border: '1px solid #F0EBE5' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORE LOCATIONS BANNER */}
      <section style={{ padding: '60px 0', background: '#1E293B' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', alignItems: 'center' }}>
            <div className="reveal">
              <span style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Visit Us</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '8px', marginBottom: '12px' }}>Our Physical Stores</h2>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.7 }}>Experience the richness of our handloom collections in person. Visit any of our three showrooms in Karnataka.</p>
            </div>
            {[
              { city: 'Davangere', addr: 'Medical College Road, Davangere - 577004', phone: '+91 8192 272180' },
              { city: 'Belgaum', addr: 'Tilakwadi, Belgaum - 590006', phone: '+91 8192 272180' },
              { city: 'Shivamogga', addr: 'B.H. Road, Shivamogga - 577201', phone: '+91 8192 272180' },
            ].map((store, i) => (
              <div key={i} className="reveal" style={{ padding: '20px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F59E0B', marginBottom: '6px' }}>{store.city}</h3>
                <p style={{ fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px' }}>{store.addr}</p>
                <p style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>{store.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES BANNER */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div className="lp-section-header reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="lp-section-tag">Shop by Category</span>
            <h2>Explore Our <span className="lp-text-accent">Collections</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Women\'s Sarees', link: '/category/women', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600', desc: 'Silk, Cotton, Designer & More' },
              { title: 'Men\'s Ethnic', link: '/category/men', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600', desc: 'Kurtas, Sherwanis & Jackets' },
              { title: 'Kids Wear', link: '/category/kids', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&q=80&w=600', desc: 'Traditional & Festive Collections' },
              { title: 'New Arrivals', link: '/category/new-arrivals', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600', desc: 'Fresh Designs Every Week' },
            ].map((cat, i) => (
              <Link key={i} to={cat.link} className="reveal" style={{ display: 'block', position: 'relative', borderRadius: '12px', overflow: 'hidden', textDecoration: 'none', height: '220px' }}>
                <img src={cat.image} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#fff' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{cat.title}</h3>
                  <p style={{ fontSize: '0.8rem', opacity: 0.85 }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LEGACY SECTION */}
      <section className="lp-legacy" id="legacy">
        <div className="container">
          <div className="lp-legacy-grid">
            <div className="lp-legacy-text reveal">
              <span className="lp-section-tag">Our Heritage</span>
              <h2>The Art Behind <span className="lp-text-accent">Every Thread</span></h2>
              <p>Each silk saree at BSC Exclusive passes through the hands of skilled artisans who have inherited centuries-old weaving techniques. From the dyeing of raw silk to the final finishing touches, every step is a testament to India's rich handloom heritage.</p>
              <p>Founded in 1938, our journey began in a small weaving unit in Kanchipuram with just four handlooms. Today, we collaborate with over 200 master weavers across Karnataka, Tamil Nadu, and Uttar Pradesh, preserving the art of handloom silk weaving for future generations.</p>
              <ul className="lp-legacy-list">
                <li><span className="lp-legacy-dot" />Pure mulberry silk sourced from Karnataka's Sericulture belt</li>
                <li><span className="lp-legacy-dot" />Authentic Kanchipuram zari woven with real silver thread dipped in gold</li>
                <li><span className="lp-legacy-dot" />Natural azo-free dyes for lasting vibrancy and skin safety</li>
                <li><span className="lp-legacy-dot" />Handwoven by master craftsmen with 30+ years of experience</li>
                <li><span className="lp-legacy-dot" />Each saree takes 15–25 days of meticulous handwork to complete</li>
                <li><span className="lp-legacy-dot" />GI-tagged authentic Kanchipuram silk from certified weavers</li>
              </ul>
              <div style={{ display: 'flex', gap: '24px', marginTop: '32px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px', background: '#F1F5F9' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: '#B91C1C' }}>1938</span>
                  <span style={{ fontSize: '0.65rem', color: '#8A7A6A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Founded</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px', background: '#F1F5F9' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: '#B91C1C' }}>200+</span>
                  <span style={{ fontSize: '0.65rem', color: '#8A7A6A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Master Weavers</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px', background: '#F1F5F9' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: '#B91C1C' }}>10K+</span>
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

      {/* TESTIMONIALS SECTION */}
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
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#1E3A8A" color="#1E3A8A" />)}
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

      {/* BRIDAL CONSULTATION CTA */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #B91C1C 0%, #991B1B 50%, #7F1D1D 100%)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px' }}>
            <div className="reveal" style={{ maxWidth: '550px' }}>
              <span style={{ fontSize: '0.7rem', color: '#FCD34D', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Personalized Service</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '8px', marginBottom: '12px', lineHeight: 1.3 }}>Bridal Silk Consultation</h2>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>Planning your wedding? Our expert consultants will help you choose the perfect silk saree for your special day. From Kanchipuram classics to contemporary designer pieces.</p>
            </div>
            <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="tel:+918192272180" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 28px', background: '#fff', color: '#B91C1C', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center' }}>
                📞 Call: +91 8192 272180
              </a>
              <Link to="/customer-service" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 28px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center' }}>
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: '80px 0', background: '#F8FAFC' }}>
        <div className="container">
          <div className="lp-section-header reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="lp-section-tag">FAQ</span>
            <h2>Frequently Asked <span className="lp-text-accent">Questions</span></h2>
            <p style={{ maxWidth: '600px', margin: '12px auto 0', color: '#64748B', fontSize: '0.9rem' }}>
              Everything you need to know about our products, shipping, and policies.
            </p>
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {[
              { q: 'Are your silk sarees authentic?', a: 'Yes, every saree we sell is 100% authentic handloom silk. We source directly from certified weavers in Kanchipuram, Banaras, and Dharmavaram. Each product comes with a GI (Geographical Indication) tag guaranteeing authenticity.' },
              { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days across India. Express shipping (2-3 days) is available for ₹250. Same-day delivery is available in select cities for ₹500. Orders above ₹5,000 qualify for free standard shipping.' },
              { q: 'What is your return policy?', a: 'We offer a 7-day return policy for unused items with original tags intact. If you receive a damaged or incorrect product, we provide a full refund including shipping charges. Contact our support team to initiate a return.' },
              { q: 'How do I know my size?', a: 'Each product page includes a Size Guide link. For sarees, the standard length is 6.3 meters. For kurtas and sherwanis, we recommend measuring your chest and referring to our size chart. Our customer support can also help with sizing queries.' },
              { q: 'Are the colors accurate in the photos?', a: 'We photograph all products under natural lighting to ensure color accuracy. However, slight variations may occur due to screen settings and the handcrafted nature of our products. Each piece is unique.' },
              { q: 'Do you offer bridal consultation?', a: 'Yes! We offer personalized bridal consultation services. Our expert consultants will help you choose the perfect silk saree or lehenga for your special day. Call us at +91 8192 272180 or visit any of our stores to book an appointment.' },
              { q: 'What payment methods do you accept?', a: 'We accept UPI (Google Pay, PhonePe, Paytm), Razorpay (all cards, net banking), and Cash on Delivery (COD). All online payments are secured with industry-standard encryption.' },
              { q: 'Can I visit your physical stores?', a: 'Yes, we have three showrooms in Karnataka — Davangere (Medical College Road), Belgaum (Tilakwadi), and Shivamogga (B.H. Road). Visit us to experience our collections in person. Our staff will be happy to assist you.' },
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="lp-newsletter" id="contact">
        <div className="container">
          <div className="lp-newsletter-content">
            <h2>Stay Connected</h2>
            <p>Be the first to know about new collections, exclusive offers, and weaving traditions.</p>
            {!newsletterSubmitted ? (
              <form className="lp-newsletter-form" onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail && newsletterEmail.includes('@')) {
                  setNewsletterSubmitted(true);
                  setNewsletterEmail('');
                }
              }}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{ flex: 1, padding: '16px 20px', border: 'none', fontSize: '0.9rem', borderRadius: '4px 0 0 4px', outline: 'none' }}
                />
                <button type="submit" style={{ 
                  padding: '16px 32px', 
                  background: '#1E293B', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '0 4px 4px 0', 
                  fontSize: '0.85rem', 
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}>
                  Subscribe
                </button>
              </form>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '12px',
                padding: '24px 32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                marginTop: '20px',
              }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: '#fff', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: '#16A34A',
                  fontWeight: 'bold'
                }}>✓</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>Thank you for subscribing!</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>You'll receive updates about new collections and exclusive offers.</div>
                <button 
                  onClick={() => setNewsletterSubmitted(false)}
                  style={{
                    marginTop: '12px',
                    background: 'transparent',
                    border: '2px solid rgba(255,255,255,0.5)',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Subscribe another email
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="container">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <Link to="/" className="lp-logo" style={{ gap: '10px', marginBottom: '12px', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                  <img src="/bsc-logo.png" alt="BSC Exclusive" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', letterSpacing: '0.04em' }}>BSC EXCLUSIVE</div>
                  <div style={{ fontSize: '0.6rem', color: '#94A3B8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Since 1938</div>
                </div>
              </Link>
              <p>India's premier destination for authentic handloom silk sarees and traditional ethnic wear, serving connoisseurs of fine craftsmanship since 1938.</p>
              <div className="lp-social">
                <a href="https://www.instagram.com/bsc.since1938/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', transition: 'background 0.2s' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="https://www.facebook.com/BSC.Since1938/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', transition: 'background 0.2s' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', transition: 'background 0.2s' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', transition: 'background 0.2s' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                </a>
              </div>
            </div>
            <div className="lp-footer-col">
              <h4>Shop</h4>
              <ul>
                <li><Link to="/category/women">Women's Collection</Link></li>
                <li><Link to="/category/men">Men's Collection</Link></li>
                <li><Link to="/category/kids">Kids' Collection</Link></li>
                <li><Link to="/category/new-arrivals">New Arrivals</Link></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Customer Service</h4>
              <ul>
                <li><Link to="/customer-service">Contact Support</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/cookies">Cookie Policy</Link></li>
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
                    <MapPin size={14} /> Davangere — Medical College Rd
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowStores(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit', fontFamily: 'inherit', fontSize: '0.82rem', textAlign: 'left' }}
                  >
                    <MapPin size={14} /> Belgaum — Tilakwadi
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowStores(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit', fontFamily: 'inherit', fontSize: '0.82rem', textAlign: 'left' }}
                  >
                    <MapPin size={14} /> Shivamogga — B.H. Road
                  </button>
                </li>
                <li><Phone size={14} /><span>+91 8192 272180</span></li>
                <li><Mail size={14} /><span>hello@bscexclusive.com</span></li>
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
            <p>&copy; {new Date().getFullYear()} BSC Exclusive. All Rights Reserved.</p>
            <div className="lp-footer-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {showStores && <StoreLocator onClose={() => setShowStores(false)} />}
      <Chatbot />
      <CookieConsent />
      
      {/* WHATSAPP FLOATING BUTTON */}
      <a
        href="https://wa.me/918192272180?text=Hi%2C%20I%27m%20interested%20in%20BSC%20Exclusive%20products"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 999,
          width: '56px', height: '56px', borderRadius: '50%',
          background: '#25D366', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,211,102,0.4)', textDecoration: 'none'
        }}
        title="Chat on WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      {/* BACK TO TOP */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed', bottom: '90px', right: '24px', zIndex: 998,
            width: '44px', height: '44px', borderRadius: '50%',
            background: '#1E293B', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)', border: 'none', cursor: 'pointer',
            transition: 'opacity 0.3s'
          }}
          title="Back to top"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
      )}
    </div>
  );
}