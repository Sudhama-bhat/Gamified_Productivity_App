import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Zap, CheckSquare, Flame, Trophy, ClipboardList, TrendingUp } from 'lucide-react';

export default function UserDashboard() {
  const { user, update } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/user/profile'), api.get('/user/tasks')])
      .then(([p, t]) => {
        setProfile(p.data);
        setTasks(t.data.slice(0, 5));
        update({ xp: p.data.user.xp, level: p.data.user.level });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  const { user: u, currentLevel, nextLevel } = profile || {};
  const xpForNext = nextLevel ? nextLevel.xpRequired - (currentLevel?.xpRequired || 0) : 100;
  const xpProgress = nextLevel ? u?.xp - (currentLevel?.xpRequired || 0) : 100;
  const pct = nextLevel ? Math.min(100, Math.max(0, Math.round((xpProgress / xpForNext) * 100))) : 100;

  return (
    <div className="animate-fade">
      {/* Hero section */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-left">
          <h2>Welcome back, {u?.name?.split(' ')[0]}!</h2>
          <p>Keep your momentum going — great achievements await.</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
            <span className="level-badge">
              {currentLevel?.title || 'Beginner'} (Lv. {u?.level})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', padding: '4px 12px' }}>
              <Flame size={14} color="#f59e0b" /> {u?.streak} day streak
            </span>
          </div>
        </div>
        <div style={{ width: '220px', flexShrink: 0 }}>
          <div className="xp-bar-wrapper">
            <div className="xp-bar-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={13} color="#f59e0b" /> {u?.xp.toLocaleString()} XP</span>
              {nextLevel && <span>{nextLevel?.xpRequired.toLocaleString()} XP</span>}
            </div>
            <div className="xp-bar-track"><div className="xp-bar-fill" style={{ width: `${pct}%` }} /></div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginTop: '6px', textAlign: 'right' }}>
              {nextLevel ? `${pct}% to Lv. ${nextLevel.level}` : 'Max Level Reached!'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon"><Zap size={20} color="#b8860b" /></div>
          <div className="stat-info"><div className="stat-value">{u?.xp.toLocaleString()}</div><div className="stat-label">Total XP</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><TrendingUp size={20} color="#555" /></div>
          <div className="stat-info"><div className="stat-value">{u?.level}</div><div className="stat-label">Current Level</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CheckSquare size={20} color="#555" /></div>
          <div className="stat-info"><div className="stat-value">{u?.tasksCompleted}</div><div className="stat-label">Tasks Completed</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Flame size={20} color="#b91c1c" /></div>
          <div className="stat-info"><div className="stat-value">{u?.streak}</div><div className="stat-label">Day Streak</div></div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card mb-6">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Recent Tasks</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/user/tasks')}>View All</button>
        </div>
        {tasks.length === 0 ? (
          <div className="empty-state" style={{ padding: '20px' }}>
            <div className="empty-icon"><ClipboardList size={32} color="#ccc" /></div>
            <h3>No tasks yet</h3>
            <p>Go to My Tasks to create your first task!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tasks.map(t => (
              <div key={t._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e8e8e8' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: t.category?.color || '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                  {(t.category?.icon || t.category?.name?.[0] || 'T').slice(0, 1).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', textDecoration: t.status === 'completed' ? 'line-through' : 'none', color: t.status === 'completed' ? '#888' : '#111' }}>{t.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '2px' }}>{t.category?.name}</div>
                </div>
                <span className={`badge badge-${t.difficulty?.toLowerCase()}`}>{t.difficulty}</span>
                <span className={`badge badge-${t.status}`}>{t.status}</span>
                <span style={{ color: '#555', fontWeight: 700, fontSize: '0.8rem' }}>+{t.xpReward}XP</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Achievements */}
      {profile?.achievements?.length > 0 && (
        <div className="card">
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px' }}>Recent Achievements</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {profile.achievements.slice(0, 6).map(a => (
              <div key={a._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '8px 14px' }}>
                <Trophy size={14} color="#b45309" />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#92400e' }}>{a.achievementId?.name}</span>
              </div>
            ))}
            {profile.achievements.length > 6 && (
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/user/achievements')} style={{ padding: '6px 12px' }}>
                +{profile.achievements.length - 6} more
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
