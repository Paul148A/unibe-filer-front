import { useEffect, useState } from "react";
import { IUser } from "../../../../interfaces/IUser";
import { getAllUsers } from "../../../../services/core/students.service";
import { useAuth } from "../../../../components/Context/context";
import CustomTable from "../../../../components/CustomTable/custom-table";

const StudentsList = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const { setOpenAlert, setLoading } = useAuth();
  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then((response) => {
        setUsers(response);
        setLoading(false);
      })
      .catch((error) => {
        setOpenAlert({
          open: true,
          type: "error",
          title: "Error al cargar los estudiantes" + error,
        });
        setLoading(false);
      });
  }, []);
  return (
    <>
      <CustomTable<IUser>
        data={users}
        columns={[
          { key: 'names', label: 'Nombres' },
          { key: 'last_names', label: 'Apellidos' },
          { key: 'email', label: 'Correo electrónico' },
          
        ]}
        actionKeys={['Editar', 'Eliminar']}
      />
    </>
  )
}

export default StudentsList