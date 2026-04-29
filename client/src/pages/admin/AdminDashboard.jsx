import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, ClipboardList, CheckSquare, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#111111', '#555555', '#888888', '#aaaaaa', '#cccccc'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/reports').then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  const pieData = (stats?.tasksByCategory || []).map(d => ({ name: d.name || 'Uncategorised', value: d.count }));
  const barData = stats?.dailyCompletions?.map(d => ({ date: d._id?.slice(5), tasks: d.count })) || [];

  const rankIcon = (i) => {
    if (i === 0) return <span style={{ fontWeight: 900, color: '#b8860b' }}>1st</span>;
    if (i === 1) return <span style={{ fontWeight: 900, color: '#888' }}>2nd</span>;
    if (i === 2) return <span style={{ fontWeight: 900, color: '#92400e' }}>3rd</span>;
    return <span style={{ color: '#888' }}>{i + 1}</span>;
  };

  return (
    <div className="animate-fade">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform overview and real-time analytics</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users size={20} color="#555" /></div>
          <div className="stat-info">
            <div className="stat-value">{stats?.totalUsers ?? 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><ClipboardList size={20} color="#555" /></div>
          <div className="stat-info">
            <div className="stat-value">{stats?.totalTasks ?? 0}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CheckSquare size={20} color="#555" /></div>
          <div className="stat-info">
            <div className="stat-value">{stats?.completedTasks ?? 0}</div>
            <div className="stat-label">Completed Tasks</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><BarChart2 size={20} color="#555" /></div>
          <div className="stat-info">
            <div className="stat-value">{stats?.pendingTasks ?? 0}</div>
            <div className="stat-label">Pending Tasks</div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '20px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '0.875rem', fontWeight: 700 }}>Daily Completions (7 days)</h3>
          {barData.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <XAxis dataKey="date" tick={{ fill: '#999', fontSize: 11 }} />
                <YAxis tick={{ fill: '#999', fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e2e2', borderRadius: '8px', color: '#111', fontSize: '0.8rem' }} />
                <Bar dataKey="tasks" fill="#111111" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '30px' }}>
              <div className="empty-icon"><BarChart2 size={32} color="#ccc" /></div>
              <h3>No data yet</h3>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '0.875rem', fontWeight: 700 }}>Tasks by Category</h3>
          {pieData.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name }) => name}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e2e2', borderRadius: '8px', color: '#111', fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '30px' }}>
              <div className="empty-icon"><ClipboardList size={32} color="#ccc" /></div>
              <h3>No tasks yet</h3>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px', fontSize: '0.875rem', fontWeight: 700 }}>Top Performers</h3>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Rank</th><th>Name</th><th>Role</th><th>Level</th><th>XP</th><th>Tasks Done</th></tr></thead>
            <tbody>
              {(stats?.topUsers || []).length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: '30px' }}>No data yet</td></tr>
              ) : (stats?.topUsers || []).map((u, i) => (
                <tr key={u._id}>
                  <td>{rankIcon(i)}</td>
                  <td><strong>{u.name}</strong></td>
                  <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                  <td>Lv. {u.level}</td>
                  <td><strong>{u.xp} XP</strong></td>
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
