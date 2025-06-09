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
import ListAltIcon from '@mui/icons-material/ListAlt';
import {
  AssignmentInd as AssignmentIndIcon,
  Grading as GradingIcon,
  Plagiarism as PlagiarismIcon,
  Mail as MailIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Receipt as ReceiptIcon,
  MoneyOff as MoneyOffIcon
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

const UploadDegreeDocuments: React.FC = () => {
  const [topicComplainDoc, setTopicComplainDoc] = useState<File | null>(null);
  const [topicApprovalDoc, setTopicApprovalDoc] = useState<File | null>(null);
  const [tutorAssignmentDoc, setTutorAssignmentDoc] = useState<File | null>(null);
  const [tutorFormatDoc, setTutorFormatDoc] = useState<File | null>(null);
  const [antiplagiarismDoc, setAntiplagiarismDoc] = useState<File | null>(null);
  const [tutorLetter, setTutorLetter] = useState<File | null>(null);
  const [electiveGrade, setElectiveGrade] = useState<File | null>(null);
  const [academicClearance, setAcademicClearance] = useState<File | null>(null);
  const [message] = useState('');
  const { setOpenAlert, record } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topicComplainDoc || !topicApprovalDoc || !tutorAssignmentDoc || 
        !tutorFormatDoc || !antiplagiarismDoc || !tutorLetter || 
        !electiveGrade || !academicClearance) {
      setOpenAlert({ open: true, type: "error", title: "Debes subir todos los archivos del formulario" });
      return;
    }

    const formData = new FormData();
    formData.append('topic_complain_doc', topicComplainDoc);
    formData.append('topic_approval_doc', topicApprovalDoc);
    formData.append('tutor_assignment_doc', tutorAssignmentDoc);
    formData.append('tutor_format_doc', tutorFormatDoc);
    formData.append('antiplagiarism_doc', antiplagiarismDoc);
    formData.append('tutor_letter', tutorLetter);
    formData.append('elective_grade', electiveGrade);
    formData.append('academic_clearance', academicClearance);
    formData.append('record_id', record?.id || '');

    try {
      const response = await axios.post('http://localhost:3000/api1/degree/upload-degree', formData,{
        withCredentials: true
      });
      setOpenAlert({open: true, type: "success", title: "" + response.data.message});
      setTimeout(() => {
        navigate('/list-degree-documents');
      }, 1500);
    } catch (error: any) {
      setOpenAlert({ open: true, type: "error", title: "" + error });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" align="center">
          Subir Documentos de Grado
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ListAltIcon />}
          onClick={() => navigate('/list-degree-documents')}
        >
          Ver Lista de Documentos
        </Button>
      </Box>
      
      <StyledPaper>
        <Stack component="form" onSubmit={handleSubmit} spacing={3}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<ReceiptIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Solicitud de Tema
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setTopicComplainDoc(e.target.files?.[0] || null)} 
            />
          </Button>
          {topicComplainDoc && (
            <Alert severity="success">{topicComplainDoc.name}</Alert>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<CheckCircleIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Aprobación de Tema
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setTopicApprovalDoc(e.target.files?.[0] || null)} 
            />
          </Button>
          {topicApprovalDoc && (
            <Alert severity="success">{topicApprovalDoc.name}</Alert>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<AssignmentIndIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Asignación de Tutor
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setTutorAssignmentDoc(e.target.files?.[0] || null)} 
            />
          </Button>
          {tutorAssignmentDoc && (
            <Alert severity="success">{tutorAssignmentDoc.name}</Alert>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<GradingIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Formato de Tutor
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setTutorFormatDoc(e.target.files?.[0] || null)} 
            />
          </Button>
          {tutorFormatDoc && (
            <Alert severity="success">{tutorFormatDoc.name}</Alert>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<PlagiarismIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Antiplagio
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setAntiplagiarismDoc(e.target.files?.[0] || null)} 
            />
          </Button>
          {antiplagiarismDoc && (
            <Alert severity="success">{antiplagiarismDoc.name}</Alert>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<MailIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Carta de Tutor
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setTutorLetter(e.target.files?.[0] || null)} 
            />
          </Button>
          {tutorLetter && (
            <Alert severity="success">{tutorLetter.name}</Alert>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<SchoolIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Nota Electivo
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setElectiveGrade(e.target.files?.[0] || null)} 
            />
          </Button>
          {electiveGrade && (
            <Alert severity="success">{electiveGrade.name}</Alert>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={<MoneyOffIcon />}
            endIcon={<CloudUploadIcon />}
            fullWidth
          >
            Libre de Deuda
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setAcademicClearance(e.target.files?.[0] || null)} 
            />
          </Button>
          {academicClearance && (
            <Alert severity="success">{academicClearance.name}</Alert>
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

export default UploadDegreeDocuments;