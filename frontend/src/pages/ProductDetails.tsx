import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { getProductById } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import { Truck, RotateCcw, ChevronLeft, ShoppingBag } from 'lucide-react';
import '../pages/LandingPage.css';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [addedMessage, setAddedMessage] = useState('');
  const { addToCart } = useCart();
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
    document.title = 'Product Details - BSC Exclusive';
  }, []);

  if (!product) {
    return (
      <div style={{ backgroundColor: '#FDF8F3', minHeight: '100vh' }}>
        <PublicHeader />
        <div className="container" style={{ textAlign: 'center', padding: '100px 24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 300, color: '#A89888', marginBottom: '16px' }}>Product not found</h2>
          <Link to="/" style={{ color: '#B91C1C', fontSize: '0.9rem' }}>Return to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FDF8F3', minHeight: '100vh' }}>
      <PublicHeader />
      
      <div className="container" style={{ padding: '30px 24px' }}>
        <Link to={`/category/${product.category}`} className="reveal" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.78rem',
          color: '#B91C1C',
          fontWeight: 500,
          textDecoration: 'none',
          marginBottom: '30px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <ChevronLeft size={16} /> Back to {product.category}'s Collection
        </Link>

        <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
          {/* Product Image */}
          <div className="reveal" style={{ flex: '1 1 500px' }}>
            <div style={{
              overflow: 'hidden',
              position: 'relative',
              background: '#F1F5F9'
            }}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  display: 'block',
                  transition: 'transform 0.6s ease'
                }}
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div className="reveal" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', paddingTop: '20px' }}>
            <span style={{
              fontSize: '0.68rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#A89888',
              fontWeight: 500,
              marginBottom: '12px'
            }}>
              {product.category}'s Collection
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 400, marginBottom: '16px', lineHeight: 1.2, color: '#1A1A2E' }}>{product.name}</h1>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#B91C1C', marginBottom: '32px' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            
            <p style={{ fontSize: '0.95rem', color: '#8A7A6A', lineHeight: 1.8, marginBottom: '40px' }}>
              {product.description}
            </p>
            
            {/* Size Selection */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1A1A2E' }}>Select Size</span>
                <a href="/customer-service#size-guide" style={{ color: '#B91C1C', fontSize: '0.78rem', textDecoration: 'none' }}>Size Guide</a>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: '56px',
                      height: '56px',
                      border: `1.5px solid ${selectedSize === size ? '#B91C1C' : '#E8E0D6'}`,
                      backgroundColor: selectedSize === size ? '#F1F5F9' : '#fff',
                      color: selectedSize === size ? '#B91C1C' : '#1A1A2E',
                      fontWeight: 500,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ position: 'relative' }}>
              {addedMessage && (
                <div style={{
                  position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                  marginBottom: '8px', background: '#1A1A2E', color: '#fff', padding: '8px 16px',
                  fontSize: '0.75rem', whiteSpace: 'nowrap', zIndex: 10
                }}>
                  {addedMessage}
                </div>
              )}
              <button
                onClick={() => {
                  if (!selectedSize) { setAddedMessage('Please select a size'); return; }
                  addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, size: selectedSize });
                  setAddedMessage('Added to cart!');
                  setTimeout(() => setAddedMessage(''), 2000);
                }}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: !selectedSize ? '#B8A88A' : '#B91C1C',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => { if (selectedSize) e.currentTarget.style.backgroundColor = '#991B1B'; }}
                onMouseOut={(e) => { if (selectedSize) e.currentTarget.style.backgroundColor = '#B91C1C'; }}
              >
                <ShoppingBag size={16} /> Add to Cart
              </button>
            </div>
            
            <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #E8E0D6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', color: '#8A7A6A', fontSize: '0.85rem' }}>
                <Truck size={18} /> Free shipping on orders over ₹5,000
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#8A7A6A', fontSize: '0.85rem' }}>
                <RotateCcw size={18} /> 30-day return policy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
