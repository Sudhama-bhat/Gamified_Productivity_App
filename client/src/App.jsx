import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedLayout from './components/ProtectedLayout';

// Public
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminXPConfig from './pages/admin/AdminXPConfig';
import AdminLevels from './pages/admin/AdminLevels';
import AdminAchievements from './pages/admin/AdminAchievements';
import AdminLeaderboard from './pages/admin/AdminLeaderboard';
import AdminReports from './pages/admin/AdminReports';

// User
import UserDashboard from './pages/user/UserDashboard';
import UserTasks from './pages/user/UserTasks';
import UserAchievements from './pages/user/UserAchievements';
import UserLeaderboard from './pages/user/UserLeaderboard';
import UserReport from './pages/user/UserReport';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={`/${user.role}`} /> : <Register />} />

      {/* Admin */}
      <Route element={<ProtectedLayout role="admin" />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/xp-config" element={<AdminXPConfig />} />
        <Route path="/admin/levels" element={<AdminLevels />} />
        <Route path="/admin/achievements" element={<AdminAchievements />} />
        <Route path="/admin/leaderboard" element={<AdminLeaderboard />} />
        <Route path="/admin/reports" element={<AdminReports />} />
      </Route>

      {/* User */}
      <Route element={<ProtectedLayout role="user" />}>
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/tasks" element={<UserTasks />} />
        <Route path="/user/achievements" element={<UserAchievements />} />
        <Route path="/user/leaderboard" element={<UserLeaderboard />} />
        <Route path="/user/report" element={<UserReport />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#111111',
              border: '1px solid #e2e2e2',
              borderRadius: '8px',
              fontSize: '0.875rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            },
            success: { iconTheme: { primary: '#15803d', secondary: '#fff' } },
            error: { iconTheme: { primary: '#b91c1c', secondary: '#fff' } },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
