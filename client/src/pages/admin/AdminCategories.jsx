import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';

const colors = ['#111111', '#374151', '#1e40af', '#065f46', '#92400e', '#7f1d1d', '#5b21b6'];

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', color: '#111111', icon: 'T' });

  const load = () => { api.get('/admin/categories').then(r => setCats(r.data)); };
  useEffect(() => { load(); }, []);

  const open = (cat = null) => {
    setEditing(cat);
    setForm(cat
      ? { name: cat.name, description: cat.description || '', color: cat.color || '#111111', icon: cat.icon || cat.name?.[0] || 'T' }
      : { name: '', description: '', color: '#111111', icon: 'T' });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.name) return toast.error('Category name is required');
    try {
      if (editing) await api.put(`/admin/categories/${editing._id}`, form);
      else await api.post('/admin/categories', form);
      toast.success(editing ? 'Category updated' : 'Category created');
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this category? Tasks using it may be affected.')) return;
    try { await api.delete(`/admin/categories/${id}`); toast.success('Category deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="animate-fade">
      <div className="page-header-row page-header">
        <div>
          <h1 className="page-title">Task Categories</h1>
          <p className="page-subtitle">Manage categories used to organise tasks on the platform</p>
        </div>
        <button className="btn btn-primary" onClick={() => open()}><Plus size={15} /> Add Category</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '14px' }}>
        {cats.map(cat => (
          <div key={cat._id} className="card" style={{ borderLeft: `3px solid ${cat.color || '#111111'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: cat.color || '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                  {(cat.icon || cat.name?.[0] || 'T').slice(0, 1).toUpperCase()}
                </div>
                <strong style={{ fontSize: '0.9rem' }}>{cat.name}</strong>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button className="btn btn-secondary btn-icon btn-sm" onClick={() => open(cat)} title="Edit"><Pencil size={13} /></button>
                <button className="btn btn-danger btn-icon btn-sm" onClick={() => del(cat._id)} title="Delete"><Trash2 size={13} /></button>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{cat.description || 'No description provided'}</p>
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`badge ${cat.isActive !== false ? 'badge-completed' : 'badge-pending'}`}>{cat.isActive !== false ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        ))}
        {!cats.length && (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="empty-icon"><Tag size={36} color="#ccc" /></div>
            <h3>No categories yet</h3>
            <p>Create your first task category to get started.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Category' : 'New Category'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Category Name *</label>
              <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Development, Marketing..." />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-control" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of this category" />
            </div>
            <div className="form-group">
              <label className="form-label">Color</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                {colors.map(c => (
                  <button key={c} type="button" onClick={() => setForm(p => ({ ...p, color: c }))}
                    style={{ width: '28px', height: '28px', borderRadius: '6px', background: c, border: form.color === c ? '3px solid #111' : '2px solid transparent', cursor: 'pointer', outline: 'none', boxShadow: form.color === c ? '0 0 0 2px white' : 'none' }} />
                ))}
                <input type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                  style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer', padding: '2px' }} title="Custom color" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn btn-primary" onClick={save}>{editing ? 'Save Changes' : 'Create Category'}</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
