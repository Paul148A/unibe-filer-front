import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Twitter,
  LinkedIn,
  Pinterest,
  Facebook,
  Favorite
} from '@mui/icons-material';

const Footer = () => {
  
  const socialLinks = [
    { icon: <Twitter />, href: '#', label: 'Twitter' },
    { icon: <Facebook />, href: '#', label: 'Facebook' },
    { icon: <LinkedIn />, href: '#', label: 'LinkedIn' },
    { icon: <Pinterest />, href: '#', label: 'Pinterest' }
  ];

  const quickLinks = [
    { text: 'Inicio', href: '#' },
    { text: 'Características', href: '#' },
    { text: 'Precios', href: '#' },
    { text: 'Contacto', href: '#' }
  ];

  const supportLinks = [
    { text: 'Centro de Ayuda', href: '#' },
    { text: 'Documentación', href: '#' },
    { text: 'Términos de Uso', href: '#' },
    { text: 'Privacidad', href: '#' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1e3a8a 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #60a5fa 0%, #22d3ee 50%, #60a5fa 100%)',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    bgcolor: '#3b82f6',
                    width: 40,
                    height: 40,
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}
                >
                  U
                </Avatar>
                <Typography variant="h5" component="h3" fontWeight="bold">
                  Unibe Filer
                </Typography>
              </Stack>
              
              <Typography 
                variant="body1" 
                color="rgba(255, 255, 255, 0.8)"
                sx={{ maxWidth: '400px', lineHeight: 1.6 }}
              >
                Simplificando la gestión de archivos para estudiantes y profesionales. 
                Tu solución confiable para organizar y acceder a tus documentos.
              </Typography>
              
              <Stack direction="row" spacing={1}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#93c5fd',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Enlaces Rápidos
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  color="rgba(255, 255, 255, 0.8)"
                  underline="none"
                  sx={{
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: 'white',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Soporte
            </Typography>
            <Stack spacing={1}>
              {supportLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  color="rgba(255, 255, 255, 0.8)"
                  underline="none"
                  sx={{
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: 'white',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 4, borderColor: 'rgba(59, 130, 246, 0.3)' }} />

        {/* Bottom Section */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography 
            variant="body2" 
            color="rgba(255, 255, 255, 0.8)"
          >
            © {new Date().getFullYear()} Unibe Filer. Todos los derechos reservados.
          </Typography>
          
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
              Hecho con
            </Typography>
            <Favorite 
              sx={{ 
                color: '#ef4444', 
                fontSize: '1rem',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    opacity: 1,
                  },
                  '50%': {
                    opacity: .5,
                  },
                }
              }} 
            />
            <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
              por el equipo de Unibe Filer
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;