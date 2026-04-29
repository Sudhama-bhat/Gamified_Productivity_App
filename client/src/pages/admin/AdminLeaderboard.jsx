import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Trophy } from 'lucide-react';

export default function AdminLeaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/leaderboard').then(r => { setUsers(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const rankDisplay = (i) => {
    if (i === 0) return <span style={{ fontWeight: 900, color: '#b8860b', fontSize: '0.9rem' }}>1st</span>;
    if (i === 1) return <span style={{ fontWeight: 900, color: '#6b7280', fontSize: '0.9rem' }}>2nd</span>;
    if (i === 2) return <span style={{ fontWeight: 900, color: '#92400e', fontSize: '0.9rem' }}>3rd</span>;
    return <span style={{ fontWeight: 700, color: '#aaa', fontSize: '0.875rem' }}>#{i + 1}</span>;
  };

  return (
    <div className="animate-fade">
      <div className="page-header">
        <h1 className="page-title">Leaderboard Rankings</h1>
        <p className="page-subtitle">Top performers across all users on the platform</p>
      </div>

      {loading ? <div className="spinner" /> : (
        <div style={{ maxWidth: '720px' }}>
          {users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Trophy size={40} color="#ccc" /></div>
              <h3>No rankings yet</h3>
              <p>Users need to complete tasks to appear on the leaderboard.</p>
            </div>
          ) : (
            <>
              {/* Top 3 highlight */}
              {users.slice(0, 3).length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                  {users.slice(0, 3).map((u, i) => (
                    <div key={u._id} className="card" style={{
                      textAlign: 'center',
                      borderTop: `3px solid ${i === 0 ? '#b8860b' : i === 1 ? '#6b7280' : '#92400e'}`
                    }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#aaa', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {i === 0 ? '1st Place' : i === 1 ? '2nd Place' : '3rd Place'}
                      </div>
                      <div style={{ width: '44px', height: '44px', background: '#111', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1rem', margin: '0 auto 8px' }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '4px' }}>{u.name}</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>{u.xp.toLocaleString()} <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 500 }}>XP</span></div>
                      <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '4px' }}>Lv. {u.level} · {u.tasksCompleted} tasks</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Full list */}
              <div className="leaderboard-list">
                {users.map((u, i) => (
                  <div key={u._id} className={`leaderboard-item ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''}`}>
                    <div className="leaderboard-rank">{rankDisplay(i)}</div>
                    <div className="leaderboard-avatar">{u.name?.[0]?.toUpperCase()}</div>
                    <div className="leaderboard-info">
                      <div className="leaderboard-name">{u.name}</div>
                      <div className="leaderboard-meta">
                        <span className={`badge badge-${u.role}`}>{u.role}</span>
                        <span style={{ marginLeft: '6px', fontSize: '0.7rem' }}>Lv. {u.level} · {u.tasksCompleted} tasks done</span>
                      </div>
                    </div>
                    <div className="leaderboard-xp">
                      {u.xp.toLocaleString()}
                      <span>XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
