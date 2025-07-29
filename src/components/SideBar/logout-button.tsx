import { ListItem, ListItemButton, ListItemIcon, ListItemText, CircularProgress } from "@mui/material";
import { ExitToApp as LogoutIcon } from '@mui/icons-material';

interface LogoutButtonProps {
  onLogout: () => void;
  isLoggingOut: boolean;
}

const LogoutButton = ({ onLogout, isLoggingOut }: LogoutButtonProps) => {
  return (
    <ListItem disablePadding>
      <ListItemButton 
        onClick={onLogout}
        disabled={isLoggingOut}
      >
        <ListItemIcon>
          {isLoggingOut ? (
            <CircularProgress size={20} color="error" />
          ) : (
            <LogoutIcon color="error" />
          )}
        </ListItemIcon>
        <ListItemText 
          primary={isLoggingOut ? "Cerrando sesión..." : "Cerrar Sesión"} 
        />
      </ListItemButton>
    </ListItem>
  );
};

export default LogoutButton; 