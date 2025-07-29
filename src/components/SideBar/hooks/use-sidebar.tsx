import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, CircularProgress } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../Context/context";
import { getRecordByUserId } from "../../../services/upload-files/record.service";
import { logout } from "../../../services/auth/login.service";
import { IRecord } from "../../../interfaces/IRecord";
import LogoutButton from "../logout-button";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Description as DescriptionIcon,
  Folder as FolderIcon,
  Upload as UploadIcon,
  List as ListIcon,
  Language as LanguageIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Book as BookIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Verified as CertificateIcon
} from '@mui/icons-material';

interface UseSidebarProps {
  onClose?: () => void;
}

const UseSidebar = ({ onClose }: UseSidebarProps = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, refreshUser, setOpenAlert } = useAuth();
  const [record, setRecord] = useState<IRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      if (user?.role === 'student' && user?.id) {
        setLoading(true);
        try {
          const records = await getRecordByUserId(user.id);
          setRecord(records[0] || null);
        } catch (error) {
          console.error('Error fetching record:', error);
          setRecord(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRecord();
  }, [user]);

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const isActiveStudentRoute = (basePath: string) => {
    if (!record?.id) return false;
    return location.pathname === `${basePath}/${record.id}`;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  const handleStudentNavigation = (basePath: string) => {
    if (record?.id) {
      handleNavigation(`${basePath}/${record.id}`);
    } else {
      handleNavigation('/student-dashboard');
    }
  };

  const getButtonStyle = (path: string) => ({
    '&.Mui-selected': {
      backgroundColor: 'primary.light',
      '&:hover': {
        backgroundColor: 'primary.light',
      }
    }
  });

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      await logout();
      
      setUser(null);
      
      await refreshUser();
      
      setOpenAlert({
        open: true,
        type: "success",
        title: "Sesión cerrada exitosamente"
      });
      
      if (onClose) {
        onClose();
      }
      
      navigate('/');
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      
      setOpenAlert({
        open: true,
        type: "error",
        title: "Error al cerrar sesión. Inténtalo de nuevo."
      });
      
      setUser(null);
      localStorage.clear();
      navigate('/');
      
    } finally {
      setIsLoggingOut(false);
    }
  };

  const sidebarAdminList = (
    <Box sx={{ width: 280, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
        Panel de Administración
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <List>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            onClick={() => handleNavigation('/admin-dashboard')}
            selected={isActiveRoute('/admin-dashboard')}
            sx={getButtonStyle('/admin-dashboard')}
          >
            <ListItemIcon>
              <DashboardIcon color={isActiveRoute('/admin-dashboard') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            onClick={() => handleNavigation('/students-form')}
            selected={isActiveRoute('/students-form')}
            sx={getButtonStyle('/students-form')}
          >
            <ListItemIcon>
              <PersonIcon color={isActiveRoute('/students-form') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Crear Estudiante" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            onClick={() => handleNavigation('/students-list')}
            selected={isActiveRoute('/students-list')}
            sx={getButtonStyle('/students-list')}
          >
            <ListItemIcon>
              <PeopleIcon color={isActiveRoute('/students-list') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Gestionar Estudiantes" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            onClick={() => handleNavigation('/records-list')}
            selected={isActiveRoute('/records-list')}
            sx={getButtonStyle('/records-list')}
          >
            <ListItemIcon>
              <FolderIcon color={isActiveRoute('/records-list') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Expedientes Estudiantiles" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />
      
      <List>
        <LogoutButton onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      </List>
    </Box>
  );

  const sidebarStudentList = (
    <Box sx={{ width: 280, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
        Panel de Estudiante
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <List>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              onClick={() => handleNavigation('/student-dashboard')}
              selected={isActiveRoute('/student-dashboard')}
              sx={getButtonStyle('/student-dashboard')}
            >
              <ListItemIcon>
                <DashboardIcon color={isActiveRoute('/student-dashboard') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              onClick={() => handleStudentNavigation('/list-inscription-documents')}
              selected={isActiveStudentRoute('/list-inscription-documents')}
              disabled={!record?.id}
              sx={getButtonStyle('/list-inscription-documents')}
            >
              <ListItemIcon>
                <UploadIcon color={isActiveStudentRoute('/list-inscription-documents') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText 
                primary="Documentos de Inscripción" 
                secondary={!record?.id ? "Sin expediente disponible" : ""}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              onClick={() => handleStudentNavigation('/list-degree-documents')}
              selected={isActiveStudentRoute('/list-degree-documents')}
              disabled={!record?.id}
              sx={getButtonStyle('/list-degree-documents')}
            >
              <ListItemIcon>
                <SchoolIcon color={isActiveStudentRoute('/list-degree-documents') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText 
                primary="Documentos de Grado" 
                secondary={!record?.id ? "Sin expediente disponible" : ""}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              onClick={() => handleStudentNavigation('/list-personal-documents')}
              selected={isActiveStudentRoute('/list-personal-documents')}
              disabled={!record?.id}
              sx={getButtonStyle('/list-personal-documents')}
            >
              <ListItemIcon>
                <DescriptionIcon color={isActiveStudentRoute('/list-personal-documents') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText 
                primary="Documentos Personales" 
                secondary={!record?.id ? "Sin expediente disponible" : ""}
              />
            </ListItemButton>
          </ListItem>
        </List>
      )}

      <Divider sx={{ my: 2 }} />
      
      <List>
        <LogoutButton onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      </List>
    </Box>
  );

  const sidebarLanguageList = (
    <Box sx={{ width: 280, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
        Panel de Idiomas
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <List>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            onClick={() => handleNavigation('/language-dashboard')}
            selected={isActiveRoute('/language-dashboard')}
            sx={getButtonStyle('/language-dashboard')}
          >
            <ListItemIcon>
              <DashboardIcon color={isActiveRoute('/language-dashboard') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            onClick={() => handleNavigation('/certificates-language-list')}
            selected={isActiveRoute('/certificates-language-list')}
            sx={getButtonStyle('/certificates-language-list')}
          >
            <ListItemIcon>
              <CertificateIcon color={isActiveRoute('/certificates-language-list') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Gestionar Certificados" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            onClick={() => handleNavigation('/language-dashboard')}
            selected={isActiveRoute('/language-dashboard')}
            sx={getButtonStyle('/language-dashboard')}
          >
            <ListItemIcon>
              <LanguageIcon color={isActiveRoute('/language-dashboard') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Configuración de Idiomas" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />
      
      <List>
        <LogoutButton onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      </List>
    </Box>
  );

  const sidebarTeacherList = (
    <Box sx={{ width: 280, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
        Panel de Profesor
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <List>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            onClick={() => handleNavigation('/teacher-dashboard')}
            selected={isActiveRoute('/teacher-dashboard')}
            sx={getButtonStyle('/teacher-dashboard')}
          >
            <ListItemIcon>
              <DashboardIcon color={isActiveRoute('/teacher-dashboard') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            onClick={() => handleNavigation('/teacher/manage-permissions/upload-permission-documents')}
            selected={isActiveRoute('/teacher/manage-permissions/upload-permission-documents')}
            sx={getButtonStyle('/teacher/manage-permissions/upload-permission-documents')}
          >
            <ListItemIcon>
              <UploadIcon color={isActiveRoute('/teacher/manage-permissions/upload-permission-documents') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Subir Permisos" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            onClick={() => handleNavigation('/teacher/manage-permissions/list-permission-documents')}
            selected={isActiveRoute('/teacher/manage-permissions/list-permission-documents')}
            sx={getButtonStyle('/teacher/manage-permissions/list-permission-documents')}
          >
            <ListItemIcon>
              <ListIcon color={isActiveRoute('/teacher/manage-permissions/list-permission-documents') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Ver Permisos" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            onClick={() => handleNavigation('/teacher-dashboard')}
            selected={isActiveRoute('/teacher-dashboard')}
            sx={getButtonStyle('/teacher-dashboard')}
          >
            <ListItemIcon>
              <AssignmentIcon color={isActiveRoute('/teacher-dashboard') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Mis Cursos" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />
      
      <List>
        <LogoutButton onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      </List>
    </Box>
  );

  return {
    sidebarAdminList,
    sidebarStudentList,
    sidebarLanguageList,
    sidebarTeacherList
  }
}

export default UseSidebar