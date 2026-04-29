import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, ClipboardList, CheckSquare, Clock, BarChart2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#111111', '#555555', '#888888', '#aaaaaa', '#cccccc', '#e0e0e0'];

export default function AdminReports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/reports').then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  const pieData = (stats?.tasksByCategory || []).filter(d => d.name).map(d => ({ name: d.name, value: d.count }));
  const barData = (stats?.dailyCompletions || []).map(d => ({ date: d._id?.slice(5), tasks: d.count }));
  const completionRate = stats?.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  const rankLabel = (i) => {
    if (i === 0) return '1st';
    if (i === 1) return '2nd';
    if (i === 2) return '3rd';
    return `#${i + 1}`;
  };

  return (
    <div className="animate-fade">
      <div className="page-header">
        <h1 className="page-title">Activity Reports</h1>
        <p className="page-subtitle">Platform-wide productivity analytics and user performance data</p>
      </div>

      {/* Summary stats */}
      <div className="stat-grid" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users },
          { label: 'Total Tasks', value: stats?.totalTasks ?? 0, icon: ClipboardList },
          { label: 'Completed Tasks', value: stats?.completedTasks ?? 0, icon: CheckSquare },
          { label: 'Pending Tasks', value: stats?.pendingTasks ?? 0, icon: Clock },
          { label: 'Completion Rate', value: `${completionRate}%`, icon: TrendingUp },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon"><s.icon size={19} color="#555" /></div>
            <div className="stat-info">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: '20px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '16px', fontWeight: 700, fontSize: '0.875rem' }}>Daily Task Completions (Last 7 Days)</h3>
          {barData.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <XAxis dataKey="date" tick={{ fill: '#999', fontSize: 10 }} />
                <YAxis tick={{ fill: '#999', fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e2e2', borderRadius: '8px', color: '#111', fontSize: '0.8rem' }} />
                <Bar dataKey="tasks" fill="#111111" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '30px' }}>
              <div className="empty-icon"><BarChart2 size={32} color="#ccc" /></div>
              <h3>No completions yet</h3>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px', fontWeight: 700, fontSize: '0.875rem' }}>Tasks by Category</h3>
          {pieData.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend formatter={v => <span style={{ color: '#555', fontSize: '0.75rem' }}>{v}</span>} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e2e2', borderRadius: '8px', color: '#111', fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '30px' }}>
              <div className="empty-icon"><ClipboardList size={32} color="#ccc" /></div>
              <h3>No data yet</h3>
            </div>
          )}
        </div>
      </div>

      {/* Top performers table */}
      <div className="card">
        <h3 style={{ marginBottom: '16px', fontWeight: 700, fontSize: '0.875rem' }}>Top 10 Performers</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Rank</th><th>Name</th><th>Role</th><th>Level</th><th>XP Earned</th><th>Tasks Done</th></tr>
            </thead>
            <tbody>
              {(stats?.topUsers || []).length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: '30px' }}>No data yet</td></tr>
              ) : (stats?.topUsers || []).map((u, i) => (
                <tr key={u._id}>
                  <td><strong>{rankLabel(i)}</strong></td>
                  <td><strong>{u.name}</strong></td>
                  <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                  <td>Lv. {u.level}</td>
                  <td><strong>{u.xp.toLocaleString()} XP</strong></td>
                  <td>{u.tasksCompleted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
