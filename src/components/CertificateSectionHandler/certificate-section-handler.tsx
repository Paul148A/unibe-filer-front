import { Button, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { IDegreeDocument } from "../../interfaces/IDegreeDocument";
import { IInscriptionDocument } from "../../interfaces/IInscriptionDocument";
import { IPersonalDocument } from "../../interfaces/IPersonalDocument";
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { downloadInscriptionDocument, updateInscriptionDocumentStatus } from "../../services/upload-files/inscription-documents.service";
import { useState } from "react";
import FilePreviewModal from "../Modals/FilePreviewModal/file-preview-modal";
import { IGlobal } from "../../global/IGlobal";

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
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);

  const handleDownload = async () => {
    try {
      await downloadInscriptionDocument(props.documentId, props.documentType);
    } catch (error) {
      console.error('Error al descargar el documento:', error);
    }
  };

  const handlePreviewClick = () => {
    // Obtener el nombre del archivo del certificado de inglés desde el documento de inscripción
    const inscriptionDocs = props.docs as IInscriptionDocument;
    const fileName = inscriptionDocs.englishCertificateDoc;
    
    if (fileName && fileName.trim() !== '') {
      setPreviewFile({
        url: fileName,
        name: 'Certificado de Inglés'
      });
      setShowPreviewModal(true);
    } else {
      console.error('No hay archivo de certificado de inglés disponible');
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

  // Verificar si hay un archivo de certificado disponible
  const inscriptionDocs = props.docs as IInscriptionDocument;
  const hasCertificateFile = inscriptionDocs.englishCertificateDoc && inscriptionDocs.englishCertificateDoc.trim() !== '';

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
        >
          Descargar Certificado de inglés
        </Button>

        {hasCertificateFile && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<VisibilityIcon />}
            onClick={handlePreviewClick}
          >
            Ver Certificado
          </Button>
        )}

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

      {showPreviewModal && previewFile && (
        <FilePreviewModal
          open={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          fileName={previewFile.name}
          fileUrl={previewFile.url}
          documentType="inscription"
        />
      )}
    </>
  );
}

export default CertificateSectionHandler;