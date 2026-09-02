import { useEffect } from 'react';
import { Tag, Plus, Edit3, Trash2, Box, Layers } from 'lucide-react';

export default function Catalog() {
  useEffect(() => {
    document.title = 'Catalog & Collections - BSC Exclusive Admin';
  }, []);

  const collections = [
    { id: 'COL-01', name: 'Bridal Kanchipuram', products: 45, status: 'Active', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400' },
    { id: 'COL-02', name: 'Festive Banarasi', products: 32, status: 'Active', image: 'https://images.unsplash.com/photo-1771654099745-73a4a4d09bcd?w=400' },
    { id: 'COL-03', name: 'Men\'s Ethnic', products: 28, status: 'Active', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400' },
    { id: 'COL-04', name: 'Summer Cottons', products: 0, status: 'Draft', image: 'https://images.unsplash.com/photo-1771654805161-442c6aab7b55?w=400' },
  ];

  const categories = [
    { name: 'Women', subcategories: ['Sarees', 'Lehengas', 'Kurti Sets', 'Dupattas'], count: 185 },
    { name: 'Men', subcategories: ['Kurtas', 'Sherwanis', 'Jackets', 'Dhotis'], count: 92 },
    { name: 'Kids', subcategories: ['Boys Ethnic', 'Girls Ethnic', 'Infants'], count: 45 },
    { name: 'Accessories', subcategories: ['Jewelry', 'Bags', 'Footwear'], count: 64 },
  ];

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Catalog & Collections</h1>
          <p>Manage product categories, collections, and catalog taxonomy.</p>
        </div>
        <button style={{ backgroundColor: '#B91C1C', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> New Collection
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Layers size={20} /> Featured Collections</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            {collections.map(col => (
              <div key={col.id} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '120px', background: '#F1F5F9', position: 'relative' }}>
                  <img src={col.image} alt={col.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '12px', right: '12px', background: col.status === 'Active' ? '#166534' : '#64748B', color: '#fff', fontSize: '0.65rem', fontWeight: 600, padding: '4px 8px', borderRadius: '4px' }}>
                    {col.status}
                  </span>
                </div>
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '4px' }}>{col.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Box size={14} /> {col.products} Products
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button style={{ flex: 1, padding: '8px', background: '#F1F5F9', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#1E293B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Edit3 size={14} /> Edit</button>
                    <button style={{ padding: '8px', background: '#FEE2E2', border: 'none', borderRadius: '6px', color: '#B91C1C', cursor: 'pointer' }}><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Tag size={20} /> Categories</span>
            <button style={{ background: 'none', border: 'none', color: '#B91C1C', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={14} /> Add Category
            </button>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categories.map((cat, i) => (
              <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1A1A2E' }}>{cat.name}</h4>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', background: '#F1F5F9', padding: '2px 8px', borderRadius: '12px' }}>{cat.count} items</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {cat.subcategories.map((sub, j) => (
                    <span key={j} style={{ fontSize: '0.7rem', color: '#475569', border: '1px solid #CBD5E1', padding: '2px 8px', borderRadius: '12px' }}>{sub}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
