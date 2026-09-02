import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ChevronRight } from 'lucide-react';
import './LandingPage.css';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  useEffect(() => {
    document.title = 'Shopping Cart - BSC Exclusive';
  }, []);

  return (
    <div className="lp-page" style={{ minHeight: '100vh' }}>
      <PublicHeader />

      <div className="container" style={{ padding: '40px 24px 80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <span style={{
            display: 'inline-block', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#D4A574', border: '1px solid rgba(201,168,76,0.3)',
            padding: '4px 14px', marginBottom: '12px'
          }}>Cart</span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 300, color: '#2C2826', margin: 0 }}>
            Shopping <span style={{ fontWeight: 700, color: '#C47A6A' }}>Cart</span>
          </h1>
          {totalItems > 0 && (
            <p style={{ fontSize: '0.85rem', color: '#8A7A6A', marginTop: '8px' }}>{totalItems} item{totalItems > 1 ? 's' : ''} in your cart</p>
          )}
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#FDF8F3', border: '1px solid #E8E0D6' }}>
            <ShoppingBag size={56} style={{ margin: '0 auto 16px', opacity: 0.15, color: '#C47A6A' }} />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 400, color: '#2C2826', marginBottom: '8px' }}>Your cart is empty</h2>
            <p style={{ fontSize: '0.9rem', color: '#8A7A6A', marginBottom: '24px' }}>Add some beautiful silk sarees and ethnic wear to get started!</p>
            <Link to="/category/new-arrivals" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px',
              background: '#C47A6A', color: '#fff', textDecoration: 'none', fontSize: '0.8rem',
              fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em'
            }}>
              Continue Shopping <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {items.map(item => (
                  <div key={`${item.id}-${item.size}`} style={{
                    display: 'flex', gap: '16px', padding: '20px', background: '#FDF8F3',
                    border: '1px solid #E8E0D6', alignItems: 'center', flexWrap: 'wrap'
                  }}>
                    <div style={{ width: '80px', height: '100px', background: '#F5E6D3', flexShrink: 0, overflow: 'hidden' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: '1', minWidth: '140px' }}>
                      <Link to={`/product/${item.id}`} style={{ fontSize: '0.88rem', fontWeight: 500, color: '#2C2826', textDecoration: 'none' }}>{item.name}</Link>
                      <div style={{ fontSize: '0.75rem', color: '#8A7A6A', marginTop: '4px' }}>Size: {item.size}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#C47A6A', marginTop: '6px' }}>₹{item.price.toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        style={{
                          width: '32px', height: '32px', border: '1.5px solid #E8E0D6', background: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                          fontFamily: 'inherit'
                        }}
                      >
                        <Minus size={14} color="#8A7A6A" />
                      </button>
                      <span style={{ width: '32px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 500, color: '#2C2826' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        style={{
                          width: '32px', height: '32px', border: '1.5px solid #E8E0D6', background: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                          fontFamily: 'inherit'
                        }}
                      >
                        <Plus size={14} color="#8A7A6A" />
                      </button>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#2C2826', minWidth: '80px', textAlign: 'right' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      style={{
                        width: '36px', height: '36px', border: '1.5px solid #E8E0D6', background: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        fontFamily: 'inherit', flexShrink: 0
                      }}
                    >
                      <Trash2 size={15} color="#C62828" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={clearCart}
                style={{
                  marginTop: '16px', padding: '10px 20px', background: 'none', border: '1.5px solid #E8E0D6',
                  color: '#8A7A6A', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 500,
                  fontFamily: 'inherit'
                }}
              >
                Clear Cart
              </button>
            </div>

            <div style={{ width: '340px', flexShrink: 0 }}>
              <div style={{ background: '#FDF8F3', border: '1px solid #E8E0D6', padding: '28px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#2C2826', marginBottom: '20px' }}>Order Summary</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#8A7A6A', marginBottom: '12px' }}>
                  <span>Subtotal ({totalItems} item{totalItems > 1 ? 's' : ''})</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#8A7A6A', marginBottom: '12px' }}>
                  <span>Shipping</span>
                  <span>{totalPrice >= 5000 ? 'Free' : '₹99'}</span>
                </div>
                <div style={{ borderTop: '1px solid #E8E0D6', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, color: '#2C2826' }}>
                  <span>Total</span>
                  <span style={{ color: '#C47A6A' }}>₹{(totalPrice + (totalPrice >= 5000 ? 0 : 99)).toLocaleString('en-IN')}</span>
                </div>
                <button
                  style={{
                    width: '100%', padding: '14px', marginTop: '24px', background: '#C47A6A',
                    color: '#fff', border: 'none', fontSize: '0.8rem', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Proceed to Checkout
                </button>
                <Link to="/category/new-arrivals" style={{
                  display: 'block', textAlign: 'center', marginTop: '16px', fontSize: '0.78rem',
                  color: '#C47A6A', textDecoration: 'none'
                }}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
