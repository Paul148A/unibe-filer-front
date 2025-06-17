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

interface Role {
  id: string;
  name: string;
  description: string;
}

interface Status {
  id: string;
  name: string;
}

const StudentsForm = () => {
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
  const [isLoading, setIsLoading] = useState(true);
  const { setOpenAlert } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [rolesRes, statusesRes] = await Promise.all([
          axios.get('http://localhost:3000/api1/roles'),
          axios.get('http://localhost:3000/api1/status'),
        ]);

        const rolesData = rolesRes.data?.data ?? [];
        const statusesData = statusesRes.data?.data ?? [];

        setRoles(rolesData);
        setStatuses(statusesData);

        if (!formData.role_id && rolesData.length > 0) {
          setFormData(prev => ({ ...prev, role_id: rolesData[0].id }));
        }
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
    console.log(`Campo ${name} cambiado a: ${value}`); // Debug log
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.names || !formData.last_names || !formData.identification || 
          !formData.email || !formData.password || !formData.role_id || !formData.status_id) {
        setOpenAlert({ open: true, type: "error", title: "Todos los campos son requeridos" });
        return;
      }

      const userData = {
        names: formData.names,
        last_names: formData.last_names,
        identification: formData.identification,
        email: formData.email,
        password: formData.password,
        role: formData.role_id,
        status: formData.status_id,
      };
      await axios.post('http://localhost:3000/api1/users', userData);
      setOpenAlert({ open: true, type: "success", title: "Usuario creado con éxito" });
      
      // Limpiar el formulario después de crear el usuario
      setFormData({
        names: '',
        last_names: '',
        identification: '',
        email: '',
        password: '',
        role_id: '',
        status_id: '',
      });
    } catch (error: any) {
      console.error(error);
      setOpenAlert({ 
        open: true, 
        type: "error", 
        title: "Error al crear el usuario: " + (error.response?.data?.message || error.message) 
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Crear Usuario
      </Typography>
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
          label="Contraseña"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          required
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
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
          size="large"
          sx={{ mt: 2 }}
        >
          Crear Usuario
        </Button>
      </Stack>
    </Box>
  );
};

export default StudentsForm;