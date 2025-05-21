import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '../../../../components/Context/context';
import { IRecord } from "../../../../interfaces/IRecord";
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
  styled,
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

const RecordsList: React.FC = () => {
  const [records, setRecords] = useState<IRecord[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { setOpenAlert } = useAuth();
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    axios
      .get("http://localhost:3000/records")
      .then((res) => setRecords(res.data))
      .catch((err) => {
        console.error("Error al obtener los expedientes", err);
        setOpenAlert({ open: true, type: "error", title: "Error al cargar expedientes" });
      });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, record: IRecord) => {
    setAnchorEl(event.currentTarget);
    setCurrentRecordId(record.id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRecordId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Lista de Expedientes
      </Typography>
      <StyledTableContainer>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'primary.contrastText' }}>Código</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Usuario</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Identificación</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Email</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <StyledTableRow key={record.id}>
                  <TableCell>{record.code}</TableCell>
                  <TableCell>{`${record.user.names} ${record.user.last_names}`}</TableCell>
                  <TableCell>{record.user.identification}</TableCell>
                  <TableCell>{record.user.email}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="more"
                      aria-controls={`record-menu-${record.id}`}
                      aria-haspopup="true"
                      onClick={(e) => handleMenuOpen(e, record)}
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
        id="record-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem sx={{ color: 'info.main' }}>Descargar Expediente</MenuItem>
      </Menu>
    </Box>
  );
};

export default RecordsList;