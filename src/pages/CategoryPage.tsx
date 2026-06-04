import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { getProductsByCategory } from '../data/mockProducts';
import '../pages/LandingPage.css';

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const categoryId = id || 'women';
  const products = getProductsByCategory(categoryId);
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
    document.title = 'Category - BS Channabasappa';
  }, []);

  return (
    <div style={{ backgroundColor: '#FDF8F3', minHeight: '100vh' }}>
      <PublicHeader />
      
      <div className="container" style={{ padding: '60px 24px' }}>
        <div className="reveal" style={{ marginBottom: '48px' }}>
          <span style={{
            display: 'inline-block',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#D4A574',
            border: '1px solid rgba(201,168,76,0.3)',
            padding: '4px 14px',
            marginBottom: '12px'
          }}>Collection</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 300, textTransform: 'capitalize', marginBottom: '8px', color: '#2C2826' }}>
            {categoryId === 'new-arrivals' ? "New Arrivals" : categoryId === 'collections' ? "Special Collections" : `${categoryId}'s Collection`}
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#8A7A6A', maxWidth: '500px' }}>
            Explore our exclusive range of traditional and contemporary designs.
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: '28px'
        }}>
          {products.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="reveal" style={{
                backgroundColor: '#fff',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ position: 'relative', paddingTop: '125%', overflow: 'hidden', background: '#F5E6D3' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      position: 'absolute',
                      top: 0, left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.6s ease'
                    }}
                  />
                </div>
                <div style={{ padding: '20px' }}>
                  <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A89888', fontWeight: 500 }}>{product.category}</span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px', color: '#2C2826', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#C47A6A' }}>₹{product.price.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 300, color: '#A89888' }}>Category not found</h2>
            <Link to="/" style={{ color: '#C47A6A', fontSize: '0.9rem', marginTop: '16px', display: 'inline-block' }}>Return to home</Link>
          </div>
        )}
      </div>
    </div>
  );
}
