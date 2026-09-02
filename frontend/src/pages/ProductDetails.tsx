import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { getProductById } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Truck, RotateCcw, ChevronLeft, ShoppingBag, Star, Shield, Heart } from 'lucide-react';
import '../pages/LandingPage.css';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [addedMessage, setAddedMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');
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

  const relatedProducts = [product];

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

        <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ overflow: 'hidden', position: 'relative', background: '#F1F5F9', borderRadius: '12px' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
          
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', paddingTop: '20px' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B91C1C', fontWeight: 600, marginBottom: '12px' }}>
              {product.category}'s Collection
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 400, marginBottom: '12px', lineHeight: 1.2, color: '#1E293B' }}>{product.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>4.8 (124 reviews)</span>
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
                <div style={{ background: '#F1F5F9', borderRadius: '12px', overflow: 'hidden' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '12px 0' }}>
                  <h3 style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '4px' }}>{p.name}</h3>
                  <div style={{ fontWeight: 700, color: '#B91C1C' }}>₹{p.price.toLocaleString('en-IN')}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
