import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Zap, TrendingUp, Flame, CheckSquare, Clock, Target } from 'lucide-react';

const DIFF_COLORS = { Easy: '#111111', Medium: '#555555', Hard: '#888888' };
const CAT_COLORS = ['#111111', '#374151', '#4b5563', '#6b7280', '#9ca3af'];

export default function UserReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/user/report').then(r => { setReport(r.data); setLoading(false); });
  }, []);

  if (loading) return <div className="spinner" />;

  const { user, byDifficulty, byCategory, dailyActivity } = report;
  const diffData = Object.entries(byDifficulty).map(([name, value]) => ({ name, value, fill: DIFF_COLORS[name] || '#111' }));
  const catData = Object.entries(byCategory).map(([name, value], i) => ({ name, tasks: value, fill: CAT_COLORS[i % CAT_COLORS.length] }));
  const actData = Object.entries(dailyActivity).map(([day, count]) => ({ day: day.slice(5), count })); // e.g. "04-15"
  
  const completionRate = report.total ? Math.round((report.completed / report.total) * 100) : 0;

  return (
    <div className="animate-fade">
      <div className="page-header">
        <h1 className="page-title">My Productivity Report</h1>
        <p className="page-subtitle">Your personal statistics and task analytics</p>
      </div>

      <div className="stat-grid" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Total XP Earned', value: user?.xp?.toLocaleString(), icon: Zap },
          { label: 'Current Level', value: user?.level, icon: TrendingUp },
          { label: 'Current Streak', value: `${user?.streak} days`, icon: Flame },
          { label: 'Tasks Completed', value: report.completed, icon: CheckSquare },
          { label: 'Tasks Pending', value: report.pending, icon: Clock },
          { label: 'Completion Rate', value: `${completionRate}%`, icon: Target },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon"><s.icon size={18} color="#555" /></div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="card">
          <h3 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '16px' }}>Daily Activity (Last 7 Days)</h3>
          {actData.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={actData}>
                <XAxis dataKey="day" tick={{ fill: '#888', fontSize: 10 }} />
                <YAxis tick={{ fill: '#888', fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e2e2', borderRadius: '8px', color: '#111', fontSize: '0.8rem' }} />
                <Bar dataKey="count" fill="#111111" radius={[4, 4, 0, 0]} name="Completed Tasks" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '30px' }}>
              <div className="empty-icon"><TrendingUp size={32} color="#ccc" /></div>
              <h3>No recent activity</h3>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '16px' }}>Task Breakdown by Difficulty</h3>
          {diffData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={diffData.filter(d => d.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {diffData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e2e2', borderRadius: '8px', color: '#111', fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '30px' }}>
              <div className="empty-icon"><Target size={32} color="#ccc" /></div>
              <h3>No completions yet</h3>
            </div>
          )}
        </div>
      </div>

      {catData.length > 0 && (
        <div className="card" style={{ maxWidth: '700px' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '16px' }}>Completions by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={catData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" tick={{ fill: '#888', fontSize: 10 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#555', fontSize: 11, fontWeight: 600 }} width={100} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e2e2', borderRadius: '8px', color: '#111', fontSize: '0.8rem' }} />
              <Bar dataKey="tasks" fill="#555555" radius={[0, 4, 4, 0]} name="Completed Tasks">
                 {catData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
