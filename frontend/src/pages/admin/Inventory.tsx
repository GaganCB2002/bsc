import { useEffect, useState } from 'react';
import { Package, Search, AlertTriangle, ArrowUpRight, ArrowDownRight, Edit2, CheckCircle2 } from 'lucide-react';

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = 'Inventory - BSC Exclusive Admin';
  }, []);

  const inventory = [
    { id: 'SKU-001', name: 'Kanchipuram Bridal Silk Saree', category: 'Women', stock: 24, reorder: 10, status: 'In Stock', lastUpdated: '2 hours ago' },
    { id: 'SKU-002', name: 'Banarasi Georgette Saree', category: 'Women', stock: 36, reorder: 15, status: 'In Stock', lastUpdated: '1 day ago' },
    { id: 'SKU-005', name: 'Designer Anarkali Suit', category: 'Women', stock: 8, reorder: 10, status: 'Low Stock', lastUpdated: '3 hours ago' },
    { id: 'SKU-008', name: 'Designer Patiala Suit', category: 'Women', stock: 5, reorder: 12, status: 'Low Stock', lastUpdated: '5 hours ago' },
    { id: 'SKU-010', name: 'Tissue Silk Saree', category: 'Women', stock: 0, reorder: 5, status: 'Out of Stock', lastUpdated: '1 week ago' },
    { id: 'SKU-012', name: 'Cotton Silk Blend Kurta', category: 'Men', stock: 120, reorder: 30, status: 'In Stock', lastUpdated: '2 days ago' },
  ];

  const filtered = inventory.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Inventory Management</h1>
          <p>Monitor stock levels, set reorder points, and manage inventory.</p>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-header">Total Stock Units</div>
          <div className="stat-value">1,432</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Low Stock Items</div>
          <div className="stat-value" style={{ color: '#D97706' }}>{inventory.filter(i => i.status === 'Low Stock').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Out of Stock</div>
          <div className="stat-value" style={{ color: '#DC2626' }}>{inventory.filter(i => i.status === 'Out of Stock').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">Inventory Value</div>
          <div className="stat-value" style={{ color: '#16a34a' }}>₹24.5L</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Package size={20} /> Stock List ({filtered.length})</span>
          <div style={{ display: 'flex', alignItems: 'center', background: '#F1F5F9', borderRadius: '8px', padding: '0 12px' }}>
            <Search size={16} color="#94A3B8" />
            <input type="text" placeholder="Search SKU or product..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ border: 'none', background: 'transparent', padding: '8px', fontSize: '0.85rem', outline: 'none', width: '240px' }} />
          </div>
        </div>

        <table style={{ marginTop: '16px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Product & SKU</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', textAlign: 'center' }}>Stock Available</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', textAlign: 'center' }}>Reorder Level</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Status</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Last Updated</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A1A2E' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace' }}>{item.id}</div>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: item.stock === 0 ? '#DC2626' : item.stock <= item.reorder ? '#D97706' : '#1A1A2E' }}>
                    {item.stock}
                  </span>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', textAlign: 'center', color: '#64748B', fontSize: '0.875rem' }}>
                  {item.reorder}
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600,
                    background: item.status === 'In Stock' ? '#DCFCE7' : item.status === 'Low Stock' ? '#FEF3C7' : '#FEE2E2',
                    color: item.status === 'In Stock' ? '#166534' : item.status === 'Low Stock' ? '#92400E' : '#991B1B'
                  }}>
                    {item.status === 'In Stock' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', fontSize: '0.8rem', color: '#64748B' }}>
                  {item.lastUpdated}
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button title="Increase Stock" style={{ background: '#DCFCE7', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#166534' }}><ArrowUpRight size={14} /></button>
                    <button title="Decrease Stock" style={{ background: '#FEE2E2', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#991B1B' }}><ArrowDownRight size={14} /></button>
                    <button title="Edit Item" style={{ background: '#F1F5F9', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#64748B' }}><Edit2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
