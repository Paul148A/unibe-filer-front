import { useEffect, useState } from "react";
import { IPersonalDocument } from "../../../../interfaces/IPersonalDocument";
import { getPersonalDocumentsByRecordId } from "../../../../services/upload-files/personal-documents.service";
import { useAuth } from "../../../../components/Context/context";
import VerticalTable from "../../../../components/CustomVerticalTable/vertical-table";
import Loader from "../../../../components/Loader/loader";
import { Typography, Button, Box } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import UpdatePersonalDocumentsModal from "./update-personal-documents";
import FilePreviewModal from "../../../../components/Modals/FilePreviewModal/file-preview-modal";
import { useParams } from "react-router-dom";

const ListPersonalDocuments = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const [documents, setDocuments] = useState<IPersonalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<IPersonalDocument | null>(null);
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
        const docs = await getPersonalDocumentsByRecordId(recordId);
        setDocuments(docs);
      } catch (error) {
        setOpenAlert({
          open: true,
          type: "error",
          title: "Error al cargar los documentos personales",
        });
        console.error("Error al obtener los documentos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [recordId]);

  const handleUpdateClick = (doc: IPersonalDocument) => {
    setSelectedDocument(doc);
    setShowUpdateModal(true);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    setLoading(true);
    getPersonalDocumentsByRecordId(recordId || '')
      .then(setDocuments)
      .finally(() => setLoading(false));
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const docs = await getPersonalDocumentsByRecordId(recordId || '');
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

  const handleFieldPreviewClick = (_doc: IPersonalDocument, _fieldKey: string, fieldName: string, fieldValue: string) => {
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
          Lista de Documentos Personales
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
        </Box>
      </Box>

      <VerticalTable<IPersonalDocument>
        data={documents ? [documents] : []}
        columns={[
          { key: "pictureDoc", label: "Foto Carnet" },
          { key: "dniDoc", label: "Cédula de Identidad" },
          { key: "votingBallotDoc", label: "Papeleta de Votación" },
          { key: "notarizDegreeDoc", label: "Título Notariado" },
        ]}
        actionKeys={['Previsualizar']}
        onFieldPreviewClick={handleFieldPreviewClick}
      />

      {showUpdateModal && selectedDocument && (
        <UpdatePersonalDocumentsModal
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
          documentType="personal"
        />
      )}
    </>
  );
};

export default ListPersonalDocuments;