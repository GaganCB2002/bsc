import { useEffect, useState } from 'react';
import { History, Trash2, Eye, RefreshCw } from 'lucide-react';
import { tryOnService } from '../../services/tryOnService';
import { showToast } from '../../components/Toast';

interface Generation {
  _id: string;
  status: string;
  productName: string;
  productImage: string;
  resultImage: string;
  createdAt: string;
  completedAt?: string;
  processingTime?: number;
  provider?: string;
  errorMessage?: string;
  userId?: { name: string; email: string };
  modelId?: { name: string; imageUrl: string };
}

export default function TryOnHistory() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingGen, setViewingGen] = useState<Generation | null>(null);

  const loadGenerations = async () => {
    setLoading(true);
    try {
      const res = await tryOnService.adminGetGenerations({ status: statusFilter, limit: 50 });
      if (res.success) setGenerations(res.data);
    } catch {
      showToast('error', 'Failed to load generations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Try-On History - BSC Exclusive Admin';
    const fetchGenerations = async () => {
      setLoading(true);
      try {
        const res = await tryOnService.adminGetGenerations({ status: statusFilter, limit: 50 });
        if (res.success) setGenerations(res.data);
      } catch {
        showToast('error', 'Failed to load generations');
      } finally {
        setLoading(false);
      }
    };
    fetchGenerations();
  }, [statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this generation record?')) return;
    try {
      await tryOnService.adminDeleteGeneration(id);
      showToast('success', 'Generation deleted');
      loadGenerations();
    } catch {
      showToast('error', 'Failed to delete generation');
    }
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    completed: { bg: '#DCFCE7', text: '#166534' },
    failed: { bg: '#FEE2E2', text: '#991B1B' },
    processing: { bg: '#FEF3C7', text: '#92400E' },
    pending: { bg: '#E0E7FF', text: '#3730A3' },
    cancelled: { bg: '#F1F5F9', text: '#64748B' },
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={24} color="#B91C1C" /> Generation History
          </h1>
          <p>View and manage all virtual try-on generation requests.</p>
        </div>
        <button onClick={loadGenerations} style={{
          backgroundColor: '#fff', color: '#64748B', padding: '10px 20px', border: '1px solid #E2E8F0',
          borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', 'completed', 'failed', 'processing', 'pending', 'cancelled'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: '6px 14px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer',
            background: statusFilter === s ? '#B91C1C' : '#F1F5F9',
            color: statusFilter === s ? '#fff' : '#64748B',
          }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #F1F5F9', borderTopColor: '#B91C1C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : generations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <History size={40} color="#94A3B8" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1rem', color: '#1E293B', marginBottom: '8px' }}>No generations found</h3>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Try-on generations will appear here once customers start using the feature.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>Request</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>User</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>Product</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>Model</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748B' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {generations.map((gen) => {
                  const sc = statusColors[gen.status] || statusColors.pending;
                  return (
                    <tr key={gen._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px', color: '#94A3B8', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                        {gen._id.slice(-8)}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#1E293B' }}>{gen.userId?.name || 'N/A'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{gen.userId?.email || ''}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img src={gen.productImage} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                          <span style={{ fontWeight: 500, color: '#1E293B', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {gen.productName || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#64748B' }}>{gen.modelId?.name || 'Custom'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600,
                          background: sc.bg, color: sc.text,
                        }}>
                          {gen.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#94A3B8', fontSize: '0.75rem' }}>
                        {new Date(gen.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {gen.resultImage && (
                            <button onClick={() => setViewingGen(gen)} style={{
                              padding: '4px 8px', background: '#F1F5F9', border: 'none', borderRadius: '4px',
                              cursor: 'pointer', color: '#64748B',
                            }} title="View result">
                              <Eye size={14} />
                            </button>
                          )}
                          <button onClick={() => handleDelete(gen._id)} style={{
                            padding: '4px 8px', background: '#FEE2E2', border: 'none', borderRadius: '4px',
                            cursor: 'pointer', color: '#B91C1C',
                          }} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Result Modal */}
      {viewingGen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={() => setViewingGen(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{
            position: 'relative', background: '#fff', borderRadius: '12px', padding: '24px',
            maxWidth: '500px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: '#1E293B' }}>
              {viewingGen.productName || 'Try-On Result'}
            </h3>
            <img src={viewingGen.resultImage} alt="Try-on result" style={{
              width: '100%', borderRadius: '8px', marginBottom: '12px',
            }} />
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Status: {viewingGen.status} · {viewingGen.processingTime ? `${viewingGen.processingTime}ms` : 'N/A'}
            </div>
            <button onClick={() => setViewingGen(null)} style={{
              position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)',
              color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>×</button>
          </div>
        </div>
      )}
    </>
  );
}
