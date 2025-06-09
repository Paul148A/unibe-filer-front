import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IDegreeDocument } from "../../../../interfaces/IDegreeDocument";
import { deleteDegreeDocument, getAllDegreeDocuments } from "../../../../services/upload-files/degree-documents.service";
import { useAuth } from "../../../../components/Context/context";
import CustomTable from "../../../../components/CustomTable/custom-table";
import Loader from "../../../../components/Loader/loader";
import { Typography, Button, Box } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UpdateDegreeDocumentsModal from "./update-degree-documents";

const ListDegreeDocuments = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<IDegreeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<IDegreeDocument | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { setOpenAlert } = useAuth();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getAllDegreeDocuments();
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
  }, []);

  const handleDelete = async (doc: IDegreeDocument) => {
    try {
      await deleteDegreeDocument(doc.id);
      setOpenAlert({ 
        open: true, 
        type: "success", 
        title: "Documentos eliminados correctamente" 
      });
      setDocuments(documents.filter(d => d.id !== doc.id));
    } catch (error) {
      setOpenAlert({ 
        open: true, 
        type: "error", 
        title: "Error al eliminar documentos" 
      });
      console.error("Error al eliminar:", error);
    }
  };

  const handleUpdateClick = (doc: IDegreeDocument) => {
    setSelectedDocument(doc);
    setShowUpdateModal(true);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    setLoading(true);
    getAllDegreeDocuments()
      .then(setDocuments)
      .finally(() => setLoading(false));
  };

  if (loading) return <Loader />;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2">
          Lista de Documentos de Grado
        </Typography>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={() => navigate('/upload-degree-documents')}
        >
          Subir Nuevos Documentos
        </Button>
      </Box>
      
      <CustomTable<IDegreeDocument>
        data={documents}
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
        actionKeys={["EditarDocumentoGrado", "EliminarDocumentoGrado"]}
        onEditClick={handleUpdateClick}
        onDeleteClick={handleDelete}
      />

      {showUpdateModal && selectedDocument && (
        <UpdateDegreeDocumentsModal
          document={selectedDocument}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </>
  );
};

export default ListDegreeDocuments;