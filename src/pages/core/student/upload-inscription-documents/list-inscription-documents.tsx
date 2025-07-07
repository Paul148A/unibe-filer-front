import { useEffect, useState } from "react";
import { IInscriptionDocument } from "../../../../interfaces/IInscriptionDocument";
import { getAllInscriptionDocuments, getInscriptionDocumentsByRecordId } from "../../../../services/upload-files/inscription-documents.service";
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


const ListInscriptionDocuments = () => {
  const {recordId} = useParams<{ recordId: string }>();
  const [documents, setDocuments] = useState<IInscriptionDocument>();
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<IInscriptionDocument | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);
  const [openGradeModal, setOpenGradeModal] = useState(false);
  const { setOpenAlert } = useAuth();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getInscriptionDocumentsByRecordId(recordId|| '');
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
  }, []);

  const handleUpdateClick = (doc: IInscriptionDocument) => {
    setSelectedDocument(doc);
    setShowUpdateModal(true);
  };

  const handleGradeClick = () => {
    setOpenGradeModal(true);
  };

  const handleCloseGradeModal = () => {
    setOpenGradeModal(false);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    setLoading(true);
    getAllInscriptionDocuments()
      .then(setDocuments)
      .finally(() => setLoading(false));
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const docs = await getAllInscriptionDocuments();
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
    if (documents.length > 0) {
      handleUpdateClick(documents[0]);
    }
  };

  const handlePreviewClick = (doc: IInscriptionDocument) => {
    const files = [
      { key: 'registrationDoc', name: 'Documento de Registro', url: doc.registrationDoc },
      { key: 'semesterGradeChartDoc', name: 'Documento de Notas', url: doc.semesterGradeChartDoc },
      { key: 'reEntryDoc', name: 'Documento de Reingreso', url: doc.reEntryDoc },
      { key: 'englishCertificateDoc', name: 'Certificado de Inglés', url: doc.englishCertificateDoc },
      { key: 'enrollmentCertificateDoc', name: 'Certificado de Matrícula', url: doc.enrollmentCertificateDoc },
      { key: 'approvalDoc', name: 'Documento de Aprobación', url: doc.approvalDoc },
    ];

    const firstAvailableFile = files.find(file => file.url && file.url.trim() !== '');

    if (firstAvailableFile) {
      setPreviewFile({
        url: firstAvailableFile.url,
        name: firstAvailableFile.name
      });
      setShowPreviewModal(true);
    } else {
      setOpenAlert({
        open: true,
        type: "warning",
        title: "No hay archivos disponibles para previsualizar",
      });
    }
  };

  const handleFieldPreviewClick = (doc: IInscriptionDocument, fieldKey: string, fieldName: string, fieldValue: string) => {
    setPreviewFile({
      url: fieldValue,
      name: fieldName
    });
    setShowPreviewModal(true);
  };

  if (loading) return <Loader />;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2">
          Lista de Documentos de Inscripción
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
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
            disabled={documents.length === 0}
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
        data={documents}
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
          <GradeModal inscriptionId={documents.id}/>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ListInscriptionDocuments;