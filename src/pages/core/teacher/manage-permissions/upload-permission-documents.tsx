import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../components/Context/context';
import {
  Box,
  Typography,
  Button,
  Paper,
  styled,
  Alert,
  Stack,
  TextField
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { PermissionDocumentsService } from '../../../../services/upload-files/permission-documents.service';
import { RecordsService, IRecord } from '../../../../services/core/records.service';
import RecordSelector from '../../../../components/RecordSelector/record-selector';

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

const UploadPermissionDocuments: React.FC = () => {
  const [supportingDoc, setSupportingDoc] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('');
  const [recordId, setRecordId] = useState<string>('');
  const [records, setRecords] = useState<IRecord[]>([]);
  const { setOpenAlert } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await RecordsService.getAllRecords();
        setRecords(response.data || []);
      } catch (error) {
        setRecords([]);
      }
    };
    fetchRecords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supportingDoc) {
      setOpenAlert({ open: true, type: "error", title: "Debes subir el archivo de respaldo" });
      return;
    }

    const recordExists = records.some(r => r.id === recordId);
    if (!recordId.trim() || !recordExists) {
      setOpenAlert({ open: true, type: "error", title: "Debes seleccionar un estudiante válido de la lista" });
      return;
    }

    try {
      const response = await PermissionDocumentsService.uploadPermissionDocument(
        recordId,
        supportingDoc,
        description.trim() || undefined
      );
      setOpenAlert({open: true, type: "success", title: response.message});
      setTimeout(() => {
        navigate('/teacher/manage-permissions/list-permission-documents');
      }, 1500);
    } catch (error: any) {
      setOpenAlert({ open: true, type: "error", title: error.response?.data?.message || "Error al subir documento" });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" align="center">
          Subir Documento de Permiso
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ListAltIcon />}
          onClick={() => navigate('/teacher/manage-permissions/list-permission-documents')}
        >
          Ver Lista de Documentos
        </Button>
      </Box>
      <StyledPaper>
        <Stack component="form" onSubmit={handleSubmit} spacing={3}>
          <RecordSelector
            value={recordId}
            onChange={setRecordId}
            label="Seleccionar Estudiante"
            required
          />

          <TextField
            label="Descripción del Permiso"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el motivo del permiso o notificación..."
            fullWidth
            variant="outlined"
          />

          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            fullWidth
          >
            Documento Permiso (PDF)
            <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setSupportingDoc(e.target.files?.[0] || null)} 
            />
          </Button>
          {supportingDoc && (
            <Alert severity="success">{supportingDoc.name}</Alert>
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
            Subir Documento
          </Button>
        </Stack>
      </StyledPaper>
    </Box>
  );
};

export default UploadPermissionDocuments; 