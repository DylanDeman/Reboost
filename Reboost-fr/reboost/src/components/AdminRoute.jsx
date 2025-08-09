import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

function AdminRoute() {
  const { isAuthed, gebruiker } = useAuth();
  const { pathname } = useLocation();

  if (!isAuthed) {
  return <Navigate replace to={`/login?redirect=${pathname}`} />;
  }

  if (!gebruiker?.roles.includes('admin')) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
