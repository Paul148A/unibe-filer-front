import { useEffect, useState } from "react";
import { IInscriptionDocument } from "../../../../interfaces/IInscriptionDocument";
import { getInscriptionDocumentsByRecordId } from "../../../../services/upload-files/inscription-documents.service";
import { useAuth } from "../../../../components/Context/context";
import VerticalTable from "../../../../components/CustomVerticalTable/vertical-table";
import Loader from "../../../../components/Loader/loader";
import { Typography, Button, Box, Dialog, DialogTitle, IconButton, DialogContent } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import UpdateInscriptionDocumentsModal from "./update-inscription-documents";
import FilePreviewModal from "../../../../components/Modals/FilePreviewModal/file-preview-modal";
import CloseIcon from '@mui/icons-material/Close';
import GradeModal from "../../../../components/GradeModal/grade-modal";
import { useParams } from "react-router-dom";
import EnrollmentModal from "../../../../components/EnrollmentModal/enrollment-modal";


const ListInscriptionDocuments = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const [documents, setDocuments] = useState<IInscriptionDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<IInscriptionDocument | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);
  const [openGradeModal, setOpenGradeModal] = useState(false);
  const [openEnrollmentModal, setOpenEnrollmentModal] = useState(false);
  const { setOpenAlert } = useAuth();

  useEffect(() => {
    if (!recordId) {
      setLoading(false);
      setDocuments(null);
      return;
    }
    const cleanRecordId = recordId.replace(':recordId', '');
    const fetchDocuments = async () => {
      try {
        const docs = await getInscriptionDocumentsByRecordId(cleanRecordId);
        console.log('documentos de inscripcion:', docs);
        setDocuments(docs);
      } catch (error) {
        setOpenAlert({
          open: true,
          type: "error",
          title: "Error al cargar los documentos de inscripción",
        });
        console.error("Error al obtener los documentos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [recordId]);

  const handleUpdateClick = (doc: IInscriptionDocument) => {
    setSelectedDocument(doc);
    setShowUpdateModal(true);
  };

  const handleGradeClick = () => {
    setOpenGradeModal(true);
  };

  const handleEnrollmentClick = () => {
    setOpenEnrollmentModal(true);
  };

  const handleCloseGradeModal = () => {
    setOpenGradeModal(false);
  };

  const handleCloseEnrollmentModal = () => {
    setOpenEnrollmentModal(false);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    setLoading(true);
    getInscriptionDocumentsByRecordId(recordId || '')
      .then(setDocuments)
      .finally(() => setLoading(false));
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const docs = await getInscriptionDocumentsByRecordId(recordId || '');
      setDocuments(docs);
      setOpenAlert({
        open: true,
        type: "success",
        title: "Lista actualizada correctamente",
      });
    } catch (error) {
      setOpenAlert({
        open: true,
        type: "error",
        title: "Error al actualizar la lista",
      });
      console.error("Error al actualizar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAll = () => {
    if (documents) {
      handleUpdateClick(documents);
    }
  };

  const handleFieldPreviewClick = (_doc: IInscriptionDocument, _fieldKey: string, fieldName: string, fieldValue: string) => {
    setPreviewFile({
      url: fieldValue,
      name: fieldName
    });
    setShowPreviewModal(true);
  };

  if (!recordId) return <Typography variant="h6">No se encontró el expediente del estudiante.</Typography>;

  if (loading) return <Loader />;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 2, ml: 5 }}>
        <Typography variant="h4" component="h2">
          Lista de Documentos de Inscripción
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', mb: 3, mt: 2, mr: 5 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            sx={{backgroundColor: 'green', color: 'white'}}
            startIcon={<EditIcon />}
            onClick={handleEnrollmentClick}
          //disabled={documents}
          >
            Agregar documento de matrícula
          </Button>
          <Button
            sx={{backgroundColor: 'blue', color: 'white'}}
            startIcon={<EditIcon />}
            onClick={handleGradeClick}
          //disabled={documents}
          >
            Agregar documento de notas
          </Button>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditAll}
            disabled={!documents}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refrescar
          </Button>
        </Box>
      </Box>

      <VerticalTable<IInscriptionDocument>
        data={documents ? [documents] : []}
        columns={[
          { key: "registrationDoc", label: "Documento de Registro" },
          { key: "semesterGradeChartDoc", label: "Documento de Notas" },
          { key: "reEntryDoc", label: "Documento de Reingreso" },
          { key: "englishCertificateDoc", label: "Certificado de Inglés" },
          { key: "enrollmentCertificateDoc", label: "Certificado de Matrícula" },
          { key: "approvalDoc", label: "Documento de Aprobación" },
        ]}
        actionKeys={['Previsualizar']}
        onFieldPreviewClick={handleFieldPreviewClick}
      />

      {showUpdateModal && selectedDocument && (
        <UpdateInscriptionDocumentsModal
          document={selectedDocument}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateSuccess}
        />
      )}

      {showPreviewModal && previewFile && (
        <FilePreviewModal
          open={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          fileName={previewFile.name}
          fileUrl={previewFile.url}
          documentType="inscription"
        />
      )}

      <Dialog open={openGradeModal} onClose={handleCloseGradeModal}>
        <DialogTitle>
          Subir documento de notas
          <IconButton
            aria-label="close"
            onClick={handleCloseGradeModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <GradeModal inscriptionId={documents ? documents.id : ''} />
        </DialogContent>
      </Dialog>
      <Dialog open={openEnrollmentModal} onClose={handleCloseEnrollmentModal}>
        <DialogTitle>
          Subir documento de matrícula
          <IconButton
            aria-label="close"
            onClick={handleCloseEnrollmentModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <EnrollmentModal inscriptionId={documents ? documents.id : ''} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ListInscriptionDocuments;