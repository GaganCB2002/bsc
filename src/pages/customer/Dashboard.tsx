import { useState, useEffect, useRef, useMemo } from 'react';
import { productsData } from '../../data/mockProducts';
import type { Product } from '../../data/mockProducts';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { X, Search, ShoppingBag, Heart, Star, Filter, XCircle, Check } from 'lucide-react';
import '../../pages/LandingPage.css';

const categories = [
  { id: 'women', label: 'Women', icon: '👗' },
  { id: 'men', label: 'Men', icon: '👔' },
  { id: 'kids', label: 'Kids', icon: '🧒' },
];

export default function Dashboard() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [activeCategory, setActiveCategory] = useState<string>('women');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [addedToCartMsg, setAddedToCartMsg] = useState<string>('');
  const [showFilter, setShowFilter] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    let products = productsData.filter(p => p.category === activeCategory);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === 'price-asc') products.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') products.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') products.sort((a, b) => a.name.localeCompare(b.name));

    return products;
  }, [activeCategory, searchQuery, priceRange, sortBy]);

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
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    const els = document.querySelectorAll('.reveal');
    els.forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [filteredProducts, activeCategory]);

  useEffect(() => {
    document.title = 'My Account - BS Channabasappa';
  }, []);

  const resetFilters = () => {
    setPriceRange([0, 20000]);
    setSortBy('default');
    setSearchQuery('');
  };

  const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 20000 || sortBy !== 'default';

  return (
    <div>
      {/* Header */}
      <div className="reveal" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
              <span style={{
              display: 'inline-block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)',
              padding: '3px 12px', marginBottom: '8px'
            }}>Customer Dashboard</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 300, color: '#1A1A1A', marginBottom: '4px' }}>
              Browse <span style={{ fontWeight: 700, color: '#A05252' }}>Collection</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#6B6B6B' }}>Explore our finest handloom selection</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '10px 12px 10px 36px', border: '1.5px solid #E8E0D6', borderRadius: '2px',
                  fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none', width: '220px',
                  background: '#fff', color: '#1A1A1A'
                }}
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
                background: showFilter ? '#A05252' : '#fff', color: showFilter ? '#fff' : '#1A1A1A',
                border: '1.5px solid #E8E0D6', cursor: 'pointer', fontSize: '0.78rem',
                fontWeight: 600, fontFamily: 'inherit', borderRadius: '2px',
                transition: 'all 0.2s'
              }}
            >
              <Filter size={15} /> Filters
              {hasActiveFilters && <span style={{ background: '#C9A84C', color: '#1A1A1A', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>!</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="reveal revealed" style={{
          background: '#fff', border: '1px solid #E8E0D6', padding: '24px', marginBottom: '28px',
          display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-end'
        }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', marginBottom: '10px' }}>Price Range</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                style={{ width: '90px', padding: '8px 10px', border: '1.5px solid #E8E0D6', fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none', background: '#FAFAFA' }}
              />
              <span style={{ color: '#999' }}>—</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                style={{ width: '90px', padding: '8px 10px', border: '1.5px solid #E8E0D6', fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none', background: '#FAFAFA' }}
              />
            </div>
          </div>
          <div style={{ flex: '1', minWidth: '160px' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', marginBottom: '10px' }}>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%', padding: '8px 10px', border: '1.5px solid #E8E0D6', fontSize: '0.82rem',
                fontFamily: 'inherit', outline: 'none', background: '#FAFAFA', color: '#1A1A1A', cursor: 'pointer'
              }}
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
          <div style={{ minWidth: '120px' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', marginBottom: '10px' }}>&nbsp;</label>
            <button
              onClick={resetFilters}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                background: 'none', border: '1.5px solid #E8E0D6', cursor: 'pointer',
                fontSize: '0.75rem', fontWeight: 500, fontFamily: 'inherit', color: '#666', borderRadius: '2px'
              }}
            >
              <XCircle size={14} /> Reset
            </button>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="reveal" style={{
        display: 'flex', gap: '4px', marginBottom: '32px',
        borderBottom: '1.5px solid #E8E0D6'
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '12px 28px',
              background: 'none',
              border: 'none',
              borderBottom: activeCategory === cat.id ? '2.5px solid #A05252' : '2.5px solid transparent',
              color: activeCategory === cat.id ? '#A05252' : '#999',
              fontWeight: activeCategory === cat.id ? 600 : 400,
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.03em',
              transition: 'all 0.2s',
              marginBottom: '-1.5px'
            }}
          >
            {cat.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '0.78rem', color: '#999', padding: '12px 0', alignSelf: 'center' }}>
          {filteredProducts.length} items
        </span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#999' }}>
          <ShoppingBag size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ fontSize: '1rem', fontWeight: 400 }}>No products found</p>
          <button onClick={resetFilters} style={{ marginTop: '12px', color: '#A05252', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline', fontFamily: 'inherit' }}>Clear filters</button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: '24px'
        }}>
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="reveal"
              onClick={() => { setSelectedProduct(product); setSelectedSize(''); }}
              style={{
                background: '#fff', cursor: 'pointer', overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                border: '1px solid #F0EBE5'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ position: 'relative', paddingTop: '120%', overflow: 'hidden', background: '#F5F0EB' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    objectFit: 'cover', transition: 'transform 0.5s ease'
                  }}
                />
                <div style={{
                  position: 'absolute', top: '12px', right: '12px', width: '34px', height: '34px',
                  borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', opacity: 1,
                  transition: 'all 0.3s', cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image });
                  }
                }}
                >
                  <Heart size={16} color={isInWishlist(product.id) ? '#A05252' : '#ccc'} fill={isInWishlist(product.id) ? '#A05252' : 'none'} />
                </div>
                {product.price > 10000 && (
                  <span style={{
                    position: 'absolute', top: '12px', left: '12px', background: '#A05252',
                    color: '#fff', fontSize: '0.6rem', fontWeight: 600, padding: '3px 8px',
                    textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}>Premium</span>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B8A88A', fontWeight: 500 }}>{product.category}</span>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 500, margin: '4px 0 6px', color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#A05252' }}>₹{product.price.toLocaleString('en-IN')}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 5000,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px', animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', maxWidth: '820px', width: '100%', maxHeight: '90vh',
              overflow: 'auto', display: 'flex', flexWrap: 'wrap', animation: 'fadeInUp 0.3s ease'
            }}
          >
            {/* Product Image */}
            <div style={{ flex: '1 1 360px', background: '#F5F0EB', position: 'relative' }}>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', maxHeight: '520px' }}
              />
              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  position: 'absolute', top: '12px', right: '12px', width: '36px', height: '36px',
                  borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none',
                  color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', transition: 'background 0.2s'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Product Info */}
            <div style={{ flex: '1 1 360px', padding: '36px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px',
                  background: '#F5F0EB', border: 'none', borderRadius: '50%',
                  color: '#1A1A1A', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', transition: 'all 0.2s', fontSize: '15px',
                  fontWeight: 600
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#E8E0D6'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = '#F5F0EB'; }}
              >
                ✕
              </button>
              <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B8A88A', fontWeight: 500, marginBottom: '8px' }}>
                {selectedProduct.category}'s Collection
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 500, color: '#1A1A1A', marginBottom: '8px', lineHeight: 1.2 }}>{selectedProduct.name}</h2>

              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {[...Array(5)].map((_, j) => <Star key={j} size={13} fill="#C9A84C" color="#C9A84C" />)}
                <span style={{ fontSize: '0.75rem', color: '#999', marginLeft: '6px' }}>(24 reviews)</span>
              </div>

              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#A05252', marginBottom: '20px' }}>
                ₹{selectedProduct.price.toLocaleString('en-IN')}
              </div>

              <p style={{ fontSize: '0.88rem', color: '#6B6B6B', lineHeight: 1.7, marginBottom: '24px' }}>
                {selectedProduct.description}
              </p>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.78rem', color: '#1A1A1A' }}>Select Size</span>
                  <a href="/customer-service#size-guide" style={{ color: '#A05252', fontSize: '0.72rem', textDecoration: 'none' }}>Size Guide</a>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        width: '48px', height: '48px', border: `1.5px solid ${selectedSize === size ? '#A05252' : '#E8E0D6'}`,
                        background: selectedSize === size ? '#F5F0EB' : '#fff',
                        color: selectedSize === size ? '#A05252' : '#1A1A1A',
                        fontWeight: 500, fontSize: '0.78rem', cursor: 'pointer',
                        transition: 'all 0.2s', fontFamily: 'inherit'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  {addedToCartMsg === selectedProduct.id && (
                    <div style={{
                      position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                      marginBottom: '8px', background: '#2C2826', color: '#fff', padding: '8px 16px',
                      fontSize: '0.7rem', whiteSpace: 'nowrap', zIndex: 10, display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                      <Check size={12} /> Added to cart!
                    </div>
                  )}
                  <button style={{
                    width: '100%', padding: '14px', background: !selectedSize ? '#B8A88A' : '#A05252', color: '#fff', border: 'none',
                    fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
                    cursor: 'pointer', transition: 'background 0.3s', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                  onClick={() => {
                    if (!selectedSize) return;
                    addToCart({ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, image: selectedProduct.image, size: selectedSize });
                    setAddedToCartMsg(selectedProduct.id);
                    setTimeout(() => setAddedToCartMsg(''), 2000);
                  }}
                  onMouseOver={(e) => { if (selectedSize) e.currentTarget.style.background = '#7A3D3D'; }}
                  onMouseOut={(e) => { if (selectedSize) e.currentTarget.style.background = '#A05252'; }}
                  >
                    <ShoppingBag size={15} /> {selectedSize ? 'Add to Cart' : 'Select Size'}
                  </button>
                </div>
                <button
                  onClick={() => {
                    if (isInWishlist(selectedProduct.id)) {
                      removeFromWishlist(selectedProduct.id);
                    } else {
                      addToWishlist({ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, image: selectedProduct.image });
                    }
                  }}
                  style={{
                    width: '48px', height: '48px', background: '#fff', border: `1.5px solid ${isInWishlist(selectedProduct.id) ? '#A05252' : '#E8E0D6'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    transition: 'all 0.2s', fontFamily: 'inherit'
                  }}
                >
                  <Heart size={18} color={isInWishlist(selectedProduct.id) ? '#A05252' : '#1A1A1A'} fill={isInWishlist(selectedProduct.id) ? '#A05252' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
