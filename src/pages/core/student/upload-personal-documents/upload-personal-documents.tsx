import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../components/Context/context';
import {
  Box,
  Typography,
  Button,
  Paper,
  styled,
  Alert,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BadgeIcon from '@mui/icons-material/Badge';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import SchoolIcon from '@mui/icons-material/School';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  maxWidth: 800,
  margin: '0 auto'
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadPersonalDocuments: React.FC = () => {
  const [pictureDoc, setPictureDoc] = useState<File | null>(null);
  const [dniDoc, setDniDoc] = useState<File | null>(null);
  const [votingBallotDoc, setVotingBallotDoc] = useState<File | null>(null);
  const [notarizDegreeDoc, setNotarizDegreeDoc] = useState<File | null>(null);
  const [message] = useState('');
  const { setOpenAlert } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pictureDoc || !dniDoc || !votingBallotDoc || !notarizDegreeDoc) {
      setOpenAlert({ open: true, type: "error", title: "Debes subir todos los archivos del formulario" });
      return;
    }

    const formData = new FormData();
    formData.append('files', pictureDoc);
    formData.append('files', dniDoc);
    formData.append('files', votingBallotDoc);
    formData.append('files', notarizDegreeDoc);

    try {
      const response = await axios.post('http://localhost:3000/files/upload-personal-documents', formData, {
        withCredentials: true
      });
      setOpenAlert({open: true, type: "success", title: "" + response.data.message});
      setTimeout(() => {
        navigate('/list-personal-documents');
      }, 1500);
    } catch (error: any) {
      setOpenAlert({ open: true, type: "error", title: "" + error });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Subir Documentos Personales
      </Typography>
      
      <StyledPaper>
        <Stack component="form" onSubmit={handleSubmit} spacing={3}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<PhotoCameraIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Foto tamaño carnet
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf/*" 
              onChange={(e) => setPictureDoc(e.target.files?.[0] || null)} 
            />
          </Button>
          {pictureDoc && (
            <Alert severity="success">{pictureDoc.name}</Alert>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<BadgeIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Cédula de identidad
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setDniDoc(e.target.files?.[0] || null)} 
            />
          </Button>
          {dniDoc && (
            <Alert severity="success">{dniDoc.name}</Alert>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<HowToVoteIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Papeleta de votación
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setVotingBallotDoc(e.target.files?.[0] || null)} 
            />
          </Button>
          {votingBallotDoc && (
            <Alert severity="success">{votingBallotDoc.name}</Alert>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<SchoolIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Título notariado
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setNotarizDegreeDoc(e.target.files?.[0] || null)} 
            />
          </Button>
          {notarizDegreeDoc && (
            <Alert severity="success">{notarizDegreeDoc.name}</Alert>
          )}

          <Button 
            type="submit" 
            variant="contained" 
            size="large" 
            fullWidth
            sx={{ 
              mt: 2,
              py: 1.5,
              fontSize: '1rem'
            }}
          >
            Subir Documentos
          </Button>
        </Stack>
      </StyledPaper>
      
      {message && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default UploadPersonalDocuments;