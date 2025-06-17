import { useEffect, useState } from "react";
import { IInscriptionDocument } from "../../../../interfaces/IInscriptionDocument";
import { getAllInscriptionDocuments } from "../../../../services/upload-files/inscription-documents.service";
import { useAuth } from "../../../../components/Context/context";
import VerticalTable from "../../../../components/CustomVerticalTable/vertical-table";
import Loader from "../../../../components/Loader/loader";
import { Typography, Button, Box } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import UpdateInscriptionDocumentsModal from "./update-inscription-documents";

const ListInscriptionDocuments = () => {
  const [documents, setDocuments] = useState<IInscriptionDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<IInscriptionDocument | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { setOpenAlert } = useAuth();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getAllInscriptionDocuments();
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
        // actionKeys={["EditarDocumentoInscripcion", "Refrescar"]}
        // onEditClick={handleUpdateClick}
        // onDeleteClick={handleDelete}
        // onRefreshClick={handleRefresh}
      />

      {showUpdateModal && selectedDocument && (
        <UpdateInscriptionDocumentsModal
          document={selectedDocument}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </>
  );
};

export default ListInscriptionDocuments;