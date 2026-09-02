import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { showToast } from '../../components/Toast';
import { Heart, ShoppingBag, Trash2, Eye, ChevronRight } from 'lucide-react';
import { productsData, type Product } from '../../data/mockProducts';

export default function CustomerWishlist() {
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => { document.title = 'Wishlist - BSC Exclusive'; }, []);

  const wishlistIds = wishlistItems.map(i => i.id);
  const wishlistProducts = productsData.filter((p: Product) => wishlistIds.includes(p.id));

  const sorted = [...wishlistProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  const handleAddToCart = (product: Product) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, size: 'Free Size' });
    showToast('success', `${product.name} added to cart!`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ display: 'inline-block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B91C1C', border: '1px solid rgba(185,28,28,0.3)', padding: '3px 12px', marginBottom: '8px' }}>Wishlist</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 300, color: '#1A1A1A' }}>My <span style={{ fontWeight: 700, color: '#B91C1C' }}>Wishlist</span></h1>
          <p style={{ fontSize: '0.85rem', color: '#6B6B6B' }}>{wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved</p>
        </div>
        {wishlistProducts.length > 0 && (
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.8rem', background: '#fff' }}>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', border: '1px solid #F0EBE5', borderRadius: '12px' }}>
          <Heart size={48} style={{ color: '#FECDD3', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Your wishlist is empty</h3>
          <p style={{ color: '#999', marginBottom: '16px', fontSize: '0.85rem' }}>Save items you love for later</p>
          <Link to="/category/new-arrivals" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 24px', background: '#B91C1C', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
            Browse Products <ChevronRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {sorted.map(product => (
            <div key={product.id} style={{ background: '#fff', border: '1px solid #F0EBE5', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {product.comparePrice && product.comparePrice > product.price && (
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#B91C1C', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600 }}>
                    {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                  </span>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B8A88A', fontWeight: 500 }}>{product.category}</span>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1A1A1A', margin: '4px 0 6px' }}>{product.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#B91C1C' }}>₹{product.price.toLocaleString('en-IN')}</span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{product.comparePrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/product/${product.id}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', background: '#F1F5F9', border: 'none', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, color: '#1A1A2E', textDecoration: 'none' }}>
                    <Eye size={14} /> View
                  </Link>
                  <button onClick={() => handleAddToCart(product)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', background: '#B91C1C', border: 'none', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                    <ShoppingBag size={14} /> Add to Cart
                  </button>
                  <button onClick={() => { removeFromWishlist(product.id); showToast('info', 'Removed from wishlist'); }} style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FEE2E2', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#B91C1C' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}