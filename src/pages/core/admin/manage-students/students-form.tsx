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
import { useAuth } from '../../../../components/Context/context'; // Asegúrate de que esta ruta sea correcta
import { IRole } from '../../../../interfaces/IRole';
import { IStatus } from '../../../../interfaces/IStatus';

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

  const [roles, setRoles] = useState<IRole[]>([]);
  const [statuses, setStatuses] = useState<IStatus[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const { setOpenAlert } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, statusesRes] = await Promise.all([
          axios.get('http://localhost:3000/api1/roles'),
          axios.get('http://localhost:3000/api1/status'),
        ]);

        const rolesData = rolesRes.data?.data ?? [];
        const statusesData = statusesRes.data?.data ?? [];

        setRoles(rolesData);
        setStatuses(statusesData);

        const studentRole = rolesData.find((role: IRole) =>
          role.name.toLowerCase() === 'student'
        );
        if (studentRole) {
          setFormData(prev => ({ ...prev, role_id: studentRole.id }));
        }
      } catch (error) {
        setOpenAlert({ open: true, type: "error", title: "Error al cargar los datos: " + error });
      }
    };

    fetchData();
  }, [setOpenAlert]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validación básica de campos requeridos
      if (!formData.names || !formData.last_names || !formData.identification || 
          !formData.email || !formData.password || !formData.role_id || !formData.status_id) {
        setOpenAlert({ open: true, type: "error", title: "Todos los campos son requeridos" });
        return;
      }

      await axios.post('http://localhost:3000/api1/users', formData);
      setOpenAlert({ open: true, type: "success", title: "Usuario creado con éxito" });
      
      // Resetear el formulario
      setFormData({
        names: '',
        last_names: '',
        identification: '',
        email: '',
        password: '',
        role_id: formData.role_id, // Mantener el rol de estudiante
        status_id: '',
      });
    } catch (error) {
      console.error(error);
      setOpenAlert({ 
        open: true, 
        type: "error", 
        title: "Error al crear el usuario: " + error 
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Crear Usuario
      </Typography>
      <Stack spacing={2}>
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
        />
        <TextField
          fullWidth
          label="Correo"
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
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          fullWidth
          label="Rol"
          name="role_id"
          value={formData.role_id}
          onChange={handleChange}
          required
          disabled={!!formData.role_id}
        >
          {roles.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
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
        >
          {statuses.map((status) => (
            <MenuItem key={status.id} value={status.id}>
              {status.name}
            </MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Crear Usuario
        </Button>
      </Stack>
    </Box>
  );
};

export default StudentsForm;