import { Grid2 } from "@mui/material";
import Section from "../../../../components/Section/section";

const LanguageDashboard: React.FC = () => {
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
            link="/certificates-language-list"
            title="Consulta de certificados de los estudiantes"
            description="Consulta certificado de ingles de los estudiantes de la UNIBE."
          />
        </Grid2>
      </Grid2>
    </>
  )
};

export default LanguageDashboard;