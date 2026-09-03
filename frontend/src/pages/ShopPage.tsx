import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Star, ShoppingBag, Sparkles, Heart, Grid3X3, LayoutGrid, User } from 'lucide-react';
import { productsData, searchProducts } from '../data/mockProducts';
import { useTryOn } from '../context/TryOnContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import './ShopPage.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'bestselling', label: 'Best Selling' },
];

const CATEGORIES = ['All', 'Women', 'Men', 'Kids'];
const SUBCATEGORIES = ['All', 'Coats', 'Jackets', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Black', 'White', 'Navy', 'Camel', 'Olive', 'Burgundy', 'Charcoal', 'Red', 'Blue', 'Green'];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('All');
  const [subcategory, setSubcategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const { openFittingRoom, isOpen: fittingRoomOpen } = useTryOn();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const filteredProducts = useMemo(() => {
    let filtered = searchQuery ? searchProducts(searchQuery) : [...productsData];

    if (category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (subcategory !== 'All') {
      filtered = filtered.filter(p => p.subcategory === subcategory);
    }
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => p.sizes?.some(s => selectedSizes.includes(s)));
    }
    if (selectedColors.length > 0) {
      filtered = filtered.filter(p => p.colors?.some(c => selectedColors.includes(c)));
    }
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'bestselling': filtered.sort((a, b) => b.reviews - a.reviews); break;
      case 'newest': filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    }
    return filtered;
  }, [searchQuery, category, subcategory, sortBy, priceRange, selectedSizes, selectedColors]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  const clearFilters = () => {
    setCategory('All');
    setSubcategory('All');
    setPriceRange([0, 1000]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSearchQuery('');
    setSearchParams({});
  };

  const hasActiveFilters = category !== 'All' || subcategory !== 'All' || selectedSizes.length > 0 || selectedColors.length > 0 || priceRange[1] < 1000;

  useEffect(() => {
    document.title = 'Shop - BSC Exclusive';
  }, []);

  return (
    <div className="shop-page">
      {/* Top Navigation Bar */}
      <header className="shop-header">
        <div className="shop-header-inner">
          <Link to="/" className="shop-logo">
            <span className="shop-logo-text">BSC</span>
            <span className="shop-logo-sub">EXCLUSIVE</span>
          </Link>

          <nav className="shop-nav">
            {['HOME', 'SHOP', 'NEW ARRIVALS', 'SALE'].map(item => (
              <Link
                key={item}
                to={item === 'HOME' ? '/' : item === 'SHOP' ? '/shop' : `/category/${item.toLowerCase().replace(' ', '-')}`}
                className={`shop-nav-link ${item === 'SHOP' ? 'active' : ''}`}
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="shop-header-actions">
            <button className="shop-icon-btn" aria-label="Search">
              <Search size={18} />
            </button>
            {isAuthenticated ? (
              <Link to="/dashboard" className="shop-icon-btn" aria-label="Account">
                <User size={18} />
              </Link>
            ) : (
              <Link to="/login" className="shop-icon-btn" aria-label="Account">
                <User size={18} />
              </Link>
            )}
            <Link to="/dashboard/wishlist" className="shop-icon-btn" aria-label="Wishlist">
              <Heart size={18} />
            </Link>
            <Link to="/cart" className="shop-icon-btn shop-cart-btn" aria-label="Cart">
              <ShoppingBag size={18} />
            </Link>
          </div>
        </div>
      </header>

      <div className="shop-layout">
        {/* Left: Fitting Room Panel */}
        <aside className={`fitting-panel ${fittingRoomOpen ? 'open' : ''}`}>
          <div className="fitting-panel-header">
            <Sparkles size={20} className="fitting-icon" />
            <h2>Fitting room</h2>
          </div>
          <p className="fitting-instruction">Tap the hanger on any product to wear it</p>

          <div className="fitting-preview">
            <div className="fitting-preview-placeholder">
              <User size={64} strokeWidth={1} />
              <span>Select a garment to preview</span>
            </div>
          </div>

          <div className="fitting-selected">
            <h3>Selected garments</h3>
            <div className="fitting-garments-empty">
              <span>No garments selected yet</span>
            </div>
          </div>

          <button className="fitting-try-btn" disabled>
            <Sparkles size={16} />
            Try on with AI
          </button>
        </aside>

        {/* Right: Product Grid */}
        <main className="shop-main">
          {/* Search Bar */}
          <div className="shop-search-section">
            <form onSubmit={handleSearch} className="shop-search-form">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shop-search-input"
              />
              {searchQuery && (
                <button type="button" className="search-clear" onClick={() => { setSearchQuery(''); setSearchParams({}); }}>
                  <X size={16} />
                </button>
              )}
            </form>
          </div>

          {/* Page Header */}
          <div className="shop-page-header">
            <div className="shop-page-title">
              <h1>New Arrivals</h1>
              <span className="product-count">{filteredProducts.length} products</span>
            </div>
            <div className="shop-page-controls">
              <button
                className={`filter-toggle ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={16} />
                Filters
                {hasActiveFilters && <span className="filter-badge" />}
              </button>
              <div className="sort-dropdown">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid-toggle">
                <button className={gridCols === 3 ? 'active' : ''} onClick={() => setGridCols(3)} aria-label="3 columns">
                  <Grid3X3 size={16} />
                </button>
                <button className={gridCols === 4 ? 'active' : ''} onClick={() => setGridCols(4)} aria-label="4 columns">
                  <LayoutGrid size={16} />
                </button>
              </div>
              {hasActiveFilters && (
                <button className="reset-filters" onClick={clearFilters}>
                  <X size={14} />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="filter-chips">
              {category !== 'All' && (
                <span className="filter-chip">
                  {category}
                  <button onClick={() => setCategory('All')}><X size={12} /></button>
                </span>
              )}
              {subcategory !== 'All' && (
                <span className="filter-chip">
                  {subcategory}
                  <button onClick={() => setSubcategory('All')}><X size={12} /></button>
                </span>
              )}
              {selectedSizes.map(s => (
                <span key={s} className="filter-chip">
                  Size: {s}
                  <button onClick={() => setSelectedSizes(prev => prev.filter(x => x !== s))}><X size={12} /></button>
                </span>
              ))}
              {selectedColors.map(c => (
                <span key={c} className="filter-chip">
                  {c}
                  <button onClick={() => setSelectedColors(prev => prev.filter(x => x !== c))}><X size={12} /></button>
                </span>
              ))}
            </div>
          )}

          {/* Filter Drawer */}
          {showFilters && (
            <div className="filter-drawer">
              <div className="filter-group">
                <h4>Category</h4>
                <div className="filter-options">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      className={`filter-option ${category === cat ? 'active' : ''}`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <h4>Type</h4>
                <div className="filter-options">
                  {SUBCATEGORIES.map(sub => (
                    <button
                      key={sub}
                      className={`filter-option ${subcategory === sub ? 'active' : ''}`}
                      onClick={() => setSubcategory(sub)}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <h4>Size</h4>
                <div className="filter-options">
                  {SIZES.map(size => (
                    <button
                      key={size}
                      className={`filter-option size ${selectedSizes.includes(size) ? 'active' : ''}`}
                      onClick={() => setSelectedSizes(prev => prev.includes(size) ? prev.filter(x => x !== size) : [...prev, size])}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <h4>Color</h4>
                <div className="filter-options colors">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      className={`filter-color ${selectedColors.includes(color) ? 'active' : ''}`}
                      onClick={() => setSelectedColors(prev => prev.includes(color) ? prev.filter(x => x !== color) : [...prev, color])}
                      title={color}
                    >
                      <span className="color-dot" style={{ background: color.toLowerCase() === 'navy' ? '#1e3a5f' : color.toLowerCase() }} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <h4>Price Range</h4>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="price-slider"
                />
                <div className="price-labels">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <Search size={48} strokeWidth={1} />
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query</p>
              <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <div className={`product-grid cols-${gridCols}`}>
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="product-card"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className="product-card-image">
                    <Link to={`/product/${product.id}`}>
                      <img src={product.image} alt={product.name} loading="lazy" />
                      {hoveredProduct === product.id && product.images.length > 1 && (
                        <img
                          src={product.images[1]}
                          alt={product.name}
                          className="product-image-hover"
                          loading="lazy"
                        />
                      )}
                    </Link>
                    <div className="product-badges">
                      {product.isNew && <span className="badge new">NEW</span>}
                      {product.isSale && <span className="badge sale">SALE</span>}
                      {product.isBestseller && <span className="badge bestseller">HOT</span>}
                    </div>
                    <div className="product-actions-overlay">
                      <button
                        className="product-action-btn wishlist"
                        onClick={(e) => {
                          e.preventDefault();
                          if (isInWishlist(product.id)) {
                            removeFromWishlist(product.id);
                          } else {
                            addToWishlist({
                              id: product.id, name: product.name, price: product.price,
                              image: product.image, category: product.category, description: product.description,
                            });
                          }
                        }}
                        aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart size={16} fill={isInWishlist(product.id) ? '#e8792b' : 'none'} color={isInWishlist(product.id) ? '#e8792b' : '#fff'} />
                      </button>
                      {product.virtualTryOn && (
                        <button
                          className="product-action-btn tryon"
                          onClick={(e) => {
                            e.preventDefault();
                            openFittingRoom(product.id, product.name, product.image, product.price);
                          }}
                          aria-label="Try on with AI"
                        >
                          <Sparkles size={16} />
                        </button>
                      )}
                    </div>
                    <div className="product-rating-badge">
                      <Star size={12} fill="#e8792b" color="#e8792b" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <div className="product-card-info">
                    <span className="product-category">{product.subcategory}</span>
                    <Link to={`/product/${product.id}`} className="product-name">
                      {product.name}
                    </Link>
                    <div className="product-pricing">
                      <span className="product-price">${product.price}</span>
                      {product.comparePrice && (
                        <span className="product-compare-price">${product.comparePrice}</span>
                      )}
                      {product.comparePrice && (
                        <span className="product-discount">
                          -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                        </span>
                      )}
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          id: product.id, name: product.name, price: product.price,
                          image: product.image, size: product.sizes?.[0] || 'M',
                        });
                      }}
                    >
                      <ShoppingBag size={14} />
                      Add to Bag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
