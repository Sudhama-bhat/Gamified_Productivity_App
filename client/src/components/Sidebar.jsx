import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Tag, Zap, BarChart3, Trophy,
  Award, LogOut, CheckSquare, ClipboardList, TrendingUp,
  FileText, Settings, LogIn
} from 'lucide-react';

const adminNav = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
  { icon: Users, label: 'Manage Users', to: '/admin/users' },
  { icon: Tag, label: 'Task Categories', to: '/admin/categories' },
  { icon: Zap, label: 'XP Allocation Rules', to: '/admin/xp-config' },
  { icon: TrendingUp, label: 'Level Thresholds', to: '/admin/levels' },
  { icon: Award, label: 'Achievements', to: '/admin/achievements' },
  { icon: Trophy, label: 'Leaderboard', to: '/admin/leaderboard' },
  { icon: BarChart3, label: 'Activity Reports', to: '/admin/reports' },
];

const userNav = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/user' },
  { icon: CheckSquare, label: 'My Tasks', to: '/user/tasks' },
  { icon: Award, label: 'Achievements', to: '/user/achievements' },
  { icon: Trophy, label: 'Leaderboard', to: '/user/leaderboard' },
  { icon: FileText, label: 'My Report', to: '/user/report' },
];

const navMap = { admin: adminNav, user: userNav };

// SVG Logo icon
function AppLogoIcon({ size = 20, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = navMap[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-row">
          <div className="sidebar-logo-icon">
            <AppLogoIcon size={20} color="#111" />
          </div>
          <div>
            <h2>QuestFlow</h2>
            <span>Gamified Productivity</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Navigation</div>
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink key={to} to={to} end={to === '/admin' || to === '/user'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div className="sidebar-user-info">
          <div className="name">{user?.name}</div>
          <div className="role">{user?.role}</div>
        </div>
        <button onClick={handleLogout}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
          title="Logout">
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
