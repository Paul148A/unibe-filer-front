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
import {
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Replay as ReplayIcon,
  Translate as TranslateIcon,
  HowToReg as HowToRegIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';

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

const UploadInscriptionDocuments: React.FC = () => {
  const [registrationDoc, setRegistrationDoc] = useState<File | null>(null);
  const [semesterGradeChartDoc, setSemesterGradeChartDoc] = useState<File | null>(null);
  const [reEntryDoc, setReEntryDoc] = useState<File | null>(null);
  const [englishCertificateDoc, setEnglishCertificateDoc] = useState<File | null>(null);
  const [enrollmentCertificateDoc, setEnrollmentCertificateDoc] = useState<File | null>(null);
  const [approvalDoc, setApprovalDoc] = useState<File | null>(null);
  const [message] = useState('');
  const navigate = useNavigate();
  const { setOpenAlert } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registrationDoc || !semesterGradeChartDoc || !reEntryDoc || 
        !englishCertificateDoc || !enrollmentCertificateDoc || !approvalDoc) {
      setOpenAlert({ open: true, type: "error", title: "Debes subir todos los archivos del formulario" });
      return;
    }

    const formData = new FormData();
    formData.append('registration_doc', registrationDoc);
    formData.append('semester_grade_chart_doc', semesterGradeChartDoc);
    formData.append('re_entry_doc', reEntryDoc);
    formData.append('english_certificate_doc', englishCertificateDoc);
    formData.append('enrollment_certificate_doc', enrollmentCertificateDoc);
    formData.append('approval_doc', approvalDoc);

    try {
      const response = await axios.post('http://localhost:3000/files/upload-inscription-form', formData);
      setOpenAlert({open: true, type: "success", title: "" + response.data.message});
      setTimeout(() => {
        navigate('/list-inscription-documents');
      }, 1500);
    } catch (error) {
      setOpenAlert({ open: true, type: "error", title: "" + error });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Subir Documentos de Inscripción
      </Typography>
      
      <StyledPaper>
        <Stack component="form" onSubmit={handleSubmit} spacing={3}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<AssignmentIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Documento de Registro
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setRegistrationDoc(e.target.files?.[0] || null)} 
            />
          </Button>
          {registrationDoc && (
            <Alert severity="success">{registrationDoc.name}</Alert>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<GradeIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Papeleta de Notas
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setSemesterGradeChartDoc(e.target.files?.[0] || null)} 
            />
          </Button>
          {semesterGradeChartDoc && (
            <Alert severity="success">{semesterGradeChartDoc.name}</Alert>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<ReplayIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Documento de Reingreso
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setReEntryDoc(e.target.files?.[0] || null)} 
            />
          </Button>
          {reEntryDoc && (
            <Alert severity="success">{reEntryDoc.name}</Alert>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<TranslateIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Certificado de Inglés
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setEnglishCertificateDoc(e.target.files?.[0] || null)} 
            />
          </Button>
          {englishCertificateDoc && (
            <Alert severity="success">{englishCertificateDoc.name}</Alert>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<HowToRegIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Certificado de Matrícula
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setEnrollmentCertificateDoc(e.target.files?.[0] || null)} 
            />
          </Button>
          {enrollmentCertificateDoc && (
            <Alert severity="success">{enrollmentCertificateDoc.name}</Alert>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<VerifiedIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Documento de Aprobación
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setApprovalDoc(e.target.files?.[0] || null)} 
            />
          </Button>
          {approvalDoc && (
            <Alert severity="success">{approvalDoc.name}</Alert>
          )}

          <Button 
            type="submit" 
            variant="contained" 
            size="large" 
            fullWidth
            sx={{ mt: 2 }}
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

export default UploadInscriptionDocuments;