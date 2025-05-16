import { Grid2 } from "@mui/material";
import Section from "../../../../components/Section/section";

const StudentDashboard = () => {
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
          <Section
            img="/inscriptionimg.png"
            link="/upload-inscription-documents"
            title="Documentos de Inscripción"
            description="Consulta o ingresa tus documentos de inscripción."
          />
        </Grid2>
        <Grid2 size={4}>
          <Section
            img="/personalimg.png"
            link="/upload-personal-documents"
            title="Documentos Personales"
            description="Consulta o ingresa tus documentos personales"
          />
        </Grid2>
        <Grid2 size={4}>
          <Section
            img="/degreeimg.png"
            link="/upload-degree-documents"
            title="Documentos de Grado"
            description="Consulta o ingresa tus documentos de titulación"
          />
        </Grid2>
      </Grid2>
    </>
  )
}

export default StudentDashboard;