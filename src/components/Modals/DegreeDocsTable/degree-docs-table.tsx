import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip } from '@mui/material';
import { IDegreeDocument } from '../../../interfaces/IDegreeDocument';
import FilePreviewModal from '../../Modals/FilePreviewModal/file-preview-modal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { Menu, MenuItem } from '@mui/material';
import { getDocumentStatuses, updateDegreeStatus, getDegreeDocumentsByRecordId } from '../../../services/upload-files/degree-documents.service';
import { useEffect } from 'react';
import ConfirmDialog from '../../Global/ConfirmDialog';
import { useAuth } from '../../Context/context';

interface Props {
  degreeDocs: IDegreeDocument;
  onClose?: () => void;
  onDataChanged?: () => void;
}

const documentTypes = [
  { key: 'topicComplainDoc', label: 'Tema Reclamo', statusKey: 'topicComplainDocStatus' },
  { key: 'topicApprovalDoc', label: 'Tema Aprobación', statusKey: 'topicApprovalDocStatus' },
  { key: 'tutorAssignmentDoc', label: 'Asignación Tutor', statusKey: 'tutorAssignmentDocStatus' },
  { key: 'tutorFormatDoc', label: 'Formato Tutor', statusKey: 'tutorFormatDocStatus' },
  { key: 'antiplagiarismDoc', label: 'Antiplagio', statusKey: 'antiplagiarismDocStatus' },
  { key: 'tutorLetter', label: 'Carta Tutor', statusKey: 'tutorLetterStatus' },
  { key: 'electiveGrade', label: 'Nota Electiva', statusKey: 'electiveGradeStatus' },
  { key: 'academicClearance', label: 'Solvencia Académica', statusKey: 'academicClearanceStatus' },
];

const getStatusColor = (name: string) => {
  if (!name) return 'default';
  if (name.toLowerCase().includes('aprobado')) return 'success';
  if (name.toLowerCase().includes('rechazado')) return 'error';
  if (name.toLowerCase().includes('revision') || name.toLowerCase().includes('revisión')) return 'warning';
  return 'default';
};

const DegreeDocumentsTable: React.FC<Props> = ({ degreeDocs, onClose, onDataChanged }) => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDocKey, setSelectedDocKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [docsState, setDocsState] = useState(degreeDocs);
  const [statusOptions, setStatusOptions] = useState<{ id: string, name: string }[]>([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pendingStatusId, setPendingStatusId] = useState<string | null>(null);
  const { setOpenAlert } = useAuth();

  useEffect(() => {
    getDocumentStatuses().then(setStatusOptions);
  }, []);

  const handlePreviewClick = (fieldKey: string, fieldName: string, fieldValue: string) => {
    setPreviewFile({
      url: fieldValue,
      name: fieldName
    });
    setShowPreviewModal(true);
  };

  const handleStatusClick = (event: React.MouseEvent<HTMLButtonElement>, docKey: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedDocKey(docKey);
  };

  const handleStatusClose = () => {
    setAnchorEl(null);
    setSelectedDocKey(null);
  };

  const handleStatusChange = async (statusId: string) => {
    if (!selectedDocKey) return;
    const statusObj = statusOptions.find(s => s.id === statusId);
    if (statusObj && statusObj.name.toLowerCase().includes('rechazado')) {
      setPendingStatusId(statusId);
      setOpenConfirmDialog(true);
      return;
    }
    setLoading(true);
    try {
      await updateDegreeStatus(docsState.id, `${selectedDocKey}Status`, statusId);
      setDocsState({
        ...docsState,
        [`${selectedDocKey}Status`]: statusObj
      });
      
      // Mostrar alerta de éxito
      if (statusObj && statusObj.name.toLowerCase().includes('aprobado')) {
        setOpenAlert({
          open: true,
          type: "success",
          title: "El documento fue aprobado correctamente"
        });
      } else {
        setOpenAlert({
          open: true,
          type: "success",
          title: "Estado actualizado correctamente"
        });
      }
    } catch (e) {
      setOpenAlert({
        open: true,
        type: "error",
        title: "Error al actualizar el estado"
      });
    }
    setLoading(false);
    handleStatusClose();
  };

  const handleConfirmReject = async () => {
    if (!selectedDocKey || !pendingStatusId) return;
    setLoading(true);
    try {
      const statusObj = statusOptions.find(s => s.id === pendingStatusId);
      await updateDegreeStatus(docsState.id, `${selectedDocKey}Status`, pendingStatusId);
      setDocsState({
        ...docsState,
        [`${selectedDocKey}Status`]: statusObj
      });
      
      // Mostrar alerta de rechazo exitoso
      setOpenAlert({
        open: true,
        type: "success",
        title: "Documento eliminado correctamente, el correo de notificación fue enviado correctamente"
      });
    } catch (e) {
      setOpenAlert({
        open: true,
        type: "error",
        title: "Error al actualizar el estado"
      });
    }
    setLoading(false);
    setOpenConfirmDialog(false);
    setPendingStatusId(null);
    handleStatusClose();
  };

  const handleCancelReject = () => {
    setOpenConfirmDialog(false);
    setPendingStatusId(null);
    handleStatusClose();
  };

  const handleRefresh = async () => {
    try {
      const refreshedDocs = await getDegreeDocumentsByRecordId(docsState.id);
      setDocsState(refreshedDocs);
      if (onClose) {
        onClose();
      }
      if (onDataChanged) {
        onDataChanged();
      }
      setOpenAlert({
        open: true,
        type: "success",
        title: "Documentos actualizados correctamente"
      });
    } catch (e) {
      setOpenAlert({
        open: true,
        type: "error",
        title: "Error al refrescar los documentos"
      });
    }
  };

  return (
    <>
      {docsState ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <TableContainer component={Paper} sx={{ maxWidth: '95%', boxShadow: 3, borderRadius: 2, marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Acciones</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documentTypes.map((doc) => {
                  const value = (docsState as any)[doc.key];
                  const hasDoc = !!value;
                  const status = (docsState as any)[doc.statusKey];
                  return (
                    <TableRow key={doc.key}>
                      <TableCell>{doc.label}</TableCell>
                      <TableCell>{hasDoc ? value : <span style={{ color: '#888' }}>Sin archivo subido</span>}</TableCell>
                      <TableCell>
                        {hasDoc ? (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <Button 
                              variant="contained" 
                              color="primary" 
                              size="small"
                              onClick={() => handlePreviewClick(doc.key, doc.label, value)}
                              style={{ minWidth: 0, padding: 6 }}
                            >
                              <VisibilityIcon />
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              style={{ minWidth: 0, padding: 6 }}
                              onClick={(e) => handleStatusClick(e, doc.key)}
                              disabled={loading}
                            >
                              <SwapHorizIcon />
                            </Button>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {hasDoc ? (
                          status ? (
                            <Chip label={status.name} color={getStatusColor(status.name)} sx={{ borderRadius: 0 }} />
                          ) : (
                            <Chip label="En revisión" color="warning" sx={{ borderRadius: 0 }}/>
                          )
                        ) : (
                          <Chip label="Sin estado" sx={{ borderRadius: 0 }} />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              {/* Fila para la fecha de subida */}
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} style={{ fontWeight: 'bold' }}>Fecha y hora de creación de usuario</TableCell>
                  <TableCell>{docsState.createdAt ? new Date(docsState.createdAt).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} style={{ fontWeight: 'bold' }}>Fecha y hora de subida</TableCell>
                  <TableCell>{docsState.updatedAt ? new Date(docsState.updatedAt).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <div style={{ textAlign: 'center', margin: '2rem' }}>No hay documentos de título para mostrar.</div>
      )}
      <br />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Button variant="contained" color="primary" sx={{ mb: 2, alignSelf: 'flex-end' }} onClick={handleRefresh}>
          Guardar cambios
        </Button>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleStatusClose}
      >
        {statusOptions.filter(option => !option.name.toLowerCase().includes('revisión') && !option.name.toLowerCase().includes('revision')).map((option) => (
          <MenuItem
            key={option.id}
            onClick={() => handleStatusChange(option.id)}
            disabled={loading}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>

      <ConfirmDialog
        open={openConfirmDialog}
        title="Confirmar rechazo"
        message="¿Estás seguro de que deseas rechazar este documento? Esta acción eliminará el archivo asociado."
        onCancel={handleCancelReject}
        onConfirm={handleConfirmReject}
        loading={loading}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />

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

export default DegreeDocumentsTable;