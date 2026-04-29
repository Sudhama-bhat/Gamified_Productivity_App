import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Trophy } from 'lucide-react';

export default function UserLeaderboard() {
  const { user } = useAuth();
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/user/leaderboard').then(r => { setBoard(r.data); setLoading(false); });
  }, []);

  const myRank = board.findIndex(u => u._id === user._id) + 1;

  const rankDisplay = (i) => {
    if (i === 0) return <span style={{ fontWeight: 900, color: '#b8860b', fontSize: '0.9rem' }}>1st</span>;
    if (i === 1) return <span style={{ fontWeight: 900, color: '#6b7280', fontSize: '0.9rem' }}>2nd</span>;
    if (i === 2) return <span style={{ fontWeight: 900, color: '#92400e', fontSize: '0.9rem' }}>3rd</span>;
    return <span style={{ fontWeight: 700, color: '#aaa', fontSize: '0.875rem' }}>#{i + 1}</span>;
  };

  return (
    <div className="animate-fade">
      <div className="page-header">
        <h1 className="page-title">Leaderboard</h1>
        <p className="page-subtitle">Compete globally and track your ranking</p>
      </div>

      {myRank > 0 ? (
        <div className="card mb-6" style={{ background: '#111', color: '#fff', border: 'none', maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={24} color="#f59e0b" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '2px' }}>Your Current Rank</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  <span style={{ color: '#f59e0b' }}>#{myRank}</span> <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>of {board.length}</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{user.xp?.toLocaleString()}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Total XP</div>
            </div>
          </div>
        </div>
      ) : null}

      {loading ? <div className="spinner" /> : (
        <div className="leaderboard-list" style={{ maxWidth: '680px' }}>
          {board.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Trophy size={40} color="#ccc" /></div>
              <h3>No rankings yet</h3>
              <p>Be the first to complete a task and claim the #1 spot!</p>
            </div>
          ) : (
            board.map((u, i) => {
              const isMe = u._id === user._id;
              return (
                <div key={u._id} className={`leaderboard-item ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''}`}
                  style={isMe ? { border: '2px solid #111', background: '#fafafa' } : {}}>
                  
                  <div className="leaderboard-rank">{rankDisplay(i)}</div>
                  
                  <div className="leaderboard-avatar" style={{ background: isMe ? '#111' : '#eee', color: isMe ? '#fff' : '#555' }}>
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  
                  <div className="leaderboard-info">
                    <div className="leaderboard-name" style={{ fontWeight: isMe ? 800 : 600 }}>
                      {u.name} {isMe && <span style={{ fontSize: '0.7rem', color: '#fff', background: '#111', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>YOU</span>}
                    </div>
                    <div className="leaderboard-meta">
                      <span className={`badge badge-${u.role}`}>{u.role}</span>
                      <span style={{ marginLeft: '6px', fontSize: '0.75rem', color: '#888' }}>Lv. {u.level} · {u.tasksCompleted} tasks</span>
                    </div>
                  </div>
                  
                  <div className="leaderboard-xp" style={{ fontWeight: isMe ? 900 : 700, color: isMe ? '#111' : 'inherit' }}>
                    {u.xp.toLocaleString()}
                    <span style={{ color: isMe ? '#555' : '#888' }}>XP</span>
                  </div>
                  
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
