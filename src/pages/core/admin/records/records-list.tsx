import { useEffect, useState } from "react";
import { IRecord } from "../../../../interfaces/IRecord";
import { useAuth } from "../../../../components/Context/context";
import CustomTable from "../../../../components/CustomTable/custom-table";
import { getAllRecords } from "../../../../services/upload-files/record.service";
import Loader from "../../../../components/Loader/loader";
import { Typography } from "@mui/material";

const RecordsList = () => {
  const [records, setRecords] = useState<IRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { setOpenAlert } = useAuth();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const records = await getAllRecords();
        setRecords(records);
      } catch (error) {
        setOpenAlert({
          open: true,
          type: "error",
          title: "Error al cargar los expedientes" + error,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Typography variant="h4" component="h2" gutterBottom>
        Lista de Expedientes
      </Typography>
      <CustomTable<IRecord>
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
        ]}
        actionKeys={["DescargarExpediente", "RevisarExpediente"]}
      />
    </>
  );
};

export default RecordsList;