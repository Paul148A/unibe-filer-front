import { Button, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { IDegreeDocument } from "../../interfaces/IDegreeDocument";
import { IInscriptionDocument } from "../../interfaces/IInscriptionDocument";
import { IPersonalDocument } from "../../interfaces/IPersonalDocument";
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import { downloadInscriptionDocument, updateInscriptionDocumentStatus } from "../../services/upload-files/inscription-documents.service";
import { useState } from "react";

interface Props {
  sectionType?: string;
  docs: IPersonalDocument | IInscriptionDocument | IDegreeDocument;
  documentId: string;
  documentType: string;
  status?: 'approved' | 'rejected' | 'pending';
  onStatusChange?: (newStatus: 'approved' | 'rejected' | 'pending') => void;
}

const CertificateSectionHandler = (props: Props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [status, setStatus] = useState<'approved' | 'rejected' | 'pending'>(props.status || 'pending');

  const handleDownload = async () => {
    try {
      await downloadInscriptionDocument(props.documentId, props.documentType);
    } catch (error) {
      console.error('Error al descargar el documento:', error);
    }
  };

  const handleStatusChange = async (newStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      await updateInscriptionDocumentStatus(props.documentId, newStatus);
      setStatus(newStatus);
      if (props.onStatusChange) {
        props.onStatusChange(newStatus);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobado';
      case 'rejected':
        return 'Rechazado';
      default:
        return 'Pendiente';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        onClick={handleDownload}
      >
        Descargar Certificado de inglés
      </Button>

      <Button
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={() => setOpenDialog(true)}
        color={getStatusColor(status)}
      >
        Estado: {getStatusText(status)}
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cambiar Estado del Certificado</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={status}
              label="Estado"
              onChange={(e) => handleStatusChange(e.target.value as 'approved' | 'rejected' | 'pending')}
            >
              <MenuItem value="approved">Aprobado</MenuItem>
              <MenuItem value="rejected">Rechazado</MenuItem>
              <MenuItem value="pending">Pendiente</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default CertificateSectionHandler;