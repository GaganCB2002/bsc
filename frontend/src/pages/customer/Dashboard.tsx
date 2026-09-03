import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { showToast } from '../../components/Toast';
import { Package, Heart, MapPin, Settings, ShoppingBag, ChevronRight, CreditCard, Truck, Clock, Camera, Upload, X, AlertCircle } from 'lucide-react';

interface UploadedImage {
  id: string;
  name: string;
  url: string;
  date: string;
  caption: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  amount: string;
  items: string;
  image: string;
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Mounted ref + timer ref so the upload "uploading" indicator cannot fire
  // setState on an unmounted component when the user navigates away mid-upload.
  const uploadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(() => {
    try {
      const saved = localStorage.getItem('customerGallery');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadCaption, setUploadCaption] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [orders] = useState<Order[]>([]);
  // TODO(integration): replace with `orderService.recent()` call. Hardcoded
  // demo orders are removed because they leaked across users and gave a false
  // impression of purchase history.

  useEffect(() => {
    document.title = 'My Account - BSC Exclusive';
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'File size must be under 5MB');
      e.target.value = '';
      return;
    }
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please select an image file');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => { setUploadPreview(ev.target?.result as string); setShowUploadModal(true); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleUpload = () => {
    if (!uploadPreview) return;
    setUploading(true);
    if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
    uploadTimerRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      const newImage: UploadedImage = {
        id: `img-${Date.now()}`,
        name: `Photo ${uploadedImages.length + 1}`,
        url: uploadPreview,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        caption: uploadCaption || 'My purchase'
      };
      const updated = [newImage, ...uploadedImages];
      setUploadedImages(updated);
      try {
        localStorage.setItem('customerGallery', JSON.stringify(updated));
      } catch {
        // localStorage may be full / unavailable; the in-memory state is still updated.
      }
      setUploadPreview(null);
      setUploadCaption('');
      setShowUploadModal(false);
      setUploading(false);
    }, 1000);
  };

  const handleDeleteImage = (id: string) => {
    const updated = uploadedImages.filter(img => img.id !== id);
    setUploadedImages(updated);
    try {
      localStorage.setItem('customerGallery', JSON.stringify(updated));
    } catch {
      // localStorage may be full / unavailable; in-memory state already updated.
    }
  };

  const firstName = (user?.name || 'Customer').split(' ')[0];

  const stats = [
    { icon: <Package size={22} />, label: 'Total Orders', value: orders.length.toString(), color: '#3b82f6', link: '/dashboard/orders' },
    { icon: <Heart size={22} />, label: 'Wishlist', value: 'View', color: '#B91C1C', link: '/dashboard/wishlist' },
    { icon: <MapPin size={22} />, label: 'Addresses', value: 'Manage', color: '#16a34a', link: '/dashboard/addresses' },
    { icon: <Settings size={22} />, label: 'Settings', value: 'Edit', color: '#1E3A8A', link: '/dashboard/settings' },
  ];

  const statusColor = (s: string) => {
    if (s === 'Delivered') return { bg: '#DCFCE7', color: '#166534' };
    if (s === 'Shipped') return { bg: '#DBEAFE', color: '#1E40AF' };
    if (s === 'Processing') return { bg: '#FEF3C7', color: '#92400E' };
    return { bg: '#F1F5F9', color: '#64748B' };
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <span style={{ display: 'inline-block', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B91C1C', border: '1px solid rgba(185,28,28,0.3)', padding: '3px 12px', marginBottom: '8px' }}>My Account</span>
        <h1 style={{ fontSize: '2rem', fontWeight: 300, color: '#1A1A1A', marginBottom: '4px' }}>Welcome back, <span style={{ fontWeight: 700, color: '#B91C1C' }}>{firstName}</span></h1>
        <p style={{ fontSize: '0.85rem', color: '#6B6B6B' }}>Manage your orders, wishlist, and account settings</p>
      </div>

      {/* Profile Card */}
      <div style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', borderRadius: '16px', padding: '28px', color: '#fff', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #B91C1C, #991B1B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 }}>
          {user?.name?.[0] || 'C'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>{user?.name || 'Customer'}</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{user?.email || 'customer@bscexclusive.com'}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '4px' }}>{user?.phone || '+91 XXXXX XXXXX'} · {user?.location || 'India'}</div>
        </div>
        <Link to="/dashboard/settings" style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>Edit Profile</Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map((s, i) => (
          <Link key={i} to={s.link} style={{ background: '#fff', border: '1px solid #F0EBE5', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', color: 'inherit', borderRadius: '10px', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1A1A1A' }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', color: '#8A7A6A', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '32px' }}>
        <Link to="/category/new-arrivals" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#B91C1C', color: '#fff', padding: '14px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
          <ShoppingBag size={18} /> Continue Shopping
        </Link>
        <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', border: '1px solid #E2E8F0', color: '#1A1A2E', padding: '14px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
          <CreditCard size={18} /> View Cart ({totalItems})
        </Link>
        <Link to="/dashboard/orders" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', border: '1px solid #E2E8F0', color: '#1A1A2E', padding: '14px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
          <Truck size={18} /> Track Orders
        </Link>
      </div>

      {/* Recent Orders */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1A1A2E' }}>Recent Orders</h2>
          <Link to="/dashboard/orders" style={{ color: '#B91C1C', fontSize: '0.8rem', fontWeight: 600 }}>View All →</Link>
        </div>
        {orders.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', border: '1px solid #F0EBE5', padding: '24px', borderRadius: '10px', color: '#64748B' }}>
            <AlertCircle size={20} color="#94A3B8" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' }}>No orders yet</div>
              <div style={{ fontSize: '0.8rem' }}>Recent orders will appear here once you make a purchase.</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map((order) => {
              const sc = statusColor(order.status);
              return (
                <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#fff', border: '1px solid #F0EBE5', padding: '16px 20px', borderRadius: '10px' }}>
                  <img src={order.image} alt="" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1A1A1A' }}>{order.items}</div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#6B6B6B', marginTop: '4px' }}>
                      <span style={{ fontFamily: 'monospace' }}>{order.id}</span>
                      <span>{order.date}</span>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#1A1A1A', fontSize: '0.95rem' }}>{order.amount}</div>
                  <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, background: sc.bg, color: sc.color }}>{order.status}</span>
                  <ChevronRight size={18} color="#ccc" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* My Gallery - Image Upload */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1A1A2E' }}>My Gallery</h2>
            <p style={{ fontSize: '0.75rem', color: '#6B6B6B' }}>Upload and share your purchase photos</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
              background: '#B91C1C', color: '#fff', border: 'none', borderRadius: '8px',
              fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            <Upload size={14} /> Upload Photo
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
        </div>

        {uploadedImages.length === 0 ? (
          <div style={{ background: '#fff', border: '2px dashed #E2E8F0', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
            <Camera size={40} color="#CBD5E1" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>No photos yet</h3>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '16px' }}>Upload photos of your purchases to share your style</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '10px 20px', background: '#B91C1C', color: '#fff', border: 'none',
                borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              <Camera size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Upload Your First Photo
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {uploadedImages.map((img) => (
              <div key={img.id} style={{ background: '#fff', border: '1px solid #F0EBE5', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <img src={img.url} alt={img.caption} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    style={{
                      position: 'absolute', top: '6px', right: '6px', width: '24px', height: '24px',
                      borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      fontSize: '0.7rem'
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
                <div style={{ padding: '10px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B' }}>{img.caption}</div>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '2px' }}>{img.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '480px', width: '100%', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0EBE5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1E293B' }}>Upload Photo</h3>
              <button onClick={() => { setShowUploadModal(false); setUploadPreview(null); setUploadCaption(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              {uploadPreview && (
                <div style={{ marginBottom: '16px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #F0EBE5' }}>
                  <img src={uploadPreview} alt="Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', background: '#F8FAFC' }} />
                </div>
              )}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>Caption (optional)</label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Describe your photo..."
                  style={{
                    width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px',
                    fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => { setShowUploadModal(false); setUploadPreview(null); setUploadCaption(''); }}
                  style={{ flex: 1, padding: '12px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  style={{
                    flex: 1, padding: '12px', background: '#B91C1C', color: '#fff', border: 'none',
                    borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: uploading ? 'wait' : 'pointer',
                    fontFamily: 'inherit', opacity: uploading ? 0.7 : 1
                  }}
                >
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shop Banner */}
      <div style={{ background: 'linear-gradient(135deg, #B91C1C, #991B1B)', borderRadius: '14px', padding: '28px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>New Collection Arrived</h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Explore the latest silk sarees and ethnic wear</p>
        </div>
        <Link to="/category/new-arrivals" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', color: '#B91C1C', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
          Shop Now <ChevronRight size={16} />
        </Link>
      </div>

      {/* Help */}
      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#fff', border: '1px solid #F0EBE5', padding: '20px', borderRadius: '10px' }}>
          <Clock size={20} color="#1E3A8A" style={{ marginBottom: '8px' }} />
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '4px' }}>Order Support</h4>
          <p style={{ fontSize: '0.8rem', color: '#6B6B6B' }}>Need help with an order? Contact us at +91 8192 272180</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #F0EBE5', padding: '20px', borderRadius: '10px' }}>
          <Truck size={20} color="#16a34a" style={{ marginBottom: '8px' }} />
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '4px' }}>Free Shipping</h4>
          <p style={{ fontSize: '0.8rem', color: '#6B6B6B' }}>Free delivery on orders above ₹5,000 across India</p>
        </div>
      </div>
    </div>
  );
}