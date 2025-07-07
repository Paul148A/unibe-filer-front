import { useEffect, useMemo, useState } from "react";
import { IRecord } from "../../../../interfaces/IRecord";
import { useAuth } from "../../../../components/Context/context";
import CustomTable from "../../../../components/CustomTable/custom-table";
import { getAllRecords } from "../../../../services/upload-files/record.service";
import Loader from "../../../../components/Loader/loader";
import { Typography, TextField, Box } from "@mui/material";

const RecordsList = () => {
  const [records, setRecords] = useState<IRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
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

  const filteredRecords = useMemo(() => {
    if (!searchText) return records;

    return records.filter((record) => {
      const fullName = `${record.user?.names ?? ""} ${record.user?.last_names ?? ""}`.toLowerCase();
      const identification = record.user?.identification?.toLowerCase() ?? "";
      const email = record.user?.email?.toLowerCase() ?? "";
      const code = record.code?.toLowerCase() ?? "";

      return (
        fullName.includes(searchText.toLowerCase()) ||
        identification.includes(searchText.toLowerCase()) ||
        email.includes(searchText.toLowerCase()) ||
        code.includes(searchText.toLowerCase())
      );
    });
  }, [records, searchText]);

  if (loading) return <Loader />;

  return (
    <>
      <Typography sx={{ mb: 2 , ml: 5, mt: 2 }} variant="h4" component="h2" gutterBottom>
        Lista de Expedientes
      </Typography>
      <Box sx={{ ml: 5 }}>
        <TextField
          sx={{ width: 350 }}
          variant="outlined"
          label="Buscar por nombre, identificación, correo o código"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Box>

      {filteredRecords.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No se encontraron resultados para "{searchText}".
        </Typography>
      ) : (
        <CustomTable<IRecord>
          data={filteredRecords}
          columns={[
            { key: "code", label: "Código" },
            {
              key: "user",
              label: "Usuario",
              render: (value) => {
                if (
                  typeof value === "object" &&
                  value !== null &&
                  "names" in value &&
                  "last_names" in value
                ) {
                  return `${value.names} ${value.last_names}`;
                }
                return "";
              },
            },
            {
              key: "user",
              label: "Identificación",
              render: (value) =>
                typeof value === "object" && value !== null && "identification" in value
                  ? value.identification
                  : "",
            },
            {
              key: "user",
              label: "Email",
              render: (value) =>
                typeof value === "object" && value !== null && "email" in value
                  ? value.email
                  : "",
            },
          ]}
          actionKeys={["DescargarExpediente", "RevisarExpediente"]}
        />
      )}
    </>
  );
};

export default RecordsList;
