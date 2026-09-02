import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, ChevronRight, Star, MapPin, Phone, Mail, Award, Shield, Truck, Leaf, Navigation, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { getPersonalizedProducts } from '../data/mockProducts';
import { getAgeRecommendation } from '../utils/ageRecommendations';
import StoreLocator from '../components/StoreLocator';
import Chatbot from '../components/Chatbot';
import CookieConsent from '../components/CookieConsent';
import './LandingPage.css';

const featuredProducts = [
  { id: 'p1', title: 'Royal Crimson Kanchipuram Silk Saree', category: 'Handloom Silk', price: '₹45,000', rating: 4.9, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600', badge: 'New Arrival' },
  { id: 'p2', title: 'Golden Zari Banarasi Brocade Saree', category: 'Banarasi Heritage', price: '₹38,500', rating: 4.8, image: 'https://images.unsplash.com/photo-1771654099745-73a4a4d09bcd?auto=format&fit=crop&q=80&w=600', badge: 'Best Seller' },
  { id: 'p3', title: 'Pure Mulberry Tissue Silk Saree', category: 'Mulberry Special', price: '₹28,900', rating: 4.9, image: 'https://images.unsplash.com/photo-1771654805161-442c6aab7b55?auto=format&fit=crop&q=80&w=600', badge: 'Exclusive' },
  { id: 'p4', title: 'Emerald Green Temple Border Silk', category: 'Kanchipuram Classic', price: '₹52,000', rating: 5.0, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600', badge: 'Heritage' },
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

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [showStores, setShowStores] = useState(false);

  const personalizedProducts = useMemo(() => {
    if (isAuthenticated && user?.age && user?.gender) {
      return getPersonalizedProducts(user.age, user.gender, 8);
    }
    return [];
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
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
            <Link to="/courses">All Courses</Link>
            <Link to="/courses?category=silk">Silk Weaving</Link>
            <Link to="/courses?category=business">Business</Link>
            <Link to="/courses?category=care">Fabric Care</Link>
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
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
            <div style={{ background: '#fff', padding: '4px 8px' }}>
              <img src="/bsc-logo.png" alt="BSC" style={{ height: '32px' }} />
            </div>
            <button onClick={() => setMenuOpen(false)} aria-label="Close">
              <X size={24} />
            </button>
          </div>
          <nav className="lp-mobile-nav">
            <Link to="/courses" onClick={() => setMenuOpen(false)}>All Courses</Link>
            <Link to="/courses?category=silk" onClick={() => setMenuOpen(false)}>Silk Weaving</Link>
            <Link to="/courses?category=business" onClick={() => setMenuOpen(false)}>Business</Link>
            <Link to="/courses?category=care" onClick={() => setMenuOpen(false)}>Fabric Care</Link>
            <a href="#about" onClick={() => setMenuOpen(false)}>About Us</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
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
            Authentic handloom silk sarees and traditional ethnic wear — crafted by master weavers and cherished by connoisseurs for four generations.
          </p>
          <div className="lp-hero-buttons reveal">
            <Link to="/courses" className="lp-btn-primary lp-btn-lg">
              Explore Masterclasses <ChevronRight size={16} />
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

      {/* PERSONALIZED RECOMMENDATIONS SECTION */}
      {isAuthenticated && user?.age && personalizedProducts.length > 0 && (
        <section style={{ background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%)', padding: '60px 0' }}>
          <div className="container">
            <div className="lp-section-header reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="lp-section-tag" style={{ background: '#B91C1C', color: '#fff' }}>
                For You, {user.name?.split(' ')[0]}
              </span>
              <h2>Recommended for <span className="lp-text-accent">{getAgeRecommendation(user.age).label}</span></h2>
              <p style={{ maxWidth: '600px', margin: '12px auto 0', color: '#64748B', fontSize: '0.9rem' }}>
                {getAgeRecommendation(user.age).description}
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px', flexWrap: 'wrap' }}>
                {getAgeRecommendation(user.age).tags.slice(0, 4).map(tag => (
                  <span key={tag} style={{ background: '#FEE2E2', color: '#B91C1C', padding: '4px 12px', borderRadius: '16px', fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {personalizedProducts.map((product) => (
                <div key={product.id} className="reveal" style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'all 0.3s' }}>
                  <div style={{ position: 'relative' }}>
                    <Link to={`/product/${product.id}`}>
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    </Link>
                    <button onClick={() => {
                      if (isInWishlist(product.id)) { removeFromWishlist(product.id); }
                      else { addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category, description: product.description, comparePrice: product.comparePrice }); }
                    }} style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', background: '#fff', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <span style={{ color: isInWishlist(product.id) ? '#B91C1C' : '#94A3B8' }}>♥</span>
                    </button>
                  </div>
                  <div style={{ padding: '14px' }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B91C1C', fontWeight: 600 }}>{product.category}</span>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', margin: '4px 0', lineHeight: 1.3 }}>{product.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontWeight: 700, color: '#B91C1C' }}>₹{product.price.toLocaleString('en-IN')}</span>
                      {product.comparePrice && (
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{product.comparePrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '28px' }}>
              <Link to="/category/new-arrivals" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#B91C1C', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
                View More Recommendations <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS & HANDLOOM SHOWCASE SECTION */}
      <section className="lp-collections" style={{ background: '#FAF7F2', padding: '80px 0' }}>
        <div className="container">
          <div className="lp-section-header reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="lp-section-tag">Featured Masterpieces</span>
            <h2>Exclusive <span className="lp-text-accent">Handloom Collections</span> & Courses</h2>
            <p style={{ maxWidth: '600px', margin: '12px auto 0', color: '#666', fontSize: '0.95rem' }}>
              Explore our handwoven silk sarees and comprehensive textile courses crafted by master artisans since 1938.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '28px', marginTop: '32px'
          }}>
            {featuredProducts.map((product) => (
              <div key={product.id} className="reveal" style={{
                background: '#fff', borderRadius: '12px', overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.06)', transition: 'all 0.3s ease',
                display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  />
                  <span style={{
                    position: 'absolute', top: '14px', left: '14px', background: '#B91C1C', color: '#fff',
                    fontSize: '0.65rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px',
                    textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}>
                    {product.badge}
                  </span>
                </div>
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
                      to="/courses"
                      style={{
                        background: '#1A1A2E', color: '#fff', textDecoration: 'none',
                        padding: '8px 16px', borderRadius: '6px', fontSize: '0.8rem',
                        fontWeight: 600, transition: 'background 0.2s'
                      }}
                    >
                      Explore & Enroll
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
                    <Link to="/courses" className="lp-collection-link">Explore <ChevronRight size={14} /></Link>
                  </div>
                </div>
                <h3>{col.title}</h3>
                <p>{col.desc}</p>
              </div>
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

      {/* NEWSLETTER SECTION */}
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

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="container">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <Link to="/" className="lp-logo" style={{ gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                  <img src="/bsc-logo.png" alt="BSC Exclusive" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              <h4>Academy & Courses</h4>
              <ul>
                <li><Link to="/courses?category=silk">Silk Weaving Masterclass</Link></li>
                <li><Link to="/courses?category=care">Saree Care & Storage</Link></li>
                <li><Link to="/courses?category=business">Textile Business Economics</Link></li>
                <li><Link to="/courses">All Courses</Link></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Customer Service</h4>
              <ul>
                <li><a href="#about">About Academy</a></li>
                <li><a href="#contact">Contact Support</a></li>
                <li><a href="/terms">Terms & Conditions</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
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
    </div>
  );
}