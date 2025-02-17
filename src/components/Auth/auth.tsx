import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Loader from '../Loader/loader';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const Auth: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user) return <Navigate to="/" />;

  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default Auth;
