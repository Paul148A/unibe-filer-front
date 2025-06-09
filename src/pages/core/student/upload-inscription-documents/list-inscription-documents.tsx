import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InscriptionDocument } from "../../../../interfaces/IInscriptionDocument";
import { getAllInscriptionDocuments, deleteInscriptionDocument } from "../../../../services/upload-files/inscription-documents.service";
import { useAuth } from "../../../../components/Context/context";
import CustomTable from "../../../../components/CustomTable/custom-table";
import Loader from "../../../../components/Loader/loader";
import { Typography, Button, Box } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UpdateInscriptionDocumentsModal from "./update-inscription-documents";

const ListInscriptionDocuments = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<InscriptionDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<InscriptionDocument | null>(null);
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

  const handleDelete = async (doc: InscriptionDocument) => {
    try {
      await deleteInscriptionDocument(doc.id);
      setOpenAlert({
        open: true,
        type: "success",
        title: "Documentos eliminados correctamente",
      });
      setDocuments(documents.filter(d => d.id !== doc.id));
    } catch (error) {
      setOpenAlert({
        open: true,
        type: "error",
        title: "Error al eliminar documentos",
      });
      console.error("Error al eliminar:", error);
    }
  };

  const handleUpdateClick = (doc: InscriptionDocument) => {
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

  if (loading) return <Loader />;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2">
          Lista de Documentos de Inscripción
        </Typography>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={() => navigate('/upload-inscription-documents')}
        >
          Subir Nuevos Documentos
        </Button>
      </Box>

      <CustomTable<InscriptionDocument>
        data={documents}
        columns={[
          { key: "registrationDoc", label: "Documento de Registro" },
          { key: "semesterGradeChartDoc", label: "Documento de Notas" },
          { key: "reEntryDoc", label: "Documento de Reingreso" },
          { key: "englishCertificateDoc", label: "Certificado de Inglés" },
          { key: "enrollmentCertificateDoc", label: "Certificado de Matrícula" },
          { key: "approvalDoc", label: "Documento de Aprobación" },
        ]}
        actionKeys={["EditarDocumentoInscripcion", "EliminarDocumentoInscripcion"]}
        onEditClick={handleUpdateClick}
        onDeleteClick={handleDelete}
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