import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Badge as BadgeIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../../../components/Context/context';
import { IUser } from '../../../../interfaces/IUser';

interface Role {
  id: string;
  name: string;
  description: string;
}

interface Status {
  id: string;
  name: string;
}

interface StudentsUpdateProps {
  open: boolean;
  onClose: () => void;
  user: IUser | null;
  onUpdate: () => void;
}

const StudentsUpdate: React.FC<StudentsUpdateProps> = ({ open, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    names: '',
    last_names: '',
    identification: '',
    email: '',
    password: '',
    role_id: '',
    status_id: '',
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setOpenAlert } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData({
        names: user.names || '',
        last_names: user.last_names || '',
        identification: user.identification || '',
        email: user.email || '',
        password: '',
        role_id: user.role?.id || '',
        status_id: user.status?.id || '',
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [rolesRes, statusesRes] = await Promise.all([
          axios.get('http://localhost:3000/api1/roles'),
          axios.get('http://localhost:3000/api1/status'),
        ]);
        setRoles(rolesRes.data?.data ?? []);
        setStatuses(statusesRes.data?.data ?? []);
      } catch (error: any) {
        setOpenAlert({ open: true, type: "error", title: "Error al cargar los datos: " + error.message });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setOpenAlert]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      if (!formData.names || !formData.last_names || !formData.identification || 
          !formData.email || !formData.role_id || !formData.status_id) {
        setOpenAlert({ open: true, type: "error", title: "Todos los campos son requeridos" });
        return;
      }
      const userData: any = {
        names: formData.names,
        last_names: formData.last_names,
        identification: formData.identification,
        email: formData.email,
        role: formData.role_id,
        status: formData.status_id,
      };
      if (formData.password) {
        userData.password = formData.password;
      }
      await axios.put(`http://localhost:3000/api1/users/${user.id}`, userData);
      setOpenAlert({ open: true, type: "success", title: "Usuario actualizado con éxito" });
      onUpdate();
      onClose();
    } catch (error: any) {
      setOpenAlert({ 
        open: true, 
        type: "error", 
        title: "Error al actualizar el usuario: " + (error.response?.data?.message || error.message) 
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Usuario</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Nombres"
              name="names"
              value={formData.names}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Apellidos"
              name="last_names"
              value={formData.last_names}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Identificación"
              name="identification"
              value={formData.identification}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Contraseña (dejar en blanco para no cambiar)"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label="toggle password visibility">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <TextField
              select
              fullWidth
              label="Rol"
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              required
              variant="outlined"
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.description}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Estado"
              name="status_id"
              value={formData.status_id}
              onChange={handleChange}
              required
              variant="outlined"
            >
              {statuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Guardar Cambios</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentsUpdate;
