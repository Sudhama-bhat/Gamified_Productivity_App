import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, Save, TrendingUp } from 'lucide-react';

const DEFAULT = { level: '', xpRequired: '', title: '', badge: '' };

export default function AdminLevels() {
  const [levels, setLevels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(DEFAULT);

  const load = () => { api.get('/admin/levels').then(r => setLevels(r.data)); };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.level || !form.xpRequired || !form.title) return toast.error('Level number, XP required, and title are all required');
    try {
      await api.post('/admin/levels', { ...form, level: Number(form.level), xpRequired: Number(form.xpRequired) });
      toast.success('Level threshold saved');
      setShowModal(false); setForm(DEFAULT); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this level threshold?')) return;
    try { await api.delete(`/admin/levels/${id}`); toast.success('Level deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="animate-fade">
      <div className="page-header-row page-header">
        <div>
          <h1 className="page-title">Level Thresholds</h1>
          <p className="page-subtitle">Define XP milestones required to reach each level</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Add Level</button>
      </div>

      {/* Level progression table */}
      <div className="table-wrapper card mb-6" style={{ maxWidth: '720px' }}>
        <table>
          <thead>
            <tr>
              <th>Level</th>
              <th>Title</th>
              <th>XP Required</th>
              <th>Badge / Label</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {levels.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>No level thresholds configured yet</td>
              </tr>
            )}
            {levels.map((lvl, i) => (
              <tr key={lvl._id}>
                <td>
                  <div style={{ width: '32px', height: '32px', background: '#111', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>
                    {lvl.level}
                  </div>
                </td>
                <td><strong>{lvl.title}</strong></td>
                <td><strong>{lvl.xpRequired.toLocaleString()} XP</strong></td>
                <td>
                  {lvl.badge
                    ? <span style={{ fontSize: '0.8rem', background: '#f4f4f4', border: '1px solid #e2e2e2', padding: '3px 10px', borderRadius: '99px' }}>{lvl.badge}</span>
                    : <span style={{ color: '#aaa', fontSize: '0.78rem' }}>—</span>
                  }
                </td>
                <td>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={() => del(lvl._id)} title="Delete level"><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual progression */}
      {levels.length > 0 && (
        <div className="card" style={{ maxWidth: '720px' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '16px' }}>Level Progression Chart</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {levels.map((lvl, i) => {
              const maxXP = levels[levels.length - 1].xpRequired || 1;
              const pct = Math.round((lvl.xpRequired / maxXP) * 100);
              return (
                <div key={lvl._id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '56px', fontSize: '0.75rem', fontWeight: 700, color: '#555', textAlign: 'right' }}>Lv. {lvl.level}</div>
                  <div style={{ flex: 1, background: '#f0f0f0', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, background: '#111111', height: '100%', borderRadius: '4px' }} />
                  </div>
                  <div style={{ width: '90px', fontSize: '0.75rem', color: '#888' }}>{lvl.xpRequired.toLocaleString()} XP</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Add Level Threshold</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Level Number *</label>
              <input type="number" className="form-control" value={form.level} min={1} placeholder="e.g. 8"
                onChange={e => setForm(p => ({ ...p, level: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">XP Required *</label>
              <input type="number" className="form-control" value={form.xpRequired} min={0} placeholder="e.g. 5000"
                onChange={e => setForm(p => ({ ...p, xpRequired: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Level Title *</label>
              <input className="form-control" value={form.title} placeholder="e.g. Expert, Master, Legend..."
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Badge Label (optional)</label>
              <input className="form-control" value={form.badge} placeholder="e.g. Gold, Diamond..."
                onChange={e => setForm(p => ({ ...p, badge: e.target.value }))} />
              <p style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '4px' }}>Short text label shown next to the user's level</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn btn-primary" onClick={save}><Save size={14} /> Save Level</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
