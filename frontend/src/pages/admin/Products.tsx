import { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Eye, Search, X, Check, Package, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  comparePrice: number;
  stock: number;
  image: string;
  status: string;
  description: string;
  tags: string[];
}

const initialProducts: Product[] = [
  { id: '1', name: 'Kanchipuram Bridal Silk Saree', category: 'Women', price: 45000, comparePrice: 55000, stock: 24, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100', status: 'Active', description: 'Exquisite handwoven bridal silk saree with pure gold zari work, perfect for wedding ceremonies.', tags: ['bridal', 'silk', 'premium'] },
  { id: '2', name: 'Banarasi Georgette Saree', category: 'Women', price: 18500, comparePrice: 22000, stock: 36, image: 'https://images.unsplash.com/photo-1771654099745-73a4a4d09bcd?w=100', status: 'Active', description: 'Elegant Banarasi georgette saree with intricate floral motifs and gold border.', tags: ['banarasi', 'georgette', 'elegant'] },
  { id: '3', name: 'Mysore Crepe Silk Saree', category: 'Women', price: 12999, comparePrice: 16000, stock: 48, image: 'https://images.unsplash.com/photo-1771654805161-442c6aab7b55?w=100', status: 'Active', description: 'Lightweight Mysore crepe silk saree in vibrant colors with traditional border.', tags: ['mysore', 'crepe', 'lightweight'] },
  { id: '4', name: 'Men\'s Raw Silk Kurta Set', category: 'Men', price: 8999, comparePrice: 12000, stock: 52, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100', status: 'Active', description: 'Premium raw silk kurta set with churidar and dupatta for festive occasions.', tags: ['men', 'silk', 'festive'] },
  { id: '5', name: 'Designer Anarkali Suit', category: 'Women', price: 15999, comparePrice: 20000, stock: 8, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100', status: 'Low Stock', description: 'Designer anarkali suit with heavy embroidery and mirror work.', tags: ['designer', 'anarkali', 'party'] },
  { id: '6', name: 'Bridal Lehenga Choli', category: 'Women', price: 89999, comparePrice: 110000, stock: 12, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100', status: 'Active', description: 'Magnificent bridal lehenga with intricate zardozi and stone work.', tags: ['bridal', 'lehenga', 'luxury'] },
  { id: '7', name: 'Men\'s Linen Sherwani', category: 'Men', price: 25000, comparePrice: 32000, stock: 18, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100', status: 'Active', description: 'Premium linen sherwani with modern cuts and traditional embroidery.', tags: ['men', 'linen', 'sherwani'] },
  { id: '8', name: 'Designer Patiala Suit', category: 'Women', price: 9999, comparePrice: 13000, stock: 5, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100', status: 'Low Stock', description: 'Comfortable designer patiala suit with phulkari embroidery work.', tags: ['designer', 'patiala', 'comfort'] },
  { id: '9', name: 'Kids Ethnic Wear Set', category: 'Kids', price: 3499, comparePrice: 4500, stock: 64, image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=100', status: 'Active', description: 'Adorable ethnic wear set for kids with comfortable cotton lining.', tags: ['kids', 'ethnic', 'comfortable'] },
  { id: '10', name: 'Tissue Silk Saree', category: 'Women', price: 28900, comparePrice: 35000, stock: 0, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100', status: 'Out of Stock', description: 'Premium tissue silk saree with golden sheen and delicate border work.', tags: ['tissue', 'silk', 'premium'] },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', category: 'Women', price: 0, comparePrice: 0, stock: 0, description: '', image: '', tags: '' });

  useEffect(() => {
    document.title = 'Products - BSC Exclusive Admin';
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === 'all' || p.category === filterCategory;
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const openAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: 'Women', price: 0, comparePrice: 0, stock: 0, description: '', image: '', tags: '' });
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({ name: p.name, category: p.category, price: p.price, comparePrice: p.comparePrice, stock: p.stock, description: p.description, image: p.image, tags: p.tags.join(', ') });
    setShowModal(true);
  };

  const saveProduct = () => {
    const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData, tags } : p));
    } else {
      const newProduct: Product = {
        id: String(Date.now()),
        name: formData.name,
        category: formData.category,
        price: formData.price,
        comparePrice: formData.comparePrice,
        stock: formData.stock,
        image: formData.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100',
        status: formData.stock === 0 ? 'Out of Stock' : formData.stock < 10 ? 'Low Stock' : 'Active',
        description: formData.description,
        tags,
      };
      setProducts(prev => [newProduct, ...prev]);
    }
    setShowModal(false);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem' };
  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600 as const, marginBottom: '6px', color: '#1E293B' };

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const activeCount = products.filter(p => p.status === 'Active').length;
  const lowStock = products.filter(p => p.status === 'Low Stock').length;
  const outOfStock = products.filter(p => p.status === 'Out of Stock').length;

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Products Management</h1>
          <p>Add, edit, and manage your entire product catalog.</p>
        </div>
        <button onClick={openAdd} style={{ backgroundColor: '#B91C1C', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-header">Total Products</div>
          <div className="stat-value">{products.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Active Products</div>
          <div className="stat-value" style={{ color: '#16a34a' }}>{activeCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Low Stock</div>
          <div className="stat-value" style={{ color: '#D97706' }}>{lowStock}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Out of Stock</div>
          <div className="stat-value" style={{ color: '#DC2626' }}>{outOfStock}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Package size={20} /> All Products ({filtered.length})</span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#F1F5F9', borderRadius: '8px', padding: '0 12px' }}>
              <Search size={16} color="#94A3B8" />
              <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ border: 'none', background: 'transparent', padding: '8px', fontSize: '0.85rem', outline: 'none', width: '180px' }} />
            </div>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem' }}>
              <option value="all">All Categories</option>
              <option value="Women">Women</option>
              <option value="Men">Men</option>
              <option value="Kids">Kids</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem' }}>
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <table style={{ marginTop: '16px' }}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th style={{ textAlign: 'right' }}>Price</th>
              <th style={{ textAlign: 'right' }}>Compare</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Rating</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '2px' }}>{product.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.description}</div>
                  </div>
                </td>
                <td><span style={{ background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>{product.category}</span></td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: '#B91C1C' }}>₹{product.price.toLocaleString('en-IN')}</td>
                <td style={{ textAlign: 'right', color: '#94A3B8', textDecoration: 'line-through' }}>₹{product.comparePrice.toLocaleString('en-IN')}</td>
                <td><span style={{ fontWeight: 600, color: product.stock === 0 ? '#DC2626' : product.stock < 10 ? '#D97706' : '#16a34a' }}>{product.stock}</span></td>
                <td>
                  <span style={{
                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600,
                    background: product.status === 'Active' ? '#DCFCE7' : product.status === 'Low Stock' ? '#FEF3C7' : '#FEE2E2',
                    color: product.status === 'Active' ? '#166534' : product.status === 'Low Stock' ? '#92400E' : '#991B1B'
                  }}>{product.status}</span>
                </td>
                <td><span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} fill="#F59E0B" color="#F59E0B" /> 4.{parseInt(product.id) % 5 + 5}</span></td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button onClick={() => openEdit(product)} title="Edit" style={{ background: '#F1F5F9', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#64748B' }}><Edit3 size={14} /></button>
                    <button title="View" style={{ background: '#F1F5F9', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#64748B' }}><Eye size={14} /></button>
                    <button onClick={() => deleteProduct(product.id)} title="Delete" style={{ background: '#FEE2E2', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#B91C1C' }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '16px', padding: '12px 16px', background: '#F8FAFC', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748B' }}>
          <span>Total Catalog Value: <strong style={{ color: '#1E293B' }}>₹{totalValue.toLocaleString('en-IN')}</strong></span>
          <span>Showing {filtered.length} of {products.length} products</span>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '600px', maxHeight: '85vh', overflow: 'auto', boxShadow: '0 25px 80px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Product Name *</label>
                <input style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Kanchipuram Silk Saree" />
              </div>

              <div>
                <label style={labelStyle}>Description *</label>
                <textarea rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the product..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select style={inputStyle} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option>Women</option>
                    <option>Men</option>
                    <option>Kids</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Tags (comma separated)</label>
                  <input style={inputStyle} value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="silk, bridal, premium" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Price (₹) *</label>
                  <input style={inputStyle} type="number" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} placeholder="0" />
                </div>
                <div>
                  <label style={labelStyle}>Compare Price (₹)</label>
                  <input style={inputStyle} type="number" value={formData.comparePrice || ''} onChange={e => setFormData({ ...formData, comparePrice: Number(e.target.value) })} placeholder="0" />
                </div>
                <div>
                  <label style={labelStyle}>Stock *</label>
                  <input style={inputStyle} type="number" value={formData.stock || ''} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} placeholder="0" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Image URL</label>
                <input style={inputStyle} value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://images.unsplash.com/..." />
                {formData.image && (
                  <div style={{ marginTop: '8px', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#F1F5F9' }}>
                    <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: '#F1F5F9', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
              <button onClick={saveProduct} disabled={!formData.name || !formData.price} style={{ padding: '10px 24px', background: '#B91C1C', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px', opacity: !formData.name || !formData.price ? 0.6 : 1 }}>
                <Check size={16} /> {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
