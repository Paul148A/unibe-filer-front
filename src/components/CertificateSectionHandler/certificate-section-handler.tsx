import { Button, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { IDegreeDocument } from "../../interfaces/IDegreeDocument";
import { IInscriptionDocument } from "../../interfaces/IInscriptionDocument";
import { IPersonalDocument } from "../../interfaces/IPersonalDocument";
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { downloadInscriptionDocument, getDocumentStatuses, updateInscriptionDocumentStatus } from "../../services/upload-files/inscription-documents.service";
import { useState, useEffect } from "react";
import FilePreviewModal from "../Modals/FilePreviewModal/file-preview-modal";
import ConfirmDialog from '../Global/ConfirmDialog';

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
  const [statusOptions, setStatusOptions] = useState<{ id: string, name: string }[]>([]);
  const [docsState, setDocsState] = useState(props.docs as IInscriptionDocument);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pendingStatusId, setPendingStatusId] = useState<string | null>(null);

  useEffect(() => {
    getDocumentStatuses().then(setStatusOptions);
  }, []);

  const handleDownload = async () => {
    try {
      await downloadInscriptionDocument(props.documentId, props.documentType);
    } catch (error) {
      console.error('Error al descargar el documento:', error);
    }
  };

  const handlePreviewClick = () => {
    const fileName = docsState.englishCertificateDoc;
    
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

  const handleStatusChange = async (statusId: string) => {
    try {
      const statusObj = statusOptions.find(s => s.id === statusId);
      const statusName = statusObj?.name?.toLowerCase();
      let mappedStatus: 'approved' | 'rejected' | 'pending' = 'pending';
      if (statusName?.includes('aprobado')) mappedStatus = 'approved';
      else if (statusName?.includes('rechazado')) mappedStatus = 'rejected';
      else if (statusName?.includes('revision') || statusName?.includes('revisión')) mappedStatus = 'pending';
      else mappedStatus = 'pending';
      if (mappedStatus === 'rejected') {
        setPendingStatusId(statusId);
        setOpenConfirmDialog(true);
        return;
      }
      await updateInscriptionDocumentStatus(props.documentId, 'englishCertificateDocStatus', statusId);
      setDocsState({
        ...docsState,
        englishCertificateDocStatus: statusObj
      });
      setOpenDialog(false);
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };

  const handleConfirmReject = async () => {
    if (!pendingStatusId) return;
    try {
      const statusObj = statusOptions.find(s => s.id === pendingStatusId);
      await updateInscriptionDocumentStatus(props.documentId, 'englishCertificateDocStatus', pendingStatusId);
      setDocsState({
        ...docsState,
        englishCertificateDocStatus: statusObj
      });
      setOpenDialog(false);
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
    setOpenConfirmDialog(false);
    setPendingStatusId(null);
  };

  const handleCancelReject = () => {
    setOpenConfirmDialog(false);
    setPendingStatusId(null);
  };

  const getStatusColor = (name: string) => {
    if (!name) return 'warning';
    if (name.toLowerCase().includes('aprobado')) return 'success';
    if (name.toLowerCase().includes('rechazado')) return 'error';
    if (name.toLowerCase().includes('revision') || name.toLowerCase().includes('revisión')) return 'warning';
    return 'warning';
  };

  const getStatusText = (name: string) => {
    if (!name) return 'En revisión';
    return name;
  };

  const hasCertificateFile = docsState.englishCertificateDoc && docsState.englishCertificateDoc.trim() !== '';
  const statusObj = docsState.englishCertificateDocStatus;

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
          color={getStatusColor(statusObj?.name || '')}
        >
          Estado: {getStatusText(statusObj?.name || '')}
        </Button>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Cambiar Estado del Certificado</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusObj && statusObj.id ? statusObj.id : ''}
                label="Estado"
                onChange={(e) => handleStatusChange(e.target.value as string)}
              >
                {statusOptions.filter(option => !option.name.toLowerCase().includes('revisión') && !option.name.toLowerCase().includes('revision')).map(option => (
                  <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={openConfirmDialog}
          title="Confirmar rechazo"
          message="¿Estás seguro de que deseas rechazar este documento? Esta acción eliminará el archivo asociado de inmediato y notificara al estudiante para corregir el documento."
          onCancel={handleCancelReject}
          onConfirm={handleConfirmReject}
        />
      </Box>

      {showPreviewModal && previewFile && (
        <FilePreviewModal
          open={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          fileName={previewFile.name}
          fileUrl={previewFile.url}
          documentType="inscription"
          userIdentification={docsState?.record?.user?.identification}
        />
      )}
    </>
  );
}

export default CertificateSectionHandler;