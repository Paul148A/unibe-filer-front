import React, { useEffect, useState } from "react";
import axios from "axios";
import { PersonalDocument } from "../../../../interfaces/IPersonalDocument";
import { useAuth } from '../../../../components/Context/context';
import UpdatePersonalDocumentsModal from "./update-personal-documents";
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

const ListPersonalDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<PersonalDocument[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDocument, setSelectedDocument] = useState<PersonalDocument | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { setOpenAlert } = useAuth();
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = () => {
    axios
      .get("http://localhost:3000/files/list-personal-documents")
      .then((res) => setDocuments(res.data.personalDocuments))
      .catch((err) => console.error("Error al obtener los documentos", err));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, doc: PersonalDocument) => {
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
      await axios.delete(`http://localhost:3000/files/delete-personal-documents/${currentDocId}`);
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
        Lista de Documentos Personales
      </Typography>
      
      <StyledTableContainer>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'primary.contrastText' }}>Foto Carnet</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Cédula de Identidad</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Papeleta de Votación</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Título Notariado</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc) => (
                <StyledTableRow key={doc.id}>
                  <TableCell>{doc.pictureDoc}</TableCell>
                  <TableCell>{doc.dniDoc}</TableCell>
                  <TableCell>{doc.votingBallotDoc}</TableCell>
                  <TableCell>{doc.notarizDegreeDoc}</TableCell>
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
        <UpdatePersonalDocumentsModal
          document={selectedDocument}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </Box>
  );
};

export default ListPersonalDocuments;