import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, CheckCircle, Pencil, Trash2, Filter, ClipboardList, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DEFAULT = { title: '', description: '', categoryId: '', difficulty: 'Easy', dueDate: '', priority: 'Medium' };

export default function UserTasks() {
  const { update } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(DEFAULT);
  const [filter, setFilter] = useState('all');
  const [xpPopup, setXpPopup] = useState(null);

  const load = () => { Promise.all([api.get('/user/tasks'), api.get('/user/categories')]).then(([t, c]) => { setTasks(t.data); setCategories(c.data); }); };
  useEffect(() => { load(); }, []);

  const open = (task = null) => {
    setEditing(task);
    setForm(task ? { title: task.title, description: task.description, categoryId: task.category?._id || '', difficulty: task.difficulty, dueDate: task.dueDate?.slice(0, 10) || '', priority: task.priority } : DEFAULT);
    setShowModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title || !form.categoryId) return toast.error('Title and category required');
    try {
      if (editing) await api.put(`/user/tasks/${editing._id}`, form);
      else await api.post('/user/tasks', form);
      toast.success(editing ? 'Task updated' : 'Task created successfully!');
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this task?')) return;
    try { await api.delete(`/user/tasks/${id}`); toast.success('Task deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const complete = async (task) => {
    try {
      const { data } = await api.put(`/user/tasks/${task._id}/complete`);
      setXpPopup({ xp: data.xpEarned, achievements: data.newAchievements });
      update({ xp: data.newXP, level: data.level });
      toast.success(`+${data.xpEarned} XP Earned!`);
      if (data.newAchievements?.length) {
        data.newAchievements.forEach(a => toast.success(`Achievement Unlocked: ${a.name}!`, { duration: 5000 }));
      }
      load();
      setTimeout(() => setXpPopup(null), 3000);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to complete task'); }
  };

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="animate-fade">
      <div className="page-header-row page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">Create tasks, complete objectives, earn XP</p>
        </div>
        <button className="btn btn-primary" onClick={() => open()}><Plus size={15} /> New Task</button>
      </div>

      {/* XP Popup */}
      {xpPopup && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
          <div style={{ background: '#fffbeb', border: '2px solid #fde68a', borderRadius: '12px', padding: '16px 24px', textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.2)' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '-1px' }}>+{xpPopup.xp} XP!</div>
            <div style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>Task Completed</div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', 'pending', 'in-progress', 'completed'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All Tasks' : f.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            <span style={{ marginLeft: '6px', background: filter === f ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)', borderRadius: '999px', padding: '1px 7px', fontSize: '0.7rem' }}>
              {f === 'all' ? tasks.length : tasks.filter(t => t.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '40px' }}>
          <div className="empty-icon"><ClipboardList size={40} color="#ccc" /></div>
          <h3>No tasks found</h3>
          <p>Create your first task to start your productivity journey and earn XP!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filtered.map(task => (
            <div key={task._id} className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}>
              <div className="task-card-header">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: task.category?.color || '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.65rem', fontWeight: 700 }}>
                      {(task.category?.icon || task.category?.name?.[0] || 'T').slice(0, 1).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>{task.category?.name}</span>
                  </div>
                  <div className="task-card-title" style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>{task.title}</div>
                </div>
                <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, alignSelf: 'flex-start', background: '#fffbeb', padding: '2px 8px', borderRadius: '999px' }}>
                  +{task.xpReward}XP
                </div>
              </div>
              {task.description && <p className="task-card-desc">{task.description}</p>}
              
              <div className="task-card-footer">
                <div className="task-card-tags">
                  <span className={`badge badge-${task.difficulty?.toLowerCase()}`}>{task.difficulty}</span>
                  <span className={`badge badge-${task.status}`}>{task.status.replace('-', ' ')}</span>
                  <span className={`badge badge-${task.priority?.toLowerCase()}`}>{task.priority} Priority</span>
                </div>
              </div>
              
              {task.dueDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#888', marginTop: '12px' }}>
                  <Calendar size={12} /> Due: {new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
              )}
              
              {task.status !== 'completed' && (
                <div style={{ display: 'flex', gap: '6px', marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => complete(task)} style={{ flex: 1 }}>
                    <CheckCircle size={14} /> Complete
                  </button>
                  <button className="btn btn-secondary btn-icon btn-sm" onClick={() => open(task)} title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={() => del(task._id)} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
              
              {task.status === 'completed' && (
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px', background: '#ecfdf5', padding: '6px 10px', borderRadius: '6px', justifyContent: 'center' }}>
                  <CheckCircle size={14} /> Completed {new Date(task.completedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Task' : 'New Task'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={save}>
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input className="form-control" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="What needs to be done?" />
              </div>
              <div className="form-group">
                <label className="form-label">Description (optional)</label>
                <textarea className="form-control" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Add any extra details here..." rows={3} style={{ resize: 'vertical' }} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-control" value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}>
                    <option value="">Select a category...</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select className="form-control" value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))}>
                    <option value="Easy">Easy (Base XP)</option>
                    <option value="Medium">Medium (More XP)</option>
                    <option value="Hard">Hard (Max XP!)</option>
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-control" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                    {['Low', 'Medium', 'High'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date (optional)</label>
                  <input type="date" className="form-control" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button className="btn btn-primary" type="submit" style={{ flex: 1 }}>{editing ? 'Save Changes' : 'Create Task'}</button>
                <button className="btn btn-secondary" type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
