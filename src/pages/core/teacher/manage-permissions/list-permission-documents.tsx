import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../components/Context/context';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PermissionDocumentsService } from '../../../../services/upload-files/permission-documents.service';
import { IPermissionDocument } from '../../../../interfaces/IPermissionDocument';
import { RecordsService, IRecord } from '../../../../services/core/records.service';
import CustomTable from '../../../../components/CustomTable/custom-table';
import { Column, ActionKey } from '../../../../components/CustomTable/hooks/use-custom-table';
import ConfirmDialog from '../../../../components/Global/ConfirmDialog';
import FilePreviewModal from '../../../../components/Modals/FilePreviewModal/file-preview-modal';

const columns: Column<IPermissionDocument & { student: string; recordCode: string }>[]= [
  { key: 'student', label: 'Estudiante' },
  { key: 'recordCode', label: 'Record' },
  { key: 'supportingDoc', label: 'Nombre del Archivo', render: (value, row) => value ? value : 'Sin archivo' },
  { key: 'createdAt', label: 'Fecha y hora de creación de usuario', render: (value) => value ? new Date(value).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' }) : '-' },
  { key: 'updatedAt', label: 'Fecha y hora de subida', render: (value) => value ? new Date(value).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' }) : '-' },
];

const actionKeys: ActionKey[] = [
  'VisualizarPdf',
  'EditarDocumentoPermiso',
  'EliminarDocumentoPermiso',
];

const ListPermissionDocuments: React.FC = () => {
  const [permissions, setPermissions] = useState<IPermissionDocument[]>([]);
  const [records, setRecords] = useState<{ [key: string]: IRecord }>({});
  const [loading, setLoading] = useState(true);
  const { setOpenAlert } = useAuth();
  const navigate = useNavigate();
  const [tableData, setTableData] = useState<(IPermissionDocument & { student: string; recordCode: string })[]>([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const response = await PermissionDocumentsService.listPermissionDocuments();
      setPermissions(response.data);
      await loadRecordsInfo(response.data);
    } catch (error: any) {
      setOpenAlert({ 
        open: true, 
        type: "error", 
        title: error.response?.data?.message || "Error al cargar documentos" 
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRecordsInfo = async (permissionsData: IPermissionDocument[]) => {
    try {
      const uniqueRecordIds = [...new Set(permissionsData.map(p => p.record_id))];
      const recordsMap: { [key: string]: IRecord } = {};
      for (const recordId of uniqueRecordIds) {
        try {
          const response = await RecordsService.getAllRecords();
          const record = response.data.find(r => r.id === recordId);
          if (record) {
            recordsMap[recordId] = record;
          }
        } catch (error) {
          console.error(`Error loading record ${recordId}:`, error);
        }
      }
      setRecords(recordsMap);
      setTableData(
        permissionsData.map((permission) => ({
          ...permission,
          student: recordsMap[permission.record_id]
            ? `${recordsMap[permission.record_id].user.names} ${recordsMap[permission.record_id].user.last_names} (CI: ${recordsMap[permission.record_id].user.identification})`
            : 'Cargando...',
          recordCode: recordsMap[permission.record_id]?.code || 'N/A',
        }))
      );
    } catch (error) {
      console.error('Error loading records info:', error);
    }
  };

  const handleDelete = async (id: string) => {
    setPendingDeleteId(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
      try {
      await PermissionDocumentsService.deletePermissionDocument(pendingDeleteId);
        setOpenAlert({ open: true, type: "success", title: "Documento eliminado correctamente" });
        loadPermissions();
      } catch (error: any) {
        setOpenAlert({ 
          open: true, 
          type: "error", 
          title: error.response?.data?.message || "Error al eliminar documento" 
        });
      }
    setOpenConfirmDialog(false);
    setPendingDeleteId(null);
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
    setPendingDeleteId(null);
  };

  const handlePreview = async (id: string) => {
    try {
      const blob = await PermissionDocumentsService.downloadDocument(id);
      const url = window.URL.createObjectURL(blob);
      setPreviewFile({
        url: url,
        name: 'Documento de Permiso'
      });
      setShowPreviewModal(true);
    } catch (error: any) {
      setOpenAlert({ 
        open: true, 
        type: "error", 
        title: error.response?.data?.message || "Error al previsualizar documento" 
      });
    }
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    // La limpieza del blob se maneja en el FilePreviewModal
  };

  const handleEdit = (row: IPermissionDocument & { student: string; recordCode: string }) => {
    navigate(`/teacher/manage-permissions/update-permission-documents/${row.id}`);
  };

  const handleDeleteRow = (row: IPermissionDocument & { student: string; recordCode: string }) => {
    handleDelete(row.id);
  };

  const handlePreviewRow = (row: IPermissionDocument & { student: string; recordCode: string }) => {
    handlePreview(row.id);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Cargando documentos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2">
          Lista de Documentos de Permisos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/teacher/manage-permissions/upload-permission-documents')}
        >
          Subir Nuevo Documento
        </Button>
      </Box>
      <CustomTable
        data={tableData}
        columns={columns}
        actionKeys={actionKeys}
        onEditClick={handleEdit}
        onDeleteClick={handleDeleteRow}
        onPreviewClick={handlePreviewRow}
      />

      <ConfirmDialog
        open={openConfirmDialog}
        title="Confirmar eliminar documento"
        message="¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer."
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />

      {showPreviewModal && previewFile && (
        <FilePreviewModal
          open={showPreviewModal}
          onClose={handleClosePreviewModal}
          fileName={previewFile.name}
          fileUrl={previewFile.url}
          documentType={undefined}
        />
      )}
    </Box>
  );
};

export default ListPermissionDocuments; 