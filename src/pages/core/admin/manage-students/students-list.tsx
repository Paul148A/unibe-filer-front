import { useEffect, useState } from "react";
import { IUser } from "../../../../interfaces/IUser";
import { getAllUsers } from "../../../../services/core/students.service";
import { useAuth } from "../../../../components/Context/context";
import CustomTable from "../../../../components/CustomTable/custom-table";
import Loader from "../../../../components/Loader/loader";
import { Typography } from "@mui/material";
import StudentsUpdate from './students-update';

const StudentsList = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { setOpenAlert } = useAuth();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        console.log(users);
        setUsers(users);
      } catch (error) {
        setOpenAlert({
          open: true,
          type: "error",
          title: "Error al cargar los usuarios" + error,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <Loader />;

  const handleAction = (action: string, user: IUser) => {
    if (action === 'EditarUsuario') {
      setSelectedUser(user);
      setShowUpdateModal(true);
    }
    // Puedes agregar aquí otras acciones como EliminarUsuario, VisualizarPdf, etc.
  };

  return (
    <>
      <Typography sx={{ mb: 2 , ml: 5, mt: 2 }} variant="h4" component="h2" gutterBottom>
        Lista de Usuarios
      </Typography>
      <CustomTable<IUser>
        data={users}
        columns={[
          { key: "names", label: "Nombres" },
          { key: "last_names", label: "Apellidos" },
          { key: "email", label: "Correo electrónico" },
          {
            key: "role",
            label: "Rol",
            render: (value) =>
              value && typeof value === "object" ? value.description : "-",
          },
          {
            key: "status",
            label: "Estado",
            render: (value) =>
              value && typeof value === "object" ? value.description : "-",
          },
        ]}
        actionKeys={["EditarUsuario", "EliminarUsuario", "VisualizarPdf"]}
        onEditClick={(user) => {
          setSelectedUser(user);
          setShowUpdateModal(true);
        }}
      />
      {showUpdateModal && selectedUser && (
        <StudentsUpdate
          open={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          user={selectedUser}
          onUpdate={() => {
            setShowUpdateModal(false);
            setLoading(true);
            getAllUsers().then(setUsers).finally(() => setLoading(false));
          }}
        />
      )}
    </>
  );
};

export default StudentsList;
