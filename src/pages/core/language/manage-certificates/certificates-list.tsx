import { useEffect, useState } from "react";
import { IRecord } from "../../../../interfaces/IRecord";
import { IInscriptionDocument } from "../../../../interfaces/IInscriptionDocument";
import { IUser } from "../../../../interfaces/IUser";
import { useAuth } from "../../../../components/Context/context";
import CustomTable from "../../../../components/CustomTable/custom-table";
import { getAllRecords } from "../../../../services/upload-files/record.service";
import { getInscriptionDocumentsByRecordId, updateInscriptionDocumentStatus, getDocumentStatuses } from "../../../../services/upload-files/inscription-documents.service";
import Loader from "../../../../components/Loader/loader";
import { Typography, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ConfirmDialog from '../../../../components/Global/ConfirmDialog';

interface RecordWithInscription extends IRecord {
  inscriptionDocuments?: IInscriptionDocument[];
}

const CertificatesList = () => {
  const [records, setRecords] = useState<RecordWithInscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<RecordWithInscription | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { setOpenAlert } = useAuth();
  const [statusOptions, setStatusOptions] = useState<{ id: string, name: string }[]>([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pendingStatusId, setPendingStatusId] = useState<string | null>(null);

  const fetchRecordsWithInscription = async () => {
    try {
      const records = await getAllRecords();
      const recordsWithInscription = await Promise.all(
        records.map(async (record) => {
          const inscriptionDoc = await getInscriptionDocumentsByRecordId(record.id);
          return {
            ...record,
            inscriptionDocuments: inscriptionDoc ? [inscriptionDoc] : []
          };
        })
      );
      setRecords(recordsWithInscription);
    } catch (error) {
      setOpenAlert({
        open: true,
        type: "error",
        title: "Error al cargar los expedientes: " + error,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordsWithInscription();
  }, []);

  useEffect(() => {
    getDocumentStatuses().then(setStatusOptions);
  }, []);

  const handleStatusChange = async (statusId: string) => {
    if (!selectedRecord?.inscriptionDocuments?.[0]) return;
    try {
      const statusObj = statusOptions.find(s => s.id === statusId);
      const statusName = statusObj?.name?.toLowerCase();
      let mappedStatus: 'approved' | 'rejected' | 'pending' = 'pending';
      if (statusName?.includes('aprobado')) mappedStatus = 'approved';
      else if (statusName?.includes('rechazado')) mappedStatus = 'rejected';
      else if (statusName?.includes('revision') || statusName?.includes('revisión')) mappedStatus = 'pending';
      else mappedStatus = 'pending';
      if (mappedStatus === 'rejected') {
        setPendingStatusId(statusId);
        setOpenConfirmDialog(true);
        return;
      }
      await updateInscriptionDocumentStatus(selectedRecord.inscriptionDocuments[0].id, 'englishCertificateDocStatus', statusId);
      setRecords(prevRecords =>
        prevRecords.map(record => {
          if (record.id === selectedRecord.id && record.inscriptionDocuments?.[0]) {
            return {
              ...record,
              inscriptionDocuments: [{
                ...record.inscriptionDocuments[0],
                englishCertificateDocStatus: statusObj
              }]
            };
          }
          return record;
        })
      );
      setOpenDialog(false);
      setOpenAlert({
        open: true,
        type: "success",
        title: "Estado actualizado correctamente"
      });
    } catch (error) {
      setOpenAlert({
        open: true,
        type: "error",
        title: "Error al actualizar el estado: " + error
      });
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedRecord?.inscriptionDocuments?.[0] || !pendingStatusId) return;
    try {
      const statusObj = statusOptions.find(s => s.id === pendingStatusId);
      await updateInscriptionDocumentStatus(selectedRecord.inscriptionDocuments[0].id, 'englishCertificateDocStatus', pendingStatusId);
      setRecords(prevRecords =>
        prevRecords.map(record => {
          if (record.id === selectedRecord.id && record.inscriptionDocuments?.[0]) {
            return {
              ...record,
              inscriptionDocuments: [{
                ...record.inscriptionDocuments[0],
                englishCertificateDocStatus: statusObj
              }]
            };
          }
          return record;
        })
      );
      setOpenDialog(false);
      setOpenAlert({
        open: true,
        type: "success",
        title: "Estado actualizado correctamente"
      });
    } catch (error) {
      setOpenAlert({
        open: true,
        type: "error",
        title: "Error al actualizar el estado: " + error
      });
    }
    setOpenConfirmDialog(false);
    setPendingStatusId(null);
  };

  const handleCancelReject = () => {
    setOpenConfirmDialog(false);
    setPendingStatusId(null);
  };

  const getStatusColor = (name?: string) => {
    if (!name) return 'warning';
    if (name.toLowerCase().includes('aprobado')) return 'success';
    if (name.toLowerCase().includes('rechazado')) return 'error';
    if (name.toLowerCase().includes('revision') || name.toLowerCase().includes('revisión')) return 'warning';
    return 'warning';
  };

  const getStatusText = (name?: string) => {
    if (!name) return 'En revisión';
    return name;
  };

  if (loading) return <Loader />;

  return (
    <>
      <Typography variant="h4" component="h2" gutterBottom>
        Lista de Estudiantes con Certificado de Inglés
      </Typography>
      <Box sx={{ mt: 2, height: "calc(100vh - 200px)", overflowY: "auto" }}>
        <CustomTable<RecordWithInscription>
          data={records}
          columns={[
            { key: "code", label: "Código" },
            {
              key: "user",
              label: "Usuario",
              render: (value) => {
                if (typeof value === "object" && value !== null && "names" in value && "last_names" in value) {
                  return `${value.names} ${value.last_names}`;
                }
                return "";
              }
            },
            {
              key: "user",
              label: "Identificación",
              render: (value) => (typeof value === "object" && value !== null && "identification" in value ? value.identification : "")
            },
            {
              key: "user",
              label: "Email",
              render: (value) => (typeof value === "object" && value !== null && "email" in value ? value.email : "")
            },
            {
              key: "inscriptionDocuments",
              label: "Estado del Certificado",
              render: (value: string | IInscriptionDocument[] | IUser | undefined) => {
                if (!Array.isArray(value) || !value[0]) {
                  return <Typography color="text.secondary">Sin estado</Typography>;
                }
                const doc = value[0] as IInscriptionDocument;
                const statusObj = doc.englishCertificateDocStatus;
                if (!doc.englishCertificateDoc) {
                  return <Typography color="text.secondary">Sin archivo subido</Typography>;
                }
                return (
                  <Typography
                    onClick={() => {
                      const record = records.find(r =>
                        r.inscriptionDocuments?.[0]?.id === doc.id
                      );
                      setSelectedRecord(record || null);
                      setOpenDialog(true);
                    }}
                    sx={{
                      color: `${getStatusColor(statusObj?.name || '')}.main`,
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                        opacity: 0.8
                      },
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: `${getStatusColor(statusObj?.name || '')}.lighter`,
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    {getStatusText(statusObj?.name || (doc.englishCertificateDoc ? 'En revisión' : ''))}
                  </Typography>
                );
              }
            },
          ]}
          actionKeys={["RevisarCertificadoIngles"]}
          renderActions={(row) => {
            const hasEnglishCertificate = row.inscriptionDocuments?.[0]?.englishCertificateDoc;
            if (!hasEnglishCertificate) {
              return null;
            }
            
            return (
              <Button 
                size="small" 
                sx={{ backgroundColor: 'green' }} 
                component={Link} 
                to={`/certificates-language-page/${row.user.id}`}
              >
                <VisibilityIcon sx={{ color: 'white' }} />
              </Button>
            );
          }}
        />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cambiar Estado del Certificado</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={selectedRecord?.inscriptionDocuments?.[0]?.englishCertificateDocStatus?.id ? selectedRecord.inscriptionDocuments[0].englishCertificateDocStatus.id : ''}
              label="Estado"
              onChange={(e) => handleStatusChange(e.target.value as string)}
            >
              {statusOptions && statusOptions.filter(option => !option.name.toLowerCase().includes('revisión') && !option.name.toLowerCase().includes('revision')).map(option => (
                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={openConfirmDialog}
        title="Confirmar rechazo"
        message="¿Estás seguro de que deseas rechazar este documento? Esta acción eliminará el archivo asociado de inmediato y notificara al estudiante para corregir el documento."
        onCancel={handleCancelReject}
        onConfirm={handleConfirmReject}
      />
    </>
  );
};

export default CertificatesList;