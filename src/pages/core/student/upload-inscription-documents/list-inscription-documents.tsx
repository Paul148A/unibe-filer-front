import React, { useEffect, useState } from "react";
import axios from "axios";
import { InscriptionDocument } from "../../../../interfaces/IInscriptionDocument";
import { useAuth } from '../../../../components/Context/context';
import UpdateInscriptionDocumentsModal from "./update-personal-documents";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  styled
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const StyledTableContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  overflowX: 'auto',
  width: '100%'
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const ListInscriptionDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<InscriptionDocument[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDocument, setSelectedDocument] = useState<InscriptionDocument | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { setOpenAlert } = useAuth();
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = () => {
    axios
      .get("http://localhost:3000/files/list-inscription-forms")
      .then((res) => setDocuments(res.data.inscriptionForms))
      .catch((err) => console.error("Error al obtener los documentos", err));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, doc: InscriptionDocument) => {
    setAnchorEl(event.currentTarget);
    setSelectedDocument(doc);
    setCurrentDocId(doc.id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentDocId(null);
  };

  const handleDelete = async () => {
    if (!currentDocId) return;
    
    try {
      await axios.delete(`http://localhost:3000/files/delete-inscription-form/${currentDocId}`);
      setOpenAlert({ open: true, type: "error", title: "Documentos eliminados correctamente" });
      fetchDocuments();
    } catch (error) {
      setOpenAlert({ open: true, type: "error", title: "Error al eliminar documentos" });
      console.error("Error al eliminar:", error);
    }
    handleMenuClose();
  };

  const handleUpdateClick = () => {
    setShowUpdateModal(true);
    handleMenuClose();
  };

  const handleUpdateSuccess = () => {
    fetchDocuments();
    setShowUpdateModal(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Lista de Documentos de Inscripción
      </Typography>
      
      <StyledTableContainer>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'primary.contrastText' }}>Documento de Registro</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Documento de Notas</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Documento de Reingreso</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Certificado de Inglés</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Certificado de Matrícula</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Documento de Aprobación</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc) => (
                <StyledTableRow key={doc.id}>
                  <TableCell>{doc.registrationDoc}</TableCell>
                  <TableCell>{doc.semesterGradeChartDoc}</TableCell>
                  <TableCell>{doc.reEntryDoc}</TableCell>
                  <TableCell>{doc.englishCertificateDoc}</TableCell>
                  <TableCell>{doc.enrollmentCertificateDoc}</TableCell>
                  <TableCell>{doc.approvalDoc}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="more"
                      aria-controls={`document-menu-${doc.id}`}
                      aria-haspopup="true"
                      onClick={(e) => handleMenuOpen(e, doc)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledTableContainer>

      <Menu
        id="document-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleUpdateClick}>Actualizar</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Eliminar</MenuItem>
      </Menu>

      {showUpdateModal && selectedDocument && (
        <UpdateInscriptionDocumentsModal
          document={selectedDocument}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </Box>
  );
};

export default ListInscriptionDocuments;