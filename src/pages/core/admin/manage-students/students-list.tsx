import { useEffect, useMemo, useState } from "react";
import { IUser } from "../../../../interfaces/IUser";
import { getAllUsers, getUsersByRole } from "../../../../services/core/students.service";
import { useAuth } from "../../../../components/Context/context";
import CustomTable from "../../../../components/CustomTable/custom-table";
import Loader from "../../../../components/Loader/loader";
import { Box, TextField, Typography } from "@mui/material";
import StudentsUpdate from './students-update';
import { getStudentRole } from "../../../../services/auth/role.service";

const StudentsList = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { setOpenAlert } = useAuth();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const studentRole = await getStudentRole();
        if (!studentRole || !studentRole.id) {
          setOpenAlert({
            open: true,
            type: "error",
            title: "No se pudo obtener el rol de estudiante",
          });
          throw new Error("No se pudo obtener el rol de estudiante");
        }
        const users = await getUsersByRole(studentRole.name);
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

  const filteredStudents = useMemo(() => {
    if (!searchText) return users;

    return users.filter((user) => {
      const fullName = `${user.names ?? ""} ${user.last_names ?? ""}`.toLowerCase();
      const identification = user.identification?.toLowerCase() ?? "";
      const email = user.email?.toLowerCase() ?? "";
      const role = user.role?.description?.toLowerCase() ?? "";
      const status = user.status?.description?.toLowerCase() ?? "";
      return (
        fullName.includes(searchText.toLowerCase()) ||
        identification.includes(searchText.toLowerCase()) ||
        email.includes(searchText.toLowerCase()) ||
        role.includes(searchText.toLowerCase()) ||
        status.includes(searchText.toLowerCase())
      );
    });
  }, [users, searchText]);

  if (loading) return <Loader />;

  return (
    <>
      <Typography sx={{ mb: 2, ml: 5, mt: 2 }} variant="h4" component="h2" gutterBottom>
        Lista de Estudiantes
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

      {filteredStudents.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No se encontraron resultados para "{searchText}".
        </Typography>
      ) : (
        <Box sx={{ mt: 2, height: "calc(100vh - 200px)", overflowY: "auto" }}>
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
        </Box>
      )}
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
