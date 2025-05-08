import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { useAuth } from '../Context/context';

const CustomAlert = () => {
  const { openAlert, handleCloseAlert } = useAuth()

  const getIcon = (type: typeof openAlert.type) => {
    switch (type) {
      case 'success':
        return <CheckIcon fontSize="inherit" />
      case 'error':
        return <ErrorIcon fontSize="inherit" />
      case 'info':
        return <InfoIcon fontSize="inherit" />
      case 'warning':
        return <WarningIcon fontSize="inherit" />
      default:
        return null
    }
  }

  return (
    <Snackbar
      open={openAlert.open}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={handleCloseAlert}
    >
      <Alert
        icon={getIcon(openAlert.type)}
        severity={openAlert.type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {openAlert.title}
      </Alert>
    </Snackbar>
  )
}

export default CustomAlert