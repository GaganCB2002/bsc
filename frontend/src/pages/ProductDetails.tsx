import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { getProductById, getProductsByCategory } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Truck, RotateCcw, ChevronLeft, ChevronRight, ShoppingBag, Star, Shield, Heart, ZoomIn, ZoomOut } from 'lucide-react';
import '../pages/LandingPage.css';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [addedMessage, setAddedMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');
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
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B91C1C', fontWeight: 600, marginBottom: '12px' }}>
              {product.category}'s Collection
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 400, marginBottom: '12px', lineHeight: 1.2, color: '#1E293B' }}>{product.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= Math.round(product.rating) ? '#F59E0B' : '#E5E7EB'} color={i <= Math.round(product.rating) ? '#F59E0B' : '#E5E7EB'} />)}
              </div>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>{product.rating} ({product.reviews} reviews)</span>
            </div>
            
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#B91C1C', marginBottom: '24px' }}>
              ₹{product.price.toLocaleString('en-IN')}
              {product.comparePrice && (
                <span style={{ fontSize: '1rem', color: '#94A3B8', textDecoration: 'line-through', marginLeft: '12px', fontWeight: 400 }}>
                  ₹{product.comparePrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            
            <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.8, marginBottom: '32px' }}>{product.description}</p>
            
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

        <div style={{ marginTop: '60px', display: 'flex', gap: '32px', borderBottom: '1px solid #E2E8F0', marginBottom: '32px' }}>
          {(['details', 'care', 'shipping'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '12px 4px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem',
              fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? '#B91C1C' : '#64748B',
              borderBottom: activeTab === tab ? '2px solid #B91C1C' : '2px solid transparent'
            }}>
              {tab === 'details' ? 'Product Details' : tab === 'care' ? 'Care Instructions' : 'Shipping Info'}
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <div style={{ marginBottom: '60px', color: '#64748B', lineHeight: 1.8, fontSize: '0.9rem' }}>
            <p>{product.description}</p>
            <p style={{ marginTop: '16px' }}>This product is crafted with premium quality materials, designed for comfort and style. Each piece undergoes strict quality control to ensure the highest standards.</p>
          </div>
        )}
        {activeTab === 'care' && (
          <div style={{ marginBottom: '60px', color: '#64748B', lineHeight: 1.8, fontSize: '0.9rem' }}>
            <p>- Machine wash cold with like colors</p>
            <p>- Do not bleach</p>
            <p>- Tumble dry low</p>
            <p>- Iron on medium heat if needed</p>
            <p>- Do not dry clean</p>
          </div>
        )}
        {activeTab === 'shipping' && (
          <div style={{ marginBottom: '60px', color: '#64748B', lineHeight: 1.8, fontSize: '0.9rem' }}>
            <p><strong>Standard Shipping:</strong> 5-7 business days - Free on orders over ₹5,000</p>
            <p><strong>Express Shipping:</strong> 2-3 business days - ₹250</p>
            <p><strong>Same Day Delivery:</strong> Available in select cities - ₹500</p>
            <p style={{ marginTop: '12px' }}>All orders include tracking information. We ship across India and to select international locations.</p>
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
