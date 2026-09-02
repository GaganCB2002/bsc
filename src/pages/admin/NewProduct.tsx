import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NewProduct() {
  useEffect(() => {
    document.title = 'New Product - BSC Exclusive Admin';
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>
            <Link to="/admin/catalog" style={{ color: '#6b7280', textDecoration: 'none' }}>&larr; Back to Catalog</Link>
          </div>
          <h1>Add New Product</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            backgroundColor: '#fff',
            color: '#111827',
            border: '1px solid #e5e7eb',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Save as Draft
          </button>
          <button style={{
            backgroundColor: '#4f46e5',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Publish Product
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="col-left">
          <div className="card">
            <div className="card-title">Basic Information</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Product Title</label>
                <input type="text" placeholder="e.g. Kanchipuram Bridal Silk Saree" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Description</label>
                <textarea rows={6} placeholder="Describe the fabric, weave, origin, and occasion..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', fontFamily: 'inherit', resize: 'vertical' }}></textarea>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Media</div>
            <div style={{ 
              border: '2px dashed #e5e7eb', 
              borderRadius: '8px', 
              padding: '40px', 
              textAlign: 'center', 
              marginTop: '16px',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📷</div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px' }}>Upload images & video</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Drag and drop or click to browse</div>
              <button style={{ marginTop: '16px', border: '1px solid #e5e7eb', background: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Browse Files</button>
            </div>
          </div>
          
          <div className="card">
            <div className="card-title">Pricing & Inventory</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Price (₹)</label>
                <input type="number" placeholder="0.00" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Compare at Price (₹)</label>
                <input type="number" placeholder="0.00" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>SKU (Stock Keeping Unit)</label>
                <input type="text" placeholder="e.g. SAREE-KNC-001" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Initial Quantity</label>
                <input type="number" defaultValue="0" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-right">
          <div className="card">
            <div className="card-title">Organization</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Category</label>
                <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem' }}>
                  <option>Women</option>
                  <option>Men</option>
                  <option>Kids</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Sub-Category</label>
                <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem' }}>
                  <option>Sarees</option>
                  <option>Lehengas</option>
                  <option>Kurtis</option>
                  <option>Salwar Suits</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Tags</label>
                <input type="text" placeholder="Bridal, Silk, Kanchipuram..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
