import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../components/Context/context';
import {
  Box,
  Typography,
  Button,
  Paper,
  styled,
  Alert,
  Stack,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PermissionDocumentsService } from '../../../../services/upload-files/permission-documents.service';
import { IPermissionDocument } from '../../../../interfaces/IPermissionDocument';
import { RecordsService, IRecord } from '../../../../services/core/records.service';

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

const UpdatePermissionDocuments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [permission, setPermission] = useState<IPermissionDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [supportingDoc, setSupportingDoc] = useState<File | null>(null);
  const { setOpenAlert } = useAuth();
  const navigate = useNavigate();
  const [record, setRecord] = useState<IRecord | null>(null);

  useEffect(() => {
    if (id) {
      loadPermission();
    }
  }, [id]);

  useEffect(() => {
    if (permission) {
      loadRecord(permission.record_id);
    }
  }, [permission]);

  const loadPermission = async () => {
    try {
      const response = await PermissionDocumentsService.getPermissionDocumentById(id!);
      setPermission(response.data);
    } catch (error: any) {
      setOpenAlert({ 
        open: true, 
        type: "error", 
        title: error.response?.data?.message || "Error al cargar el documento" 
      });
      navigate('/teacher/manage-permissions/list-permission-documents');
    } finally {
      setLoading(false);
    }
  };

  const loadRecord = async (recordId: string) => {
    try {
      const response = await RecordsService.getAllRecords();
      const found = response.data.find((r) => r.id === recordId);
      setRecord(found || null);
    } catch (error) {
      setRecord(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportingDoc) {
      setOpenAlert({ open: true, type: "error", title: "Debes seleccionar un archivo para actualizar" });
      return;
    }
    setUpdating(true);
    try {
      const response = await PermissionDocumentsService.updatePermissionDocument(
        id!,
        supportingDoc
      );
      setOpenAlert({open: true, type: "success", title: response.message});
      setTimeout(() => {
        navigate('/teacher/manage-permissions/list-permission-documents');
      }, 1500);
    } catch (error: any) {
      setOpenAlert({ 
        open: true, 
        type: "error", 
        title: error.response?.data?.message || "Error al actualizar documento" 
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!permission) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Documento no encontrado</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" align="center">
          Actualizar Permiso
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/teacher/manage-permissions/list-permission-documents')}
        >
          Volver a la Lista
        </Button>
      </Box>
      <StyledPaper>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Nombre del archivo actual:</strong> {permission.supportingDoc ? permission.supportingDoc : 'Sin archivo'}
            </Typography>
            <Typography variant="body2">
              <strong>Código de Record:</strong> {record?.code || 'Cargando...'}
            </Typography>
            <Typography variant="body2">
              <strong>Estudiante:</strong> {record ? `${record.user.names} ${record.user.last_names} (DNI: ${record.user.identification})` : 'Cargando...'}
            </Typography>
          </Alert>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            fullWidth
          >
            Selecciona el nuevo archivo de respaldo (PDF)
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
            onClick={handleSubmit}
            disabled={updating}
            sx={{ 
              mt: 2,
              py: 1.5,
              fontSize: '1rem'
            }}
          >
            {updating ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Actualizando...
              </>
            ) : (
              'Actualizar Documento'
            )}
          </Button>
        </Stack>
      </StyledPaper>
    </Box>
  );
};

export default UpdatePermissionDocuments; 