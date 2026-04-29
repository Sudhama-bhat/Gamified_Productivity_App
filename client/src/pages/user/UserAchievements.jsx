import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Award, Lock, Star } from 'lucide-react';

export default function UserAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/user/achievements').then(r => { setAchievements(r.data); setLoading(false); });
  }, []);

  const earned = achievements.filter(a => a.earned);
  const locked = achievements.filter(a => !a.earned);

  return (
    <div className="animate-fade">
      <div className="page-header">
        <h1 className="page-title">Achievements</h1>
        <p className="page-subtitle">Track your milestones and unlock rewards</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', background: '#fafafa', border: '1px solid #e2e2e2', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#111' }}>{earned.length} <span style={{ fontSize: '1rem', color: '#888', fontWeight: 500 }}>/ {achievements.length}</span></div>
          <div style={{ fontSize: '0.8rem', color: '#555', fontWeight: 600, marginTop: '4px' }}>Unlocked Badges</div>
        </div>
        <div style={{ flex: '1 1 200px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#b45309' }}>
            {achievements.reduce((s, a) => s + (a.earned ? (a.xpBonus || 0) : 0), 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: 600, marginTop: '4px' }}>Bonus XP Earned</div>
        </div>
      </div>

      {loading ? <div className="spinner" /> : (
        <>
          {earned.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Star size={18} color="#b45309" />
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#111' }}>Unlocked Achievements</h3>
              </div>
              <div className="achievement-grid" style={{ marginBottom: '32px' }}>
                {earned.map(a => (
                  <div key={a._id} className="achievement-card earned animate-pop" style={{ border: '1px solid #b45309', background: '#fffbeb' }}>
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#b45309', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Earned
                    </div>
                    <div style={{ width: '48px', height: '48px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <Award size={24} color="#b45309" />
                    </div>
                    <div className="achievement-name" style={{ color: '#92400e' }}>{a.name}</div>
                    <div className="achievement-desc" style={{ color: '#b45309', opacity: 0.8 }}>{a.description}</div>
                    {a.xpBonus > 0 && (
                      <div style={{ display: 'inline-block', background: '#fff', color: '#b45309', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', marginTop: '12px', border: '1px solid #fde68a' }}>
                        +{a.xpBonus} XP
                      </div>
                    )}
                    {a.earnedAt && (
                      <div style={{ fontSize: '0.7rem', color: '#b45309', opacity: 0.7, marginTop: '8px' }}>
                        {new Date(a.earnedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {locked.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Lock size={18} color="#888" />
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#555' }}>Locked Achievements</h3>
              </div>
              <div className="achievement-grid" style={{ opacity: 0.8 }}>
                {locked.map(a => (
                  <div key={a._id} className="achievement-card locked" style={{ background: '#fafafa', border: '1px dashed #d1d5db' }}>
                    <div style={{ width: '48px', height: '48px', background: '#f0f0f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <Award size={24} color="#9ca3af" />
                    </div>
                    <div className="achievement-name" style={{ color: '#555' }}>{a.name}</div>
                    <div className="achievement-desc" style={{ color: '#888' }}>{a.description}</div>
                    {a.xpBonus > 0 && (
                      <div style={{ display: 'inline-block', background: '#fff', color: '#888', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', marginTop: '12px', border: '1px solid #e5e7eb' }}>
                        +{a.xpBonus} XP Reward
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
