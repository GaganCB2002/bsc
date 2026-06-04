import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Staff';
  status: 'Active' | 'Inactive';
}

const mockUsers: User[] = [
  { id: '1', name: 'Gagan BSSC', email: 'gagan@bschannabasappa.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Priya Sharma', email: 'priya@bschannabasappa.com', role: 'Manager', status: 'Active' },
  { id: '3', name: 'Rahul Desai', email: 'rahul@bschannabasappa.com', role: 'Staff', status: 'Active' },
  { id: '4', name: 'Anita Kumar', email: 'anita@bschannabasappa.com', role: 'Manager', status: 'Inactive' },
  { id: '5', name: 'Vikram Singh', email: 'vikram@bschannabasappa.com', role: 'Staff', status: 'Active' },
];

export default function UserRoles() {
  useEffect(() => {
    document.title = 'User Roles - BS Channabasappa Admin';
  }, []);

  const [users, setUsers] = useState<User[]>(mockUsers);

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>User Roles & Permissions</h1>
          <p>Manage staff access to the BS Channabasappa retail ecosystem.</p>
        </div>
        <button style={{
          backgroundColor: '#4f46e5',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          + Invite User
        </button>
      </div>

      <div className="card">
        <div className="card-title">Team Members</div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ fontWeight: 600 }}>{user.name}</td>
                <td style={{ color: '#6b7280' }}>{user.email}</td>
                <td>
                  <span style={{
                    backgroundColor: user.role === 'Admin' ? '#fef3c7' : user.role === 'Manager' ? '#e0e7ff' : '#f3f4f6',
                    color: user.role === 'Admin' ? '#92400e' : user.role === 'Manager' ? '#3730a3' : '#4b5563',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span style={{
                    backgroundColor: user.status === 'Active' ? '#dcfce7' : '#fee2e2',
                    color: user.status === 'Active' ? '#166534' : '#991b1b',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    onClick={() => toggleStatus(user.id)}
                    style={{
                      background: 'transparent',
                      border: '1px solid #e5e7eb',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      marginRight: '8px'
                    }}
                  >
                    Toggle Status
                  </button>
                  <button style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#4f46e5',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: 600
                  }}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
