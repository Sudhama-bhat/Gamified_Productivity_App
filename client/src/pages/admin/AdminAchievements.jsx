import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Award } from 'lucide-react';

const CONDITION_TYPES = ['tasks_completed', 'xp_earned', 'streak', 'level_reached', 'first_task'];
const DEFAULT = { name: '', description: '', icon: '', conditionType: 'tasks_completed', conditionValue: 10, xpBonus: 0 };

const condLabel = {
  tasks_completed: 'Tasks Completed',
  xp_earned: 'XP Earned',
  streak: 'Day Streak',
  level_reached: 'Level Reached',
  first_task: 'First Task',
};

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(DEFAULT);

  const load = () => { api.get('/admin/achievements').then(r => setAchievements(r.data)); };
  useEffect(() => { load(); }, []);

  const open = (a = null) => {
    setEditing(a);
    setForm(a ? {
      name: a.name, description: a.description, icon: a.icon || '',
      conditionType: a.conditionType, conditionValue: a.conditionValue, xpBonus: a.xpBonus || 0
    } : DEFAULT);
    setShowModal(true);
  };

  const save = async () => {
    if (!form.name || !form.description) return toast.error('Name and description are required');
    try {
      if (editing) await api.put(`/admin/achievements/${editing._id}`, form);
      else await api.post('/admin/achievements', form);
      toast.success(editing ? 'Achievement updated' : 'Achievement created');
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this achievement?')) return;
    try { await api.delete(`/admin/achievements/${id}`); toast.success('Achievement deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="animate-fade">
      <div className="page-header-row page-header">
        <div>
          <h1 className="page-title">Achievements & Badges</h1>
          <p className="page-subtitle">Configure gamification milestones and unlock conditions</p>
        </div>
        <button className="btn btn-primary" onClick={() => open()}><Plus size={15} /> Add Achievement</button>
      </div>

      <div className="achievement-grid">
        {achievements.map(a => (
          <div key={a._id} className="achievement-card" style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', background: '#111', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Award size={20} color="white" />
                </div>
                <div>
                  <strong style={{ fontSize: '0.875rem' }}>{a.name}</strong>
                  <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '2px' }}>
                    {condLabel[a.conditionType]} ≥ {a.conditionValue}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                <button className="btn btn-secondary btn-icon btn-sm" onClick={() => open(a)} title="Edit"><Pencil size={12} /></button>
                <button className="btn btn-danger btn-icon btn-sm" onClick={() => del(a._id)} title="Delete"><Trash2 size={12} /></button>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#888' }}>{a.description}</p>
            {a.xpBonus > 0 && (
              <div style={{ marginTop: '10px', fontSize: '0.72rem', fontWeight: 600, color: '#555', background: '#f4f4f4', border: '1px solid #e2e2e2', borderRadius: '4px', padding: '4px 8px', display: 'inline-block' }}>
                +{a.xpBonus} XP Bonus on unlock
              </div>
            )}
          </div>
        ))}
        {!achievements.length && (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="empty-icon"><Award size={36} color="#ccc" /></div>
            <h3>No achievements configured</h3>
            <p>Create your first achievement to motivate users.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Achievement' : 'New Achievement'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Achievement Name *</label>
              <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Task Champion" />
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <input className="form-control" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of how to earn this" />
            </div>
            <div className="form-group">
              <label className="form-label">Condition Type *</label>
              <select className="form-control" value={form.conditionType} onChange={e => setForm(p => ({ ...p, conditionType: e.target.value }))}>
                {CONDITION_TYPES.map(t => <option key={t} value={t}>{condLabel[t]}</option>)}
              </select>
            </div>
            {form.conditionType !== 'first_task' && (
              <div className="form-group">
                <label className="form-label">Condition Value (threshold)</label>
                <input type="number" className="form-control" value={form.conditionValue} min={1}
                  onChange={e => setForm(p => ({ ...p, conditionValue: Number(e.target.value) }))}
                  placeholder="e.g. 10 tasks, 500 XP..." />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">XP Bonus on Unlock</label>
              <input type="number" className="form-control" value={form.xpBonus} min={0}
                onChange={e => setForm(p => ({ ...p, xpBonus: Number(e.target.value) }))}
                placeholder="0 for no bonus" />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn btn-primary" onClick={save}>{editing ? 'Save Changes' : 'Create Achievement'}</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
