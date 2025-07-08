import { useEffect, useState } from "react";
import { IDegreeDocument } from "../../../../interfaces/IDegreeDocument";
import { getDegreeDocumentsByRecordId } from "../../../../services/upload-files/degree-documents.service";
import { useAuth } from "../../../../components/Context/context";
import VerticalTable from "../../../../components/CustomVerticalTable/vertical-table";
import Loader from "../../../../components/Loader/loader";
import { Typography, Button, Box } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import UpdateDegreeDocumentsModal from "./update-degree-documents";
import FilePreviewModal from "../../../../components/Modals/FilePreviewModal/file-preview-modal";
import { useParams } from "react-router-dom";

const ListDegreeDocuments = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const [documents, setDocuments] = useState<IDegreeDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<IDegreeDocument | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);
  const { setOpenAlert } = useAuth();

  useEffect(() => {
    if (!recordId) {
      setLoading(false);
      setDocuments(null);
      return;
    }
    const fetchDocuments = async () => {
      try {
        const docs = await getDegreeDocumentsByRecordId(recordId);
        setDocuments(docs);
      } catch (error) {
        setOpenAlert({
          open: true,
          type: "error",
          title: "Error al cargar los documentos de grado",
        });
        console.error("Error al obtener los documentos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [recordId]);

  const handleUpdateClick = (doc: IDegreeDocument) => {
    setSelectedDocument(doc);
    setShowUpdateModal(true);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    setLoading(true);
    getDegreeDocumentsByRecordId(recordId || '')
      .then(setDocuments)
      .finally(() => setLoading(false));
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const docs = await getDegreeDocumentsByRecordId(recordId || '');
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

  const handlePreviewClick = (doc: IDegreeDocument) => {
    const files = [
      { key: 'topicComplainDoc', name: 'Solicitud de Tema', url: doc.topicComplainDoc },
      { key: 'topicApprovalDoc', name: 'Aprobación de Tema', url: doc.topicApprovalDoc },
      { key: 'tutorAssignmentDoc', name: 'Asignación de Tutor', url: doc.tutorAssignmentDoc },
      { key: 'tutorFormatDoc', name: 'Formato de Tutor', url: doc.tutorFormatDoc },
      { key: 'antiplagiarismDoc', name: 'Antiplagio', url: doc.antiplagiarismDoc },
      { key: 'tutorLetter', name: 'Carta de Tutor', url: doc.tutorLetter },
      { key: 'electiveGrade', name: 'Nota Electivo', url: doc.electiveGrade },
      { key: 'academicClearance', name: 'Libre de Deuda', url: doc.academicClearance },
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

  const handleFieldPreviewClick = (_doc: IDegreeDocument, _fieldKey: string, fieldName: string, fieldValue: string) => {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2">
          Lista de Documentos de Grado
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
          <Button
            variant="outlined"
            onClick={() => documents && handlePreviewClick(documents)}
            disabled={!documents}
          >
            Previsualizar
          </Button>
        </Box>
      </Box>
      
      <VerticalTable<IDegreeDocument>
        data={documents ? [documents] : []}
        columns={[
          { key: "topicComplainDoc", label: "Solicitud de Tema" },
          { key: "topicApprovalDoc", label: "Aprobación de Tema" },
          { key: "tutorAssignmentDoc", label: "Asignación de Tutor" },
          { key: "tutorFormatDoc", label: "Formato de Tutor" },
          { key: "antiplagiarismDoc", label: "Antiplagio" },
          { key: "tutorLetter", label: "Carta de Tutor" },
          { key: "electiveGrade", label: "Nota Electivo" },
          { key: "academicClearance", label: "Libre de Deuda" },
        ]}
        actionKeys={['Previsualizar']}
        onFieldPreviewClick={handleFieldPreviewClick}
      />

      {showUpdateModal && selectedDocument && (
        <UpdateDegreeDocumentsModal
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
          documentType="degree"
        />
      )}
    </>
  );
};

export default ListDegreeDocuments;