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
import axiosInstance from '../../../../api/axios';
import { useAuth } from '../../../../components/Context/context';
import { useNavigate } from 'react-router-dom';

interface Role {
  id: string;
  name: string;
  description: string;
}

interface Status {
  id: string;
  name: string;
}

interface ValidationErrors {
  names?: string;
  last_names?: string;
  identification?: string;
  email?: string;
  password?: string;
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
    semester_id: '',
    career_id: '',
    is_approved: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [roles, setRoles] = useState<Role[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setOpenAlert } = useAuth();
  const navigate = useNavigate();

  const validateNames = (names: string): string | undefined => {
    if (!names.trim()) return 'Los nombres son requeridos';
    
    const nameParts = names.trim().split(/\s+/);
    if (nameParts.length < 2) {
      return 'Debe ingresar al menos 2 nombres';
    }
    
    if (nameParts.length > 4) {
      return 'No puede ingresar más de 4 nombres';
    }
    
    for (const name of nameParts) {
      if (name.length < 2) {
        return 'Cada nombre debe tener al menos 2 caracteres';
      }
    }
    
    return undefined;
  };

  const validateLastNames = (lastNames: string): string | undefined => {
    if (!lastNames.trim()) return 'Los apellidos son requeridos';
    
    const lastNameParts = lastNames.trim().split(/\s+/);
    if (lastNameParts.length < 2) {
      return 'Debe ingresar al menos 2 apellidos';
    }
    
    if (lastNameParts.length > 4) {
      return 'No puede ingresar más de 4 apellidos';
    }
    
    for (const lastName of lastNameParts) {
      if (lastName.length < 2) {
        return 'Cada apellido debe tener al menos 2 caracteres';
      }
    }
    
    return undefined;
  };

  const validateIdentification = (identification: string): string | undefined => {
    if (!identification.trim()) return 'La identificación es requerida';
    
    const cleanId = identification.replace(/\s/g, '').replace(/[^0-9]/g, '');
    
    if (cleanId.length !== 10) {
      return 'La identificación debe tener exactamente 10 dígitos';
    }
    
    if (!/^\d{10}$/.test(cleanId)) {
      return 'La identificación debe contener solo números';
    }
    
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'El correo electrónico es requerido';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Ingrese un correo electrónico válido';
    }
    
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'La contraseña es requerida';
    
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return undefined;
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'names':
        return validateNames(value);
      case 'last_names':
        return validateLastNames(value);
      case 'identification':
        return validateIdentification(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    newErrors.names = validateNames(formData.names);
    newErrors.last_names = validateLastNames(formData.last_names);
    newErrors.identification = validateIdentification(formData.identification);
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [rolesRes, statusesRes, semestersRes, careersRes] = await Promise.all([
          axiosInstance.get('/api1/roles'),
          axiosInstance.get('/api1/status'),
          axiosInstance.get('/api1/semesters'),
          axiosInstance.get('/api1/careers'),
        ]);

        const rolesData = rolesRes.data?.data ?? [];
        const statusesData = statusesRes.data?.data ?? [];
        const semestersData = semestersRes.data?.data ?? [];
        const careersData = careersRes.data?.data ?? [];

        setRoles(rolesData);
        setStatuses(statusesData);
        setSemesters(semestersData);
        setCareers(careersData);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value, type, checked } = e.target as any;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name && typeof newValue === 'string') {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setOpenAlert({ open: true, type: "error", title: "Por favor, corrija los errores en el formulario" });
      return;
    }

    try {

      const userData = {
        names: formData.names,
        last_names: formData.last_names,
        identification: formData.identification,
        email: formData.email,
        password: formData.password,
        role: formData.role_id,
        status: formData.status_id,
        semester: formData.semester_id,
        career: formData.career_id,
        is_approved: formData.is_approved,
      };
      await axiosInstance.post('/api1/users', userData);
      setOpenAlert({ open: true, type: "success", title: "Usuario creado con éxito" });
      navigate('/students-list');
      setFormData({
        names: '',
        last_names: '',
        identification: '',
        email: '',
        password: '',
        role_id: '',
        status_id: '',
        semester_id: '',
        career_id: '',
        is_approved: false,
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
          error={!!errors.names}
          helperText={errors.names}
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
          error={!!errors.last_names}
          helperText={errors.last_names}
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
          error={!!errors.identification}
          helperText={errors.identification}
          inputProps={{
            maxLength: 10,
            pattern: '[0-9]*'
          }}
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
          error={!!errors.email}
          helperText={errors.email}
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
          error={!!errors.password}
          helperText={errors.password}
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
        <TextField
          select
          fullWidth
          label="Semestre"
          name="semester_id"
          value={formData.semester_id}
          onChange={handleChange}
          variant="outlined"
        >
          {semesters.map((semester) => (
            <MenuItem key={semester.id} value={semester.id}>
              {semester.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          label="Carrera"
          name="career_id"
          value={formData.career_id}
          onChange={handleChange}
          variant="outlined"
        >
          {careers.map((career) => (
            <MenuItem key={career.id} value={career.id}>
              {career.name}
            </MenuItem>
          ))}
        </TextField>
        <Box display="flex" alignItems="center">
          <input
            type="checkbox"
            name="is_approved"
            checked={formData.is_approved}
            onChange={handleChange}
            style={{ marginRight: 8 }}
          />
          <Typography>¿El estudiante esta homologado?</Typography>
        </Box>
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