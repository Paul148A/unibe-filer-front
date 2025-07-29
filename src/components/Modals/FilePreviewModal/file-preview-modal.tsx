import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IGlobal } from '../../../global/IGlobal';

interface FilePreviewModalProps {
  open: boolean;
  onClose: () => void;
  fileName: string;
  fileUrl: string;
  documentType?: 'personal' | 'inscription' | 'degree';
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  open,
  onClose,
  fileName,
  fileUrl,
  documentType
}) => {
  const handleClose = () => {
    // Si es una URL de blob, la liberamos para evitar memory leaks
    if (fileUrl.startsWith('blob:')) {
      window.URL.revokeObjectURL(fileUrl);
    }
    onClose();
  };
  const getFullFileUrl = (url: string): string => {
    // Si es una URL de blob, la usamos tal como está
    if (url.startsWith('blob:')) {
      return url;
    }
    
    // Si es una URL completa (http/https), la usamos tal como está
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    let folderPath = '';
    switch (documentType) {
      case 'personal':
        folderPath = 'documentos-personales';
        break;
      case 'inscription':
        folderPath = 'documentos-inscripcion';
        break;
      case 'degree':
        folderPath = 'documentos-grado';
        break;
      default:
        //Ruta de los documentos
        folderPath = 'uploads';
    }
    
    return `${IGlobal.BACK_ROUTE}/${folderPath}/${url}`;
  };

  const fullFileUrl = getFullFileUrl(fileUrl);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VisibilityIcon />
          <Typography variant="h6">
            Previsualización: {fileName}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, height: '100%' }}>
        {fullFileUrl ? (
          <iframe
            src={fullFileUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            title={fileName}
          />
        ) : (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column',
            gap: 2
          }}>
            <Typography variant="h6" color="text.secondary">
              No se puede previsualizar el archivo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              El archivo no está disponible o no es un PDF válido
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Cerrar
        </Button>
        {fullFileUrl && (
          <Button 
            onClick={() => window.open(fullFileUrl, '_blank')} 
            variant="contained"
            color="primary"
          >
            Abrir en Nueva Pestaña
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FilePreviewModal; 