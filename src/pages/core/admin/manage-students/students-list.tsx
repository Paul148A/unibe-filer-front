import { useEffect, useMemo, useState } from "react";
import { IUser } from "../../../../interfaces/IUser";
import { IStatus } from "../../../../interfaces/IStatus";
import { getAllUsers, getUsersByRole, updateUserStatus } from "../../../../services/core/students.service";
import { getAllStatuses } from "../../../../services/auth/status.service";
import { useAuth } from "../../../../components/Context/context";
import CustomTable from "../../../../components/CustomTable/custom-table";
import Loader from "../../../../components/Loader/loader";
import { Box, TextField, Typography, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import ConfirmDialog from '../../../../components/Global/ConfirmDialog';
import StudentsUpdate from './students-update';
import { getStudentRole } from "../../../../services/auth/role.service";

const StudentsList = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { setOpenAlert } = useAuth();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [statusOptions, setStatusOptions] = useState<IStatus[]>([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pendingStatusId, setPendingStatusId] = useState<string | null>(null);

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

  useEffect(() => {
    getAllStatuses().then(setStatusOptions);
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

  const handleStatusChange = async (statusId: string) => {
    if (!selectedUser) return;
    try {
      const statusObj = statusOptions.find(s => s.id === statusId);
      const statusName = statusObj?.name?.toLowerCase();
      let mappedStatus: 'approved' | 'rejected' | 'pending' = 'pending';
      if (statusName?.includes('activo') || statusName?.includes('aprobado')) mappedStatus = 'approved';
      else if (statusName?.includes('inactivo') || statusName?.includes('rechazado') || statusName?.includes('suspendido')) mappedStatus = 'rejected';
      else mappedStatus = 'pending';
      
      if (mappedStatus === 'rejected') {
        setPendingStatusId(statusId);
        setOpenConfirmDialog(true);
        return;
      }
      
      await updateUserStatus(selectedUser.id, statusId);
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.id === selectedUser.id && statusObj) {
            return {
              ...user,
              status: statusObj
            };
          }
          return user;
        })
      );
      setOpenDialog(false);
      setOpenAlert({
        open: true,
        type: "success",
        title: "Estado actualizado correctamente"
      });
    } catch (error) {
      setOpenAlert({
        open: true,
        type: "error",
        title: "Error al actualizar el estado: " + error
      });
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedUser || !pendingStatusId) return;
    try {
      const statusObj = statusOptions.find(s => s.id === pendingStatusId);
      await updateUserStatus(selectedUser.id, pendingStatusId);
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.id === selectedUser.id && statusObj) {
            return {
              ...user,
              status: statusObj
            };
          }
          return user;
        })
      );
      setOpenDialog(false);
      setOpenAlert({
        open: true,
        type: "success",
        title: "Estado actualizado correctamente"
      });
    } catch (error) {
      setOpenAlert({
        open: true,
        type: "error",
        title: "Error al actualizar el estado: " + error
      });
    }
    setOpenConfirmDialog(false);
    setPendingStatusId(null);
  };

  const handleCancelReject = () => {
    setOpenConfirmDialog(false);
    setPendingStatusId(null);
  };

  const getStatusColor = (name?: string) => {
    if (!name) return 'warning';
    if (name.toLowerCase().includes('activo') || name.toLowerCase().includes('aprobado')) return 'success';
    if (name.toLowerCase().includes('inactivo') || name.toLowerCase().includes('rechazado') || name.toLowerCase().includes('suspendido')) return 'error';
    return 'warning';
  };

  const getStatusText = (name?: string) => {
    if (!name) return 'Sin estado';
    return name;
  };

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
            data={filteredStudents}
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
                render: (value) => {
                  if (!value || typeof value !== "object") {
                    return <Typography color="text.secondary">Sin estado</Typography>;
                  }
                  const statusObj = value as IStatus;
                  return (
                    <Typography
                      onClick={() => {
                        const user = users.find(u => u.id === (value as any).id || u.status?.id === statusObj.id);
                        setSelectedUser(user || null);
                        setOpenDialog(true);
                      }}
                      sx={{
                        color: `${getStatusColor(statusObj?.name || '')}.main`,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline',
                          opacity: 0.8
                        },
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: `${getStatusColor(statusObj?.name || '')}.lighter`,
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      {getStatusText(statusObj?.name || '')}
                    </Typography>
                  );
                }
              },
            ]}
            actionKeys={["EditarUsuario"]}
            onEditClick={(user) => {
              setSelectedUser(user);
              setShowUpdateModal(true);
            }}
          />
        </Box>
      )}
      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cambiar Estado del Usuario</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={selectedUser?.status?.id || ''}
              label="Estado"
              onChange={(e) => handleStatusChange(e.target.value as string)}
            >
              {statusOptions.map(option => (
                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={openConfirmDialog}
        title="Confirmar cambio de estado"
        message="¿Estás seguro de que deseas cambiar el estado del usuario a inactivo? Esta acción puede afectar el acceso del usuario al sistema."
        onCancel={handleCancelReject}
        onConfirm={handleConfirmReject}
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
