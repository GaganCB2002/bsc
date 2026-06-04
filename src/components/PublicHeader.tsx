import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Heart } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useCart } from '../context/CartContext';
import '../pages/LandingPage.css';

export default function PublicHeader() {
  const { totalItems } = useCart();

  return (
    <header className="lp-header scrolled" style={{ position: 'relative', background: '#fff' }}>
      <div className="lp-header-inner">
        <Link to="/" className="lp-logo" style={{ gap: '10px' }}>
          <BrandLogo size={48} variant="gold" />
          <div>
            <div className="lp-logo-text" style={{ fontSize: '0.75rem', opacity: 1, margin: 0, lineHeight: 1.2, color: 'inherit' }}>Channabasappa</div>
            <div style={{ fontSize: '0.55rem', color: 'inherit', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Silks &amp; Sarees</div>
          </div>
        </Link>
        <nav className="lp-nav">
          <Link to="/category/new-arrivals">New Arrivals</Link>
          <Link to="/category/women">Women</Link>
          <Link to="/category/men">Men</Link>
          <Link to="/category/kids">Kids</Link>
          <Link to="/customer-service">Customer Service</Link>
        </nav>
        <div className="lp-header-actions">
          <Link to="/category/new-arrivals?search=1" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#333' }}><Search size={18} /></Link>
          <Link to="/customer/orders" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#333' }}><Heart size={18} /></Link>
          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: '#333', textDecoration: 'none' }}>
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-8px', background: '#C47A6A', color: '#fff',
                fontSize: '0.6rem', fontWeight: 700, width: '16px', height: '16px',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{totalItems}</span>
            )}
          </Link>
          <Link to="/login" className="lp-btn-outline lp-btn-sm">Sign In</Link>
        </div>
      </div>
    </header>
  );
}
