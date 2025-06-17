import { useEffect, useState } from "react";
import { IRecord } from "../../../../interfaces/IRecord";
import { IInscriptionDocument } from "../../../../interfaces/IInscriptionDocument";
import { IUser } from "../../../../interfaces/IUser";
import { useAuth } from "../../../../components/Context/context";
import CustomTable from "../../../../components/CustomTable/custom-table";
import { getAllRecords } from "../../../../services/upload-files/record.service";
import { getInscriptionDocumentsByRecordId, updateInscriptionDocumentStatus } from "../../../../services/upload-files/inscription-documents.service";
import Loader from "../../../../components/Loader/loader";
import { Typography, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface RecordWithInscription extends IRecord {
  inscriptionDocuments?: IInscriptionDocument[];
}

const CertificatesList = () => {
  const [records, setRecords] = useState<RecordWithInscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<RecordWithInscription | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { setOpenAlert } = useAuth();

  const fetchRecordsWithInscription = async () => {
    try {
      const records = await getAllRecords();
      const recordsWithInscription = await Promise.all(
        records.map(async (record) => {
          const inscriptionDocs = await getInscriptionDocumentsByRecordId(record.id);
          return {
            ...record,
            inscriptionDocuments: inscriptionDocs
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

  const handleStatusChange = async (newStatus: 'approved' | 'rejected' | 'pending') => {
    if (!selectedRecord?.inscriptionDocuments?.[0]) return;

    try {
      await updateInscriptionDocumentStatus(
        selectedRecord.inscriptionDocuments[0].id,
        newStatus
      );
      
      // Actualizar el estado en el registro local
      setRecords(prevRecords => 
        prevRecords.map(record => {
          if (record.id === selectedRecord.id && record.inscriptionDocuments?.[0]) {
            return {
              ...record,
              inscriptionDocuments: [{
                ...record.inscriptionDocuments[0],
                englishCertificateStatus: newStatus
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobado';
      case 'rejected':
        return 'Rechazado';
      default:
        return 'Pendiente';
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Typography variant="h4" component="h2" gutterBottom>
        Lista de Estudiantes con Certificado de Inglés
      </Typography>
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
              if (!Array.isArray(value) || !value[0] || 'englishCertificateStatus' in value[0] === false) {
                return <Typography color="text.secondary">Sin estado</Typography>;
              }
              const status = value[0].englishCertificateStatus;
              return (
                <Typography
                  onClick={() => {
                    const record = records.find(r => 
                      r.inscriptionDocuments?.[0]?.id === (value[0] as IInscriptionDocument).id
                    );
                    setSelectedRecord(record || null);
                    setOpenDialog(true);
                  }}
                  sx={{
                    color: `${getStatusColor(status)}.main`,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                      opacity: 0.8
                    },
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: `${getStatusColor(status)}.lighter`,
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {getStatusText(status)}
                </Typography>
              );
            }
          }
        ]}
        actionKeys={["RevisarCertificadoIngles"]}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cambiar Estado del Certificado</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={selectedRecord?.inscriptionDocuments?.[0]?.englishCertificateStatus || 'pending'}
              label="Estado"
              onChange={(e) => handleStatusChange(e.target.value as 'approved' | 'rejected' | 'pending')}
            >
              <MenuItem value="approved">Aprobado</MenuItem>
              <MenuItem value="rejected">Rechazado</MenuItem>
              <MenuItem value="pending">Pendiente</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CertificatesList;