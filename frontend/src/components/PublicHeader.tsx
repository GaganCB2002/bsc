import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, LogOut } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import '../pages/LandingPage.css';

export default function PublicHeader() {
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/dashboard/wishlist');
  };

  return (
    <header className="lp-header scrolled" style={{ position: 'relative', background: '#fff' }}>
      <div className="lp-header-inner">
        <Link to="/" className="lp-logo" style={{ textDecoration: 'none' }}>
          <BrandLogo size={36} variant="dark" />
        </Link>
        <nav className="lp-nav">
          <Link to="/category/women">Women</Link>
          <Link to="/category/men">Men</Link>
          <Link to="/category/kids">Kids</Link>
          <Link to="/category/new-arrivals">New Arrivals</Link>
          <Link to="/customer-service">Contact</Link>
        </nav>
        <div className="lp-header-actions">
          <Link to="/category/new-arrivals?search=1" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#333' }}><Search size={18} /></Link>
          
          <a
            href="#"
            onClick={handleWishlistClick}
            style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#333', textDecoration: 'none' }}
            title={isAuthenticated ? 'My Wishlist' : 'Login to view Wishlist'}
          >
            <Heart size={18} />
            {isAuthenticated && wishlistItems.length > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-8px', background: '#B91C1C', color: '#fff',
                fontSize: '0.6rem', fontWeight: 700, width: '16px', height: '16px',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{wishlistItems.length}</span>
            )}
          </a>

          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: '#333', textDecoration: 'none' }}>
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-8px', background: '#B91C1C', color: '#fff',
                fontSize: '0.6rem', fontWeight: 700, width: '16px', height: '16px',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{totalItems}</span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                to={user.role === 'admin' ? '/admin/overview' : '/dashboard'}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none',
                  color: '#1A1A2E', fontSize: '0.85rem', fontWeight: 600, background: '#F1F5F9',
                  padding: '6px 12px', borderRadius: '20px'
                }}
              >
                <User size={15} color="#B91C1C" />
                <span>{user.name}</span>
                {user.role === 'admin' && (
                  <span style={{ fontSize: '0.65rem', background: '#1E3A8A', color: '#fff', padding: '1px 6px', borderRadius: '10px', textTransform: 'uppercase' }}>
                    Admin
                  </span>
                )}
              </Link>
              <button
                onClick={logout}
                title="Sign Out"
                style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="lp-btn-outline lp-btn-sm">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
}
