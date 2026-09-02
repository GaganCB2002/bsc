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
        <Link to="/" className="lp-logo" style={{ textDecoration: 'none' }}>
          <BrandLogo size={36} variant="dark" />
        </Link>
        <nav className="lp-nav">
          <Link to="/courses">All Courses</Link>
          <Link to="/courses?category=silk">Silk Weaving</Link>
          <Link to="/courses?category=business">Business</Link>
          <Link to="/courses?category=care">Fabric Care</Link>
          <Link to="/about">About Academy</Link>
        </nav>
        <div className="lp-header-actions">
          <Link to="/category/new-arrivals?search=1" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#333' }}><Search size={18} /></Link>
          <Link to="/customer/orders" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#333' }}><Heart size={18} /></Link>
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
          <Link to="/login" className="lp-btn-outline lp-btn-sm">Sign In</Link>
        </div>
      </div>
    </header>
  );
}
