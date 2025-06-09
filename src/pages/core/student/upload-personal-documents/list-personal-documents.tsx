import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PersonalDocument } from "../../../../interfaces/IPersonalDocument";
import { getAllPersonalDocuments, deletePersonalDocument } from "../../../../services/upload-files/personal-documents.service";
import { useAuth } from "../../../../components/Context/context";
import CustomTable from "../../../../components/CustomTable/custom-table";
import Loader from "../../../../components/Loader/loader";
import { Typography, Button, Box } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UpdatePersonalDocumentsModal from "./update-personal-documents";

const ListPersonalDocuments = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<PersonalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<PersonalDocument | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { setOpenAlert } = useAuth();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getAllPersonalDocuments();
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
  }, []);

  const handleDelete = async (doc: PersonalDocument) => {
    try {
      await deletePersonalDocument(doc.id);
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

  const handleUpdateClick = (doc: PersonalDocument) => {
    setSelectedDocument(doc);
    setShowUpdateModal(true);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    setLoading(true);
    getAllPersonalDocuments()
      .then(setDocuments)
      .finally(() => setLoading(false));
  };

  if (loading) return <Loader />;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2">
          Lista de Documentos Personales
        </Typography>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={() => navigate('/upload-personal-documents')}
        >
          Subir Nuevos Documentos
        </Button>
      </Box>

      <CustomTable<PersonalDocument>
        data={documents}
        columns={[
          { key: "pictureDoc", label: "Foto Carnet" },
          { key: "dniDoc", label: "Cédula de Identidad" },
          { key: "votingBallotDoc", label: "Papeleta de Votación" },
          { key: "notarizDegreeDoc", label: "Título Notariado" },
        ]}
        actionKeys={["EditarDocumentoPersonal", "EliminarDocumentoPersonal"]}
        onEditClick={handleUpdateClick}
        onDeleteClick={handleDelete}
      />

      {showUpdateModal && selectedDocument && (
        <UpdatePersonalDocumentsModal
          document={selectedDocument}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </>
  );
};

export default ListPersonalDocuments;