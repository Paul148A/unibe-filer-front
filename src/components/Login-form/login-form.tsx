import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import UseLoginForm from './hooks/use-login-form';
import Grid from '@mui/material/Grid2';
import Loader from '../Loader/loader';

const LoginForm = () => {
  const { identification, password, handleIdentificationChange, handlePasswordChange, handleSubmit, loading } = UseLoginForm();
  
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  label="Ingrese su numero de cédula"
                  variant="outlined"
                  value={identification}
                  onChange={handleIdentificationChange}
                  fullWidth
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label="Contraseña"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={handlePasswordChange}
                  fullWidth
                />
              </Grid>
              <Grid size={12}>
                <Button type="submit" variant="contained" color="primary" size='large' disabled={loading}>
                  {loading ? <Loader /> : 'Ingresar'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default LoginForm;