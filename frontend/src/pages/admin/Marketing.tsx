import { useEffect } from 'react';
import { Megaphone, Mail, MessageSquare, PlayCircle, Plus, Send, Clock, PauseCircle } from 'lucide-react';

export default function Marketing() {
  useEffect(() => {
    document.title = 'Marketing - BSC Exclusive Admin';
  }, []);

  const campaigns = [
    { id: 1, name: 'Diwali Festive Sale', channel: 'Email', status: 'Scheduled', reach: '15,000', openRate: '-', date: 'Oct 15, 2026', type: <Mail size={16} /> },
    { id: 2, name: 'New Bridal Collection', channel: 'SMS', status: 'Sent', reach: '5,200', openRate: '92%', date: 'Sep 1, 2026', type: <MessageSquare size={16} /> },
    { id: 3, name: 'Welcome Series (Automated)', channel: 'Email', status: 'Active', reach: '450/mo', openRate: '68%', date: 'Ongoing', type: <PlayCircle size={16} /> },
    { id: 4, name: 'Summer Clearance', channel: 'Email', status: 'Paused', reach: '12,000', openRate: '45%', date: 'Aug 10, 2026', type: <PauseCircle size={16} /> },
  ];

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Marketing Campaigns</h1>
          <p>Create, manage, and track email and SMS marketing campaigns.</p>
        </div>
        <button style={{ backgroundColor: '#B91C1C', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> New Campaign
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#EFF6FF', padding: '12px', borderRadius: '12px', color: '#1E40AF' }}><Mail size={24} /></div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A2E' }}>24.5k</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Email Subscribers</div>
            </div>
          </div>
        </div>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#F0FDF4', padding: '12px', borderRadius: '12px', color: '#16A34A' }}><MessageSquare size={24} /></div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A2E' }}>12.1k</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>SMS Subscribers</div>
            </div>
          </div>
        </div>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#FEF2F2', padding: '12px', borderRadius: '12px', color: '#B91C1C' }}><Megaphone size={24} /></div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A2E' }}>14.2%</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Avg. Conversion Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Megaphone size={20} /> Recent Campaigns</span>
        </div>
        
        <table style={{ marginTop: '16px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Campaign Name</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Status</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Reach</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Open Rate</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Date</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(camp => (
              <tr key={camp.id}>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: '#64748B', background: '#F1F5F9', padding: '8px', borderRadius: '8px' }}>{camp.type}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1A1A2E' }}>{camp.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{camp.channel} Campaign</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600,
                    background: camp.status === 'Active' || camp.status === 'Sent' ? '#DCFCE7' : camp.status === 'Scheduled' ? '#DBEAFE' : '#F1F5F9',
                    color: camp.status === 'Active' || camp.status === 'Sent' ? '#166534' : camp.status === 'Scheduled' ? '#1E40AF' : '#64748B'
                  }}>
                    {camp.status === 'Sent' ? <Send size={12} /> : camp.status === 'Scheduled' ? <Clock size={12} /> : null}
                    {camp.status}
                  </span>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', fontWeight: 600, color: '#1E293B' }}>{camp.reach}</td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', fontWeight: 600, color: '#1E293B' }}>{camp.openRate}</td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', fontSize: '0.85rem', color: '#64748B' }}>{camp.date}</td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', textAlign: 'right' }}>
                  <button style={{ background: '#F1F5F9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: '#1E293B', fontWeight: 600, fontSize: '0.75rem' }}>View Report</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
