import { useEffect, useState } from 'react';
import { useAuth } from '../../../../components/Context/context';
import { logout } from '../../../../services/auth/login.service';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../../components/Loader/loader';
import WelcomeView from '../../../../components/Welcome-view/welcome-view';
const AdminDashboard = () => {
  const { refreshUser, setUser, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

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
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoggingOut && !user) {
      navigate('/');
    }
  }, [isLoggingOut, user, navigate]);

  return (
    <div>
      {loading ? <Loader /> : (
        <>
          {showWelcome ? <WelcomeView /> : (
            <>
              <div>Bienvenido administrador</div>
              <button onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? <Loader /> : 'Cerrar sesión'}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
