import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Heart, ShoppingBag, Trash2, ChevronRight } from 'lucide-react';

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    document.title = 'Wishlist - BSC Exclusive';
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <span style={{
          display: 'inline-block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)',
          padding: '3px 12px', marginBottom: '8px'
        }}>My Account</span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 300, color: '#1A1A1A' }}>My <span style={{ fontWeight: 700, color: '#A05252' }}>Wishlist</span></h1>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', border: '1px solid #F0EBE5' }}>
          <Heart size={48} style={{ margin: '0 auto 16px', opacity: 0.2, color: '#A05252' }} />
          <p style={{ fontSize: '1rem', color: '#6B6B6B', marginBottom: '8px' }}>Your wishlist is empty</p>
          <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '20px' }}>Save items you love by tapping the heart icon.</p>
          <Link to="/category/new-arrivals" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 24px',
            background: '#A05252', color: '#fff', textDecoration: 'none', fontSize: '0.78rem',
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'
          }}>
            Browse Collection <ChevronRight size={14} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map(item => (
            <div key={item.id} style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
              background: '#fff', border: '1px solid #F0EBE5', flexWrap: 'wrap'
            }}>
              <div style={{ width: '64px', height: '64px', background: '#F5F0EB', flexShrink: 0, overflow: 'hidden' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: '1', minWidth: '140px' }}>
                <Link to={`/product/${item.id}`} style={{ fontSize: '0.88rem', fontWeight: 500, color: '#1A1A1A', textDecoration: 'none' }}>{item.name}</Link>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#A05252', marginTop: '4px' }}>₹{item.price.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, size: 'M' })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
                    background: '#A05252', color: '#fff', border: 'none', cursor: 'pointer',
                    fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                    fontFamily: 'inherit'
                  }}
                >
                  <ShoppingBag size={14} /> Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  style={{
                    width: '40px', height: '40px', background: '#fff', border: '1.5px solid #E8E0D6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  <Trash2 size={15} color="#999" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
