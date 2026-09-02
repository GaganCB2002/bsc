import { useEffect, useState } from 'react';
import { AlertTriangle, Edit3, Check, X } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  comparePrice: number;
  stock: number;
  status: 'Healthy' | 'Low' | 'Critical';
  category: string;
}

const initialProducts: ProductItem[] = [
  { id: '1', name: 'Kanchipuram Silk Saree', sku: 'SAREE-KNC-001', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100', price: 8999, comparePrice: 12999, stock: 45, status: 'Healthy', category: 'Women' },
  { id: '2', name: 'Banarasi Georgette Saree', sku: 'SAREE-BNR-002', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100', price: 5499, comparePrice: 7999, stock: 12, status: 'Low', category: 'Women' },
  { id: '3', name: 'Mysore Crepe Silk Saree', sku: 'SAREE-MYS-003', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100', price: 3999, comparePrice: 5999, stock: 3, status: 'Critical', category: 'Women' },
  { id: '4', name: 'Men\'s Silk Kurta Set', sku: 'KURTA-MLN-004', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100', price: 2499, comparePrice: 3499, stock: 67, status: 'Healthy', category: 'Men' },
  { id: '5', name: 'Cotton Anarkali Suit', sku: 'SUIT-ANK-005', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100', price: 1899, comparePrice: 2999, stock: 8, status: 'Low', category: 'Women' },
  { id: '6', name: 'Bridal Lehenga Choli', sku: 'LEH-BRD-006', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100', price: 24999, comparePrice: 35999, stock: 22, status: 'Healthy', category: 'Women' },
  { id: '7', name: 'Designer Patiala Suit', sku: 'SUIT-PAT-007', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100', price: 2799, comparePrice: 3999, stock: 15, status: 'Healthy', category: 'Women' },
  { id: '8', name: 'Mens Linen Sherwani', sku: 'SHR-LIN-008', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100', price: 7999, comparePrice: 11999, stock: 5, status: 'Critical', category: 'Men' },
];

export default function Inventory() {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editComparePrice, setEditComparePrice] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    document.title = 'Inventory - BSC Exclusive Admin';
  }, []);

  const startEdit = (product: ProductItem) => {
    setEditingId(product.id);
    setEditPrice(product.price);
    setEditComparePrice(product.comparePrice);
  };

  const saveEdit = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price: editPrice, comparePrice: editComparePrice } : p));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const criticalCount = products.filter(p => p.status === 'Critical').length;
  const lowCount = products.filter(p => p.status === 'Low').length;

  const inputStyle = { width: '120px', padding: '6px 8px', border: '1px solid #B91C1C', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Inventory & Price Management</h1>
          <p>Manage stock levels and update product pricing across the catalog.</p>
        </div>
      </div>

      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-header">Total Inventory Value</div>
          <div className="stat-value">₹{totalValue.toLocaleString('en-IN')}</div>
          <div className="stat-sub" style={{ color: '#16a34a', fontWeight: 600, marginTop: '8px' }}>↗ 4.2% from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Total Products</div>
          <div className="stat-value">{products.length}</div>
          <div className="stat-sub" style={{ marginTop: '8px' }}>Across all categories</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Low Stock Alerts</div>
          <div className="stat-value" style={{ color: '#D97706' }}>{lowCount} Items</div>
          <div className="stat-sub" style={{ color: '#D97706', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={14} /> Below threshold</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Critical Stock</div>
          <div className="stat-value" style={{ color: '#DC2626' }}>{criticalCount} Items</div>
          <div className="stat-sub" style={{ color: '#DC2626', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={14} /> Immediate reorder</div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-title">
          <span>Product Inventory & Pricing</span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.85rem' }} />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.85rem' }}>
              <option value="all">All Status</option>
              <option value="Healthy">Healthy</option>
              <option value="Low">Low</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
        <table style={{ marginTop: '16px' }}>
          <thead>
            <tr>
              <th>Product / SKU</th>
              <th>Category</th>
              <th style={{ textAlign: 'center' }}>Price (₹)</th>
              <th style={{ textAlign: 'center' }}>Compare Price (₹)</th>
              <th>Stock</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#F1F5F9', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{product.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{product.sku}</div>
                  </div>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#64748B' }}>{product.category}</td>
                <td style={{ textAlign: 'center' }}>
                  {editingId === product.id ? (
                    <input type="number" style={inputStyle} value={editPrice} onChange={e => setEditPrice(Number(e.target.value))} />
                  ) : (
                    <span style={{ fontWeight: 700, color: '#B91C1C' }}>₹{product.price.toLocaleString('en-IN')}</span>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {editingId === product.id ? (
                    <input type="number" style={inputStyle} value={editComparePrice} onChange={e => setEditComparePrice(Number(e.target.value))} />
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{product.comparePrice.toLocaleString('en-IN')}</span>
                  )}
                </td>
                <td><span style={{ fontWeight: 600 }}>{product.stock}</span><span style={{ fontSize: '0.75rem', color: '#6B7280' }}> units</span></td>
                <td>
                  <span style={{
                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                    background: product.status === 'Healthy' ? '#DCFCE7' : product.status === 'Low' ? '#FEF3C7' : '#FEE2E2',
                    color: product.status === 'Healthy' ? '#166534' : product.status === 'Low' ? '#92400E' : '#991B1B'
                  }}>{product.status}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {editingId === product.id ? (
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button onClick={() => saveEdit(product.id)} style={{ background: '#16A34A', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}><Check size={14} /> Save</button>
                      <button onClick={cancelEdit} style={{ background: '#F1F5F9', color: '#64748B', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}><X size={14} /> Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(product)} style={{ background: '#F1F5F9', color: '#64748B', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, marginLeft: 'auto' }}><Edit3 size={14} /> Edit Price</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
