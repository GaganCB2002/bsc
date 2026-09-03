import { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, XCircle, Clock, Activity, TrendingUp } from 'lucide-react';
import { tryOnService } from '../../services/tryOnService';

interface Stats {
  totalGenerations: number;
  successfulGenerations: number;
  failedGenerations: number;
  successRate: number;
  activeModelsCount: number;
  avgProcessingTime: number;
  recentGenerations: Array<{
    _id: string;
    status: string;
    productName: string;
    createdAt: string;
    userId?: { name: string; email: string };
    modelId?: { name: string };
  }>;
}

export default function TryOnOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const res = await tryOnService.adminGetStats();
      if (res.success) setStats(res.data);
    } catch {
      // Use default stats
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Virtual Try-On Overview - BSC Exclusive Admin';
    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #F1F5F9', borderTopColor: '#B91C1C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const cards = [
    { label: 'Total Generations', value: stats?.totalGenerations || 0, icon: <Activity size={22} />, color: '#3b82f6', bg: '#EFF6FF' },
    { label: 'Successful', value: stats?.successfulGenerations || 0, icon: <CheckCircle size={22} />, color: '#16a34a', bg: '#F0FDF4' },
    { label: 'Failed', value: stats?.failedGenerations || 0, icon: <XCircle size={22} />, color: '#DC2626', bg: '#FEF2F2' },
    { label: 'Active Models', value: stats?.activeModelsCount || 0, icon: <Sparkles size={22} />, color: '#7C3AED', bg: '#F5F3FF' },
    { label: 'Success Rate', value: `${stats?.successRate || 0}%`, icon: <TrendingUp size={22} />, color: '#16a34a', bg: '#F0FDF4' },
    { label: 'Avg Processing', value: `${stats?.avgProcessingTime || 0}ms`, icon: <Clock size={22} />, color: '#F59E0B', bg: '#FFFBEB' },
  ];

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={24} color="#B91C1C" /> Virtual Try-On Overview
          </h1>
          <p>Monitor virtual try-on generation statistics and recent activity.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {cards.map((card, i) => (
          <div key={i} style={{
            background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px',
            padding: '20px', display: 'flex', alignItems: 'center', gap: '14px',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px', background: card.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color,
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1E293B' }}>{card.value}</div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', fontWeight: 600, fontSize: '0.9rem', color: '#1E293B' }}>
          Recent Activity
        </div>
        {stats?.recentGenerations && stats.recentGenerations.length > 0 ? (
          <div>
            {stats.recentGenerations.map((gen) => (
              <div key={gen._id} style={{
                padding: '14px 20px', borderBottom: '1px solid #F1F5F9',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>
                    {gen.productName || 'Unknown Product'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    {gen.userId?.name || 'User'} · {gen.modelId?.name || 'Model'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600,
                    background: gen.status === 'completed' ? '#DCFCE7' : gen.status === 'failed' ? '#FEE2E2' : '#FEF3C7',
                    color: gen.status === 'completed' ? '#166534' : gen.status === 'failed' ? '#991B1B' : '#92400E',
                  }}>
                    {gen.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    {new Date(gen.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
            No recent try-on activity yet.
          </div>
        )}
      </div>
    </>
  );
}
