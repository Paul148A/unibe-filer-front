import { useEffect, useState } from "react";
import { Grid2 } from "@mui/material";
import Section from "../../../../components/Section/section";
import { useAuth } from "../../../../components/Context/context";
import { getRecordByUserId } from "../../../../services/upload-files/record.service";
import { IRecord } from "../../../../interfaces/IRecord";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [record, setRecord] = useState<IRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const records = await getRecordByUserId(user.id);
        setRecord(records[0] || null);
      } catch (error) {
        setRecord(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [user]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Grid2 container sx={{ marginBottom: 1 }}>
        <Grid2 size={12}>
          <img src="/dashimg.jpg" alt="" width="100%" height={240} />
        </Grid2>
      </Grid2>
      <Grid2 container sx={{
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Grid2 size={4}>
          {record?.id ? (
            <Section
              img="/inscriptionimg.png"
              link={`/list-inscription-documents/${record.id}`}
              title="Documentos de Inscripción"
              description="Consulta o ingresa tus documentos de inscripción."
            />
          ) : (
            <Section
              img="/inscriptionimg.png"
              link="#"
              title="Documentos de Inscripción"
              description="No tienes expediente disponible."
            />
          )}
        </Grid2>
        <Grid2 size={4}>
          {record?.id ? (
            <Section
              img="/personalimg.png"
              link={`/list-personal-documents/${record.id}`}
              title="Documentos Personales"
              description="Consulta o ingresa tus documentos personales"
            />
          ) : (
            <Section
              img="/personalimg.png"
              link="#"
              title="Documentos Personales"
              description="No tienes expediente disponible."
            />
          )}
        </Grid2>
        <Grid2 size={4}>
          {record?.id ? (
            <Section
              img="/degreeimg.png"
              link={`/list-degree-documents/${record.id}`}
              title="Documentos de Grado"
              description="Consulta o ingresa tus documentos de titulación"
            />
          ) : (
            <Section
              img="/degreeimg.png"
              link="#"
              title="Documentos de Grado"
              description="No tienes expediente disponible."
            />
          )}
        </Grid2>
      </Grid2>
    </>
  )
}

export default StudentDashboard;