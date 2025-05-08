import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../Context/context";
import { logout } from "../../../services/auth/login.service";

const UseNavbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { refreshUser, setUser, user} = useAuth();
  const navigate = useNavigate();


  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  return {
    anchorEl,
    handleMenu,
    handleClose,
    handleLogout,
  }
}

export default UseNavbar