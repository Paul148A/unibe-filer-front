import { Grid2 } from '@mui/material';
import Section from '../../../../components/Section/section';

const AdminDashboard = () => {
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
            link="/students-list"
            title="Consulta de estudiantes"
            description="Consulta los estudiantes de la UNIBE y registra a los de nuevo ingreso."
          />
        </Grid2>
        <Grid2 size={4}>
          <Section
            img="/personalimg.png"
            link="/records-list"
            title="Expedientes"
            description="Consulta los expedientes electronicos estudiantiles y gestiona sus documentos."
          />
        </Grid2>
        <Grid2 size={4}>
          <Section
            img="/personalimg.png"
            link="/students-form"
            title="Registro de estudiantes"
            description="Consulta los expedientes electronicos estudiantiles y gestiona sus documentos."
          />
        </Grid2>
      </Grid2>
    </>
  )
}

export default AdminDashboard;
