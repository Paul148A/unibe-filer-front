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

const columns: Column<IPermissionDocument & { student: string; recordCode: string }>[]= [
  { key: 'student', label: 'Estudiante' },
  { key: 'recordCode', label: 'Record' },
  { key: 'supportingDoc', label: 'Nombre del Archivo', render: (value, row) => value ? value : 'Sin archivo' },
  { key: 'createdAt', label: 'Fecha y hora de creación de usuario', render: (value) => value ? new Date(value).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' }) : '-' },
  { key: 'updatedAt', label: 'Fecha y hora de subida', render: (value) => value ? new Date(value).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' }) : '-' },
];

const actionKeys: ActionKey[] = [
  'DescargarDocumentoPermiso',
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
    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      try {
        await PermissionDocumentsService.deletePermissionDocument(id);
        setOpenAlert({ open: true, type: "success", title: "Documento eliminado correctamente" });
        loadPermissions();
      } catch (error: any) {
        setOpenAlert({ 
          open: true, 
          type: "error", 
          title: error.response?.data?.message || "Error al eliminar documento" 
        });
      }
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const blob = await PermissionDocumentsService.downloadDocument(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `respaldo.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      setOpenAlert({ 
        open: true, 
        type: "error", 
        title: error.response?.data?.message || "Error al descargar documento" 
      });
    }
  };

  const handleEdit = (row: IPermissionDocument & { student: string; recordCode: string }) => {
    navigate(`/teacher/manage-permissions/update-permission-documents/${row.id}`);
  };

  const handleDeleteRow = (row: IPermissionDocument & { student: string; recordCode: string }) => {
    handleDelete(row.id);
  };

  const handleDownloadRow = (row: IPermissionDocument & { student: string; recordCode: string }) => {
    handleDownload(row.id);
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
        onDownloadClick={handleDownloadRow}
      />
    </Box>
  );
};

export default ListPermissionDocuments; 