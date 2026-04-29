import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { UserX, UserCheck, Pencil, Search, Trash2 } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  const load = () => {
    setLoading(true);
    api.get('/admin/users').then(r => { setUsers(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const toggle = async (u) => {
    try {
      await api.put(`/admin/users/${u._id}`, { isActive: !u.isActive });
      toast.success(u.isActive ? 'User deactivated' : 'User activated');
      load();
    } catch { toast.error('Action failed'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    try { await api.delete(`/admin/users/${id}`); toast.success('User deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const saveEdit = async () => {
    try {
      await api.put(`/admin/users/${editUser._id}`, editForm);
      toast.success('User updated'); setEditUser(null); load();
    } catch { toast.error('Update failed'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const userOnly = filtered.filter(u => u.role === 'user');

  return (
    <div className="animate-fade">
      <div className="page-header-row page-header">
        <div>
          <h1 className="page-title">Manage Users</h1>
          <p className="page-subtitle">View and manage all registered users on the platform</p>
        </div>
      </div>

      <div className="card mb-6">
        <div style={{ position: 'relative', maxWidth: '320px' }}>
          <Search size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
          <input className="form-control" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '34px' }} />
        </div>
      </div>

      <div className="table-wrapper card">
        {loading ? <div className="spinner" /> : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Level</th>
                <th>XP</th>
                <th>Tasks Done</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td><strong>{u.name}</strong></td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                  <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                  <td>Lv. {u.level}</td>
                  <td><strong>{u.xp} XP</strong></td>
                  <td>{u.tasksCompleted}</td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-completed' : 'badge-pending'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-secondary btn-icon btn-sm"
                        onClick={() => { setEditUser(u); setEditForm({ name: u.name, email: u.email }); }}
                        title="Edit user">
                        <Pencil size={13} />
                      </button>
                      <button className={`btn btn-icon btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => toggle(u)}
                        title={u.isActive ? 'Deactivate user' : 'Activate user'}>
                        {u.isActive ? <UserX size={13} /> : <UserCheck size={13} />}
                      </button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => del(u._id)} title="Delete user">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: '#aaa', padding: '40px' }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="modal-overlay" onClick={() => setEditUser(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Edit User</span>
              <button className="modal-close" onClick={() => setEditUser(null)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" value={editForm.name || ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-control" type="email" value={editForm.email || ''} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
              <button className="btn btn-secondary" onClick={() => setEditUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
