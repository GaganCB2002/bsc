import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Heart, ShoppingBag, Trash2, ChevronRight, Eye } from 'lucide-react';

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Wishlist - BSC Exclusive';
  }, []);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <span style={{
          display: 'inline-block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: '#B91C1C', border: '1px solid rgba(185,28,28,0.3)',
          padding: '3px 12px', marginBottom: '8px', borderRadius: '4px'
        }}>My Account</span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 300, color: '#1E293B' }}>My <span style={{ fontWeight: 700, color: '#B91C1C' }}>Wishlist</span></h1>
        <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
          <Heart size={48} style={{ margin: '0 auto 16px', opacity: 0.2, color: '#B91C1C' }} />
          <p style={{ fontSize: '1rem', color: '#64748B', marginBottom: '8px' }}>Your wishlist is empty</p>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '20px' }}>Save items you love by tapping the heart icon.</p>
          <Link to="/category/new-arrivals" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 24px',
            background: '#B91C1C', color: '#fff', textDecoration: 'none', fontSize: '0.8rem',
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '8px'
          }}>
            Browse Collection <ChevronRight size={14} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {items.map(item => (
            <div key={item.id} style={{
              background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden',
              transition: 'box-shadow 0.2s'
            }}>
              <div style={{ position: 'relative' }}>
                <Link to={`/product/${item.id}`}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
                </Link>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  style={{
                    position: 'absolute', top: '12px', right: '12px',
                    width: '32px', height: '32px', background: '#fff', border: 'none',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <Trash2 size={14} color="#B91C1C" />
                </button>
              </div>
              <div style={{ padding: '16px' }}>
                {item.category && (
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B91C1C', fontWeight: 600 }}>
                    {item.category}
                  </span>
                )}
                <Link to={`/product/${item.id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1E293B', marginTop: '4px', marginBottom: '8px', lineHeight: 1.3 }}>
                    {item.name}
                  </h3>
                </Link>
                {item.description && (
                  <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#B91C1C' }}>₹{item.price.toLocaleString('en-IN')}</span>
                  {item.comparePrice && (
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{item.comparePrice.toLocaleString('en-IN')}</span>
                  )}
                  {item.comparePrice && (
                    <span style={{ fontSize: '0.7rem', background: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                      {Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    to={`/product/${item.id}`}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '10px 16px', background: '#F1F5F9', color: '#1E293B', textDecoration: 'none',
                      fontSize: '0.75rem', fontWeight: 600, borderRadius: '8px', border: '1px solid #E2E8F0'
                    }}
                  >
                    <Eye size={14} /> View Details
                  </Link>
                  <button
                    onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, size: 'M' })}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '10px 16px', background: '#B91C1C', color: '#fff', border: 'none',
                      cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, borderRadius: '8px',
                      fontFamily: 'inherit'
                    }}
                  >
                    <ShoppingBag size={14} /> Add to Cart
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
