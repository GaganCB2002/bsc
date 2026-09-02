import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { getProductById, getProductsByCategory } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Truck, RotateCcw, ChevronLeft, ChevronRight, ShoppingBag, Star, Shield, Heart, ZoomIn, ZoomOut, Check, Package, Clock, Award } from 'lucide-react';
import '../pages/LandingPage.css';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [addedMessage, setAddedMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping' | 'reviews'>('details');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);

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
    document.title = product ? `${product.name} - BSC Exclusive` : 'Product - BSC Exclusive';
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImage((prev) => (prev === 0 ? (product?.images.length || 1) - 1 : prev - 1));
        setIsZoomed(false);
      } else if (e.key === 'ArrowRight') {
        setSelectedImage((prev) => (prev === (product?.images.length || 1) - 1 ? 0 : prev + 1));
        setIsZoomed(false);
      } else if (e.key === 'Escape') {
        setIsZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return getProductsByCategory(product.category).filter(p => p.id !== product.id).slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
        <PublicHeader />
        <div style={{ textAlign: 'center', padding: '100px 24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 300, color: '#64748B', marginBottom: '16px' }}>Product not found</h2>
          <Link to="/" style={{ color: '#B91C1C', fontSize: '0.9rem' }}>Return to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <PublicHeader />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 24px' }}>
        <Link to={`/category/${product.category}`} style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem',
          color: '#B91C1C', fontWeight: 500, textDecoration: 'none', marginBottom: '30px'
        }}>
          <ChevronLeft size={16} /> Back to {product.category}'s Collection
        </Link>

        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          {/* LEFT: Image Gallery */}
          <div style={{ flex: '1 1 500px', display: 'flex', gap: '16px' }}>
            {/* Side Thumbnails */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedImage(i); setIsZoomed(false); }}
                  style={{
                    width: '72px', height: '72px', flexShrink: 0,
                    border: selectedImage === i ? '2px solid #B91C1C' : '2px solid #E2E8F0',
                    borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', padding: 0,
                    background: '#fff', opacity: selectedImage === i ? 1 : 0.6,
                    transition: 'all 0.2s', boxShadow: selectedImage === i ? '0 2px 8px rgba(185,28,28,0.2)' : 'none'
                  }}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div style={{ flex: 1, position: 'relative' }}>
              <div
                style={{
                  overflow: 'hidden', position: 'relative', background: '#F1F5F9',
                  borderRadius: '12px', cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                  aspectRatio: '3/4'
                }}
                onClick={() => setIsZoomed(!isZoomed)}
                onMouseMove={(e) => {
                  if (!isZoomed) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.querySelector('img')?.style.setProperty('transform-origin', `${x}% ${y}%`);
                }}
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    transition: isZoomed ? 'none' : 'transform 0.3s ease',
                    transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                  }}
                />

                {/* Zoom indicator */}
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  background: 'rgba(0,0,0,0.6)', color: '#fff',
                  padding: '6px 10px', borderRadius: '6px', fontSize: '0.7rem',
                  display: 'flex', alignItems: 'center', gap: '4px', pointerEvents: 'none'
                }}>
                  {isZoomed ? <ZoomOut size={12} /> : <ZoomIn size={12} />}
                  {isZoomed ? 'Click to zoom out' : 'Click to zoom in'}
                </div>

                {/* Left Arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
                    setIsZoomed(false);
                  }}
                  style={{
                    position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.15)', transition: 'all 0.2s',
                    zIndex: 2
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)'; }}
                >
                  <ChevronLeft size={20} color="#1E293B" />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
                    setIsZoomed(false);
                  }}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.15)', transition: 'all 0.2s',
                    zIndex: 2
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)'; }}
                >
                  <ChevronRight size={20} color="#1E293B" />
                </button>

                {/* Dots */}
                <div style={{
                  position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
                  display: 'flex', gap: '6px', zIndex: 2
                }}>
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(i); setIsZoomed(false); }}
                      style={{
                        width: selectedImage === i ? '20px' : '8px', height: '8px',
                        borderRadius: '4px', border: 'none', cursor: 'pointer',
                        background: selectedImage === i ? '#B91C1C' : 'rgba(255,255,255,0.7)',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Image counter */}
              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.75rem', color: '#94A3B8' }}>
                Image {selectedImage + 1} of {product.images.length}
              </div>
            </div>
          </div>
          
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', paddingTop: '20px' }}>
            {/* Badges */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B91C1C', fontWeight: 600, background: '#FEE2E2', padding: '3px 10px', borderRadius: '4px' }}>
                {product.category}'s Collection
              </span>
              {product.isNew && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff', background: '#16a34a', padding: '3px 10px', borderRadius: '4px' }}>NEW</span>}
              {product.isBestseller && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff', background: '#B91C1C', padding: '3px 10px', borderRadius: '4px' }}>BESTSELLER</span>}
              {product.isSale && product.comparePrice && (
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff', background: '#F59E0B', padding: '3px 10px', borderRadius: '4px' }}>
                  {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                </span>
              )}
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: product.inStock ? '#16a34a' : '#DC2626', background: product.inStock ? '#DCFCE7' : '#FEE2E2', padding: '3px 10px', borderRadius: '4px' }}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 400, marginBottom: '12px', lineHeight: 1.2, color: '#1E293B' }}>{product.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= Math.round(product.rating) ? '#F59E0B' : '#E5E7EB'} color={i <= Math.round(product.rating) ? '#F59E0B' : '#E5E7EB'} />)}
              </div>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>{product.rating} ({product.reviews} reviews)</span>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px' }}>{product.subcategory}</span>
            </div>
            
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#B91C1C', marginBottom: '8px' }}>
              ₹{product.price.toLocaleString('en-IN')}
              {product.comparePrice && (
                <>
                  <span style={{ fontSize: '1rem', color: '#94A3B8', textDecoration: 'line-through', marginLeft: '12px', fontWeight: 400 }}>
                    ₹{product.comparePrice.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600, marginLeft: '8px' }}>
                    Save ₹{(product.comparePrice - product.price).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '20px' }}>Inclusive of all taxes. Free shipping on orders above ₹5,000.</p>
            
            <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.8, marginBottom: '24px' }}>{product.description}</p>

            {/* Product Highlights */}
            <div style={{ marginBottom: '24px', padding: '16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #F0EBE5' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B', marginBottom: '10px' }}>Product Highlights</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { icon: <Award size={13} />, text: 'Authentic Handloom' },
                  { icon: <Shield size={13} />, text: 'GI Tagged Silk' },
                  { icon: <Package size={13} />, text: 'Premium Packaging' },
                  { icon: <Check size={13} />, text: 'Quality Checked' },
                  { icon: <Truck size={13} />, text: 'Insured Shipping' },
                  { icon: <RotateCcw size={13} />, text: '7-Day Returns' },
                ].map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748B' }}>
                    <span style={{ color: '#16a34a' }}>{h.icon}</span> {h.text}
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1E293B' }}>Select Size</span>
                <a href="/customer-service" style={{ color: '#B91C1C', fontSize: '0.8rem', textDecoration: 'none' }}>Size Guide</a>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)} style={{
                    width: '56px', height: '56px', border: `1.5px solid ${selectedSize === size ? '#B91C1C' : '#E2E8F0'}`,
                    backgroundColor: selectedSize === size ? '#FEE2E2' : '#fff', color: selectedSize === size ? '#B91C1C' : '#1E293B',
                    fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer', borderRadius: '8px', fontFamily: 'inherit'
                  }}>{size}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1E293B', display: 'block', marginBottom: '12px' }}>Quantity</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '40px', height: '40px', border: '1px solid #E2E8F0', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem' }}>-</button>
                <span style={{ fontWeight: 600, fontSize: '1rem', minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} style={{ width: '40px', height: '40px', border: '1px solid #E2E8F0', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem' }}>+</button>
              </div>
            </div>
            
            <div style={{ position: 'relative' }}>
              {addedMessage && (
                <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', background: '#1E293B', color: '#fff', padding: '8px 16px', fontSize: '0.75rem', whiteSpace: 'nowrap', zIndex: 10 }}>
                  {addedMessage}
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => {
                  if (!selectedSize) { setAddedMessage('Please select a size'); return; }
                  for (let i = 0; i < quantity; i++) {
                    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, size: selectedSize });
                  }
                  setAddedMessage('Added to cart!');
                  setTimeout(() => setAddedMessage(''), 2000);
                }} style={{
                  flex: 1, padding: '16px', backgroundColor: '#B91C1C', color: '#fff', border: 'none', fontSize: '0.85rem',
                  fontWeight: 600, cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button onClick={() => {
                  if (!isAuthenticated) { navigate('/login'); return; }
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category, description: product.description, comparePrice: product.comparePrice });
                  }
                }} style={{ width: '52px', height: '52px', border: '1px solid #E2E8F0', background: isInWishlist(product.id) ? '#FEE2E2' : '#fff', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={20} color={isInWishlist(product.id) ? '#B91C1C' : '#64748B'} fill={isInWishlist(product.id) ? '#B91C1C' : 'none'} />
                </button>
              </div>
            </div>
            
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', color: '#64748B', fontSize: '0.875rem' }}>
                <Truck size={18} /> Free shipping on orders over ₹5,000
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', color: '#64748B', fontSize: '0.875rem' }}>
                <RotateCcw size={18} /> 30-day return policy
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748B', fontSize: '0.875rem' }}>
                <Shield size={18} /> Genuine product guarantee
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '60px', display: 'flex', gap: '32px', borderBottom: '1px solid #E2E8F0', marginBottom: '32px', flexWrap: 'wrap' }}>
          {(['details', 'care', 'shipping', 'reviews'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '12px 4px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem',
              fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? '#B91C1C' : '#64748B',
              borderBottom: activeTab === tab ? '2px solid #B91C1C' : '2px solid transparent'
            }}>
              {tab === 'details' ? 'Product Details' : tab === 'care' ? 'Care Instructions' : tab === 'shipping' ? 'Shipping Info' : `Reviews (${product.reviews})`}
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <div style={{ marginBottom: '60px', color: '#64748B', lineHeight: 1.8, fontSize: '0.9rem' }}>
            <p style={{ marginBottom: '16px' }}>{product.description}</p>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1E293B', marginBottom: '12px' }}>Specifications</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {[
                { label: 'Category', value: product.category.charAt(0).toUpperCase() + product.category.slice(1) },
                { label: 'Subcategory', value: product.subcategory },
                { label: 'Material', value: 'Pure Silk' },
                { label: 'Weave Type', value: 'Handloom' },
                { label: 'Pattern', value: 'Traditional' },
                { label: 'Occasion', value: product.tags[0]?.charAt(0).toUpperCase() + (product.tags[0]?.slice(1) || '') },
                { label: 'Wash Care', value: 'Dry Clean Only' },
                { label: 'Country of Origin', value: 'India' },
              ].map((spec, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '8px 12px', background: '#F8FAFC', borderRadius: '6px' }}>
                  <span style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.8rem', minWidth: '100px' }}>{spec.label}:</span>
                  <span style={{ fontSize: '0.8rem' }}>{spec.value}</span>
                </div>
              ))}
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>Description</h4>
            <p>This product is crafted with premium quality materials, designed for comfort and style. Each piece undergoes strict quality control to ensure the highest standards. The intricate handwoven patterns reflect centuries-old artisanal traditions passed down through generations of master weavers.</p>
          </div>
        )}
        {activeTab === 'care' && (
          <div style={{ marginBottom: '60px', color: '#64748B', lineHeight: 1.8, fontSize: '0.9rem' }}>
            <div style={{ padding: '20px', background: '#FEF3C7', borderRadius: '10px', marginBottom: '20px', border: '1px solid #FDE68A' }}>
              <p style={{ fontSize: '0.85rem', color: '#92400E', fontWeight: 500, margin: 0 }}>⚠️ Silk products require special care. Please follow these instructions to maintain quality.</p>
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1E293B', marginBottom: '12px' }}>Washing Instructions</h4>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
              <li>Dry clean only for the first 2-3 washes</li>
              <li>Hand wash gently in cold water with mild detergent</li>
              <li>Do not wring or twist the fabric</li>
              <li>Wash dark and light colors separately</li>
            </ul>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1E293B', marginBottom: '12px' }}>Storage Instructions</h4>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
              <li>Store in a cool, dry place away from direct sunlight</li>
              <li>Wrap in muslin cloth or cotton bag — avoid plastic covers</li>
              <li>Refold periodically to prevent permanent creases</li>
              <li>Place neem leaves or silica gel packets to prevent moisture</li>
            </ul>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1E293B', marginBottom: '12px' }}>Ironing Instructions</h4>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Iron on low to medium heat with a pressing cloth</li>
              <li>Iron on the reverse side to protect zari work</li>
              <li>Do not spray water directly on zari borders</li>
            </ul>
          </div>
        )}
        {activeTab === 'shipping' && (
          <div style={{ marginBottom: '60px', color: '#64748B', lineHeight: 1.8, fontSize: '0.9rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {[
                { icon: <Truck size={20} />, title: 'Standard Shipping', time: '5-7 business days', price: 'Free on orders over ₹5,000', color: '#3b82f6' },
                { icon: <Clock size={20} />, title: 'Express Shipping', time: '2-3 business days', price: '₹250', color: '#F59E0B' },
                { icon: <Package size={20} />, title: 'Same Day Delivery', time: 'Within 6 hours', price: '₹500 (Select cities)', color: '#16a34a' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '20px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ color: s.color, marginBottom: '8px' }}>{s.icon}</div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>{s.title}</h4>
                  <p style={{ fontSize: '0.8rem', margin: '0 0 4px' }}>{s.time}</p>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#B91C1C', margin: 0 }}>{s.price}</p>
                </div>
              ))}
            </div>
            <p style={{ marginBottom: '12px' }}>All orders include tracking information sent to your email. We ship across India via trusted logistics partners.</p>
            <p style={{ marginBottom: '12px' }}>International shipping available to select countries. Contact us for international shipping rates.</p>
            <p>For any shipping queries, call us at <strong>+91 8192 272180</strong> or email <strong>hello@bscexclusive.com</strong></p>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', padding: '24px', background: '#F8FAFC', borderRadius: '12px', minWidth: '160px' }}>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: '#1E293B' }}>{product.rating}</div>
                <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginBottom: '4px' }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= Math.round(product.rating) ? '#F59E0B' : '#E5E7EB'} color={i <= Math.round(product.rating) ? '#F59E0B' : '#E5E7EB'} />)}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{product.reviews} reviews</div>
              </div>
              <div style={{ flex: 1, minWidth: '250px' }}>
                {[5,4,3,2,1].map(star => {
                  const pct = star === 5 ? 68 : star === 4 ? 22 : star === 3 ? 7 : star === 2 ? 2 : 1;
                  return (
                    <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', minWidth: '12px' }}>{star}</span>
                      <Star size={13} fill="#F59E0B" color="#F59E0B" />
                      <div style={{ flex: 1, height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: '#F59E0B', borderRadius: '4px' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8', minWidth: '30px' }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {[
              { name: 'Priya M.', rating: 5, date: 'Aug 25, 2026', text: 'Absolutely stunning silk saree! The quality exceeded my expectations. The zari work is beautiful and the colors are vibrant. Will definitely buy again.' },
              { name: 'Anitha K.', rating: 5, date: 'Aug 18, 2026', text: 'Bought this for my daughter\'s wedding. Everyone loved it. The packaging was excellent and delivery was on time.' },
              { name: 'Rajesh S.', rating: 4, date: 'Aug 10, 2026', text: 'Good quality product. The silk feels premium and the weaving is intricate. Slightly lighter than expected but overall very satisfied.' },
            ].map((r, i) => (
              <div key={i} style={{ padding: '20px', background: '#fff', border: '1px solid #F0EBE5', borderRadius: '10px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#B91C1C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>{r.name[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1E293B' }}>{r.name}</div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1,2,3,4,5].map(j => <Star key={j} size={11} fill={j <= r.rating ? '#F59E0B' : '#E5E7EB'} color={j <= r.rating ? '#F59E0B' : '#E5E7EB'} />)}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{r.date}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.7, margin: 0 }}>{r.text}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '24px', color: '#1E293B' }}>You May Also Like</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
            {relatedProducts.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration: 'none', color: '#1E293B' }}>
                <div style={{ background: '#F1F5F9', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                  <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                  {p.isNew && <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#16a34a', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700 }}>NEW</span>}
                </div>
                <div style={{ padding: '12px 0' }}>
                  <h3 style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '4px' }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill={i < Math.floor(p.rating) ? '#F59E0B' : '#E5E7EB'} color={i < Math.floor(p.rating) ? '#F59E0B' : '#E5E7EB'} />
                    ))}
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>({p.reviews})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#B91C1C' }}>₹{p.price.toLocaleString('en-IN')}</span>
                    {p.comparePrice && <span style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{p.comparePrice.toLocaleString('en-IN')}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
