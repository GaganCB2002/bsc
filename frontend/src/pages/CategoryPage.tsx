import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { getProductsByCategory, type Product } from '../data/mockProducts';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import '../pages/LandingPage.css';

const PAGE_SIZE = 24;

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const categoryId = id || 'women';
  const allProducts = getProductsByCategory(categoryId);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('all');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const filtered = allProducts.filter(p => {
    if (priceRange === 'under2k') return p.price < 2000;
    if (priceRange === '2k-5k') return p.price >= 2000 && p.price <= 5000;
    if (priceRange === '5k-10k') return p.price >= 5000 && p.price <= 10000;
    if (priceRange === 'above10k') return p.price > 10000;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const safePage = Math.min(page, totalPages || 1);
  const paginated = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const [prevKey, setPrevKey] = useState(`${categoryId}-${sortBy}-${priceRange}`);

  const currentKey = `${categoryId}-${sortBy}-${priceRange}`;
  if (prevKey !== currentKey) {
    setPrevKey(currentKey);
    setPage(1);
  }

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
  }, [paginated]);

  useEffect(() => { document.title = `${categoryId === 'new-arrivals' ? 'New Arrivals' : categoryId === 'bestsellers' ? 'Bestsellers' : categoryId === 'sale' ? 'Sale' : categoryId.charAt(0).toUpperCase() + categoryId.slice(1)} - BSC Exclusive`; }, [categoryId]);

  const titleMap: Record<string, string> = {
    'women': "Women's Collection",
    'men': "Men's Collection",
    'kids': "Kids' Collection",
    'new-arrivals': 'New Arrivals',
    'bestsellers': 'Bestsellers',
    'sale': 'Sale',
    'silk': 'Silk Collection',
  };

  return (
    <div style={{ backgroundColor: '#FDF8F3', minHeight: '100vh' }}>
      <PublicHeader />
      <div className="container" style={{ padding: '40px 24px 80px' }}>
        <div className="reveal" style={{ marginBottom: '24px' }}>
          <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1E3A8A', border: '1px solid rgba(30,58,138,0.3)', padding: '4px 14px', marginBottom: '12px' }}>Collection</span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 300, marginBottom: '4px', color: '#1A1A2E' }}>
            {titleMap[categoryId] || categoryId}
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#8A7A6A' }}>{sorted.length.toLocaleString()} products found</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.8rem', fontWeight: 600 }}>
            <SlidersHorizontal size={16} /> Filter:
          </div>
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.8rem', background: '#fff' }}>
            <option value="all">All Prices</option>
            <option value="under2k">Under ₹2,000</option>
            <option value="2k-5k">₹2,000 - ₹5,000</option>
            <option value="5k-10k">₹5,000 - ₹10,000</option>
            <option value="above10k">Above ₹10,000</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.8rem', background: '#fff' }}>
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {paginated.map((product: Product) => (
            <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="reveal" style={{ backgroundColor: '#fff', overflow: 'hidden', transition: 'all 0.3s', border: '1px solid #F0EBE5' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ position: 'relative', paddingTop: '120%', overflow: 'hidden', background: '#F1F5F9' }}>
                  <img src={product.image} alt={product.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {product.isNew && <span style={{ background: '#16a34a', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700 }}>NEW</span>}
                    {product.isBestseller && <span style={{ background: '#B91C1C', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700 }}>BESTSELLER</span>}
                    {product.isSale && <span style={{ background: '#f59e0b', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700 }}>SALE</span>}
                  </div>
                </div>
                <div style={{ padding: '14px' }}>
                  <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A89888', fontWeight: 500 }}>{product.subcategory}</span>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px', color: '#1A1A2E', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#f59e0b' }}>{'★'.repeat(Math.floor(product.rating))}</span>
                    <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>({product.reviews})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#B91C1C' }}>₹{product.price.toLocaleString('en-IN')}</span>
                    {product.comparePrice && <span style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{product.comparePrice.toLocaleString('en-IN')}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '40px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', background: safePage === 1 ? '#F1F5F9' : '#fff', cursor: safePage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
              <ChevronLeft size={16} /> Prev
            </button>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (safePage <= 4) {
                pageNum = i + 1;
              } else if (safePage >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = safePage - 3 + i;
              }
              return (
                <button key={pageNum} onClick={() => setPage(pageNum)} style={{ width: '36px', height: '36px', border: safePage === pageNum ? '2px solid #B91C1C' : '1px solid #E2E8F0', borderRadius: '8px', background: safePage === pageNum ? '#B91C1C' : '#fff', color: safePage === pageNum ? '#fff' : '#1A1A2E', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
                  {pageNum}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', background: safePage === totalPages ? '#F1F5F9' : '#fff', cursor: safePage === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
        {totalPages > 1 && (
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94A3B8', marginTop: '12px' }}>
            Page {safePage} of {totalPages.toLocaleString()} · Showing {paginated.length} of {sorted.length.toLocaleString()} products
          </p>
        )}

        {sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 300, color: '#A89888' }}>No products found</h2>
            <Link to="/" style={{ color: '#B91C1C', fontSize: '0.9rem', marginTop: '16px', display: 'inline-block' }}>Return to home</Link>
          </div>
        )}
      </div>
    </div>
  );
}