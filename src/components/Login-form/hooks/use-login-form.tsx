import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/auth/login.service";
import { useAuth } from "../../Context/context";

const UseLoginForm = () => {
  const [identification, setIdentification] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { refreshUser, user, loading, setLoading, setOpenAlert } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "student") {
        navigate("/student-dashboard");
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
