import Grid from '@mui/material/Grid2';
import LoginForm from '../../../components/Login-form/login-form';
import './login.css';

const Login: React.FC = () => {
  
  return (
    <div className='backgroundStyle'>
        <Grid container spacing={2}>
            <Grid size={6} container justifyContent="center" alignItems="center">
                <img src="/gestion.png" width={550} height={300} />
            </Grid>
            <Grid size={6}>
                <LoginForm />
            </Grid>
        </Grid>
    </div>
  )
}

export default Login