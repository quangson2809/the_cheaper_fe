import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/store/AuthContext';

export function AdminRoute() {
  const { isAuthenticated, isAdmin } = useAuthContext();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
