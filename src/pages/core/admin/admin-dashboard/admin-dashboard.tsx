import { useEffect, useState } from 'react';
import { useAuth } from '../../../../components/Context/context';
import { logout } from '../../../../services/auth/login.service';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../../components/Loader/loader';

const AdminDashboard = () => {
  const { refreshUser, setUser, user } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setUser(null);
      await refreshUser();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    if (isLoggingOut && !user) {
      navigate('/');
    }
  }, [isLoggingOut, user, navigate]);

  return (
    <div>
      <div>Bienvenido administrador</div>
      <button onClick={handleLogout} disabled={isLoggingOut}>
        {isLoggingOut ? <Loader /> : 'Cerrar sesión'}
      </button>
    </div>
  );
};

export default AdminDashboard;
