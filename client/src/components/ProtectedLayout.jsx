import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

export default function ProtectedLayout({ role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content animate-fade">
        <Outlet />
      </main>
    </div>
  );
}
