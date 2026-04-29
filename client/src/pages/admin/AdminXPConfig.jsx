import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Save, Zap } from 'lucide-react';

const DIFFS = ['Easy', 'Medium', 'Hard'];

export default function AdminXPConfig() {
  const [config, setConfig] = useState({
    Easy: { xpPoints: 10, bonusMultiplier: 1 },
    Medium: { xpPoints: 25, bonusMultiplier: 1 },
    Hard: { xpPoints: 50, bonusMultiplier: 1 },
  });
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    api.get('/admin/xp-config').then(r => {
      const map = {};
      r.data.forEach(c => { map[c.difficulty] = { xpPoints: c.xpPoints, bonusMultiplier: c.bonusMultiplier }; });
      setConfig(p => ({ ...p, ...map }));
    });
  }, []);

  const save = async (diff) => {
    setSaving(diff);
    try {
      await api.post('/admin/xp-config', { difficulty: diff, ...config[diff] });
      toast.success(`${diff} difficulty XP rules saved`);
    } catch { toast.error('Failed to save'); }
    finally { setSaving(null); }
  };

  const diffDesc = {
    Easy: 'Beginner-level tasks. Assigned to straightforward, quick-completion activities.',
    Medium: 'Intermediate tasks that require moderate effort and time investment.',
    Hard: 'Advanced tasks that require significant skill, time, or complexity.',
  };

  return (
    <div className="animate-fade">
      <div className="page-header">
        <h1 className="page-title">XP Allocation Rules</h1>
        <p className="page-subtitle">Configure experience points awarded per task difficulty level</p>
      </div>

      <div className="card mb-6" style={{ maxWidth: '700px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', background: '#f4f4f4', border: '1px solid #e2e2e2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={18} color="#555" />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111', marginBottom: '4px' }}>How XP Allocation Works</p>
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              When a user completes a task, they earn the XP points defined for that task's difficulty. The bonus multiplier is applied during streak rewards or special events.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', maxWidth: '920px' }}>
        {DIFFS.map(diff => (
          <div key={diff} className="card" style={{ borderTop: `2px solid #111` }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{diff} Difficulty</h3>
              <p style={{ fontSize: '0.78rem', color: '#888' }}>{diffDesc[diff]}</p>
            </div>

            <div className="form-group">
              <label className="form-label">XP Points Awarded</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="number" className="form-control" min={1} max={1000}
                  value={config[diff].xpPoints}
                  onChange={e => setConfig(p => ({ ...p, [diff]: { ...p[diff], xpPoints: Number(e.target.value) } }))}
                />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#555', whiteSpace: 'nowrap' }}>XP</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bonus Multiplier</label>
              <input type="number" className="form-control" min={0.5} max={10} step={0.1}
                value={config[diff].bonusMultiplier}
                onChange={e => setConfig(p => ({ ...p, [diff]: { ...p[diff], bonusMultiplier: Number(e.target.value) } }))}
              />
              <p style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '4px' }}>Applied during streak bonuses (1.0 = no bonus)</p>
            </div>

            <div style={{ background: '#f8f8f8', border: '1px solid #e8e8e8', borderRadius: '8px', padding: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>Base reward</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111' }}>{config[diff].xpPoints} XP</span>
            </div>

            <button className="btn btn-primary btn-full" onClick={() => save(diff)} disabled={saving === diff}>
              <Save size={14} /> {saving === diff ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
