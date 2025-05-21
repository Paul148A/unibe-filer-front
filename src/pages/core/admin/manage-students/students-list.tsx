import { useEffect, useState } from "react";
import { IUser } from "../../../../interfaces/IUser";
import { getAllUsers } from "../../../../services/core/students.service";
import { useAuth } from "../../../../components/Context/context";
import CustomTable from "../../../../components/CustomTable/custom-table";
import Loader from "../../../../components/Loader/loader";

const StudentsList = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { setOpenAlert } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        console.log(users);
        setUsers(users);
      } catch (error) {
        setOpenAlert({
          open: true,
          type: 'error',
          title: 'Error al cargar los usuarios' + error,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <CustomTable<IUser>
        data={users}
        columns={[
          { key: 'names', label: 'Nombres' },
          { key: 'last_names', label: 'Apellidos' },
          { key: 'email', label: 'Correo electrónico' },
          {
            key: 'role',
            label: 'Rol',
            render: (value) => (value && typeof value === 'object' ? value.name : '-'),
          },
          {
            key: 'status',
            label: 'Estado',
            render: (value) => (value && typeof value === 'object' ? value.name : '-'),
          },
        ]}
        actionKeys={['EditarUsuario', 'EliminarUsuario', 'VerUsuario']}
      />
    </>
  );
};


export default StudentsList