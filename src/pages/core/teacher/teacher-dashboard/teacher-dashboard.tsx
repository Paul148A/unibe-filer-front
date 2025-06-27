import { Grid2 } from "@mui/material";
import Section from "../../../../components/Section/section";

const TeacherDashboard: React.FC = () => {
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
        gap: 2
      }}>
        <Grid2 size={4}>
          <Section
            img="/inscriptionimg.png"
            link="/teacher/manage-permissions/upload-permission-documents"
            title="Subir Documentos de Permisos"
            description="Subir documentos de permisos para estudiantes."
          />
        </Grid2>
        <Grid2 size={4}>
          <Section
            img="/gestion.png"
            link="/teacher/manage-permissions/list-permission-documents"
            title="Gestionar Documentos de Permisos"
            description="Ver y gestionar todos los permisos de estudiantes."
          />
        </Grid2>
      </Grid2>
    </>
  )
};

export default TeacherDashboard;