import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/auth/login.service";
import { useAuth } from "../../Context/context";
import { getAllRoles } from "../../../services/auth/role.service";
import { IRole } from "../../../interfaces/IRole";

const UseLoginForm = () => {
  const [identification, setIdentification] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { refreshUser, user, loading, setLoading, setOpenAlert } = useAuth();

  useEffect(() => {
    if (user) {
      try {
        const fetchRoles = async () => {
          const roles: IRole[] = await getAllRoles();
          console.log("Roles fetched:", roles);
          console.log("Current user:", user);
          const userRole = roles.find(role => role.name == user.role);
          console.log("User role found:", userRole);
          if (userRole) {
            switch (userRole.description) {
              case "Administrador":
                navigate("/admin-dashboard");
                break;
              case "Estudiante":
                navigate("/student-dashboard");
                break;
              case "Docente":
                navigate("/teacher-dashboard");
                break;
              case "Idioma":
                navigate("/language-dashboard");
                break;
              default:
                navigate("/");
            }
          } else {
            console.error("User role not found");
            navigate("/");
          }
        };

        fetchRoles();
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }
  }, [user, navigate]);

  const handleIdentificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIdentification(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login({ identification, password });
      await refreshUser();
      setLoading(false);
    } catch (error) {
      setOpenAlert({ open: true, type: "error", title: "Usuario y/o contraseña no válidos" });
      console.error("Login failed:", error);
      setLoading(false);
    }
  };

  return {
    identification,
    password,
    handleIdentificationChange,
    handlePasswordChange,
    handleSubmit,
    loading,
    setOpenAlert,
  };
};

export default UseLoginForm;
