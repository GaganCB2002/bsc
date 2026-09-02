import { useEffect } from 'react';
import { Shield, Users, Key, Plus, Trash2, Edit2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserRoles() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'User Roles & Permissions - BSC Exclusive Admin';
  }, []);

  const roles = [
    { id: '1', name: 'Super Admin', email: 'admin@bscexclusive.com', role: 'Super Admin', access: 'All Access', status: 'Active' },
    { id: '2', name: 'Raghu Weaver', email: 'raghu@bscexclusive.com', role: 'Store Manager', access: 'Products, Orders, Inventory', status: 'Active' },
    { id: '3', name: 'Marketing Team', email: 'marketing@bscexclusive.com', role: 'Marketer', access: 'Marketing, Coupons, Analytics', status: 'Active' },
    { id: '4', name: 'Customer Support', email: 'support@bscexclusive.com', role: 'Support Agent', access: 'Orders, Customers', status: 'Inactive' },
  ];

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>User Roles & Permissions</h1>
          <p>Manage staff accounts, assign roles, and configure access permissions.</p>
        </div>
        <button style={{ backgroundColor: '#B91C1C', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Invite User
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#EFF6FF', padding: '12px', borderRadius: '12px', color: '#1E40AF' }}><Shield size={24} /></div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A2E' }}>4 Roles</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Custom access levels</div>
            </div>
          </div>
        </div>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#F0FDF4', padding: '12px', borderRadius: '12px', color: '#16A34A' }}><Users size={24} /></div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A2E' }}>3 Active</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Staff members</div>
            </div>
          </div>
        </div>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#FEF2F2', padding: '12px', borderRadius: '12px', color: '#B91C1C' }}><Key size={24} /></div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A2E' }}>2FA Enforced</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Security Status</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Lock size={20} /> Staff Accounts</span>
        </div>

        <table style={{ marginTop: '16px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>User</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Role</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Access Areas</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>Status</th>
              <th style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(staff => (
              <tr key={staff.id}>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1A1A2E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A1A2E', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {staff.name} {user?.email === staff.email && <span style={{ background: '#FEE2E2', color: '#B91C1C', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem' }}>You</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{staff.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ background: '#F1F5F9', color: '#1E293B', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>{staff.role}</span>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', fontSize: '0.8rem', color: '#475569' }}>
                  {staff.access}
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600,
                    background: staff.status === 'Active' ? '#DCFCE7' : '#F1F5F9',
                    color: staff.status === 'Active' ? '#166534' : '#64748B'
                  }}>{staff.status}</span>
                </td>
                <td style={{ padding: '16px 0', borderBottom: '1px solid #E2E8F0', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button title="Edit User" style={{ background: '#F1F5F9', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#64748B' }}><Edit2 size={14} /></button>
                    {staff.role !== 'Super Admin' && (
                      <button title="Revoke Access" style={{ background: '#FEE2E2', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', color: '#B91C1C' }}><Trash2 size={14} /></button>
                    )}
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
