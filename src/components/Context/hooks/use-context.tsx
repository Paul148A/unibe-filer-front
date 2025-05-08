import { useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { IGlobal } from "../../../global/IGlobal";
import { AuthContext } from "./auth-context";
import { IUserAuth } from "../../../interfaces/IUserAuth";
import { IUser } from "../../../interfaces/IUser";
import { AlertColor } from "@mui/material";

export const UseContext = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUserAuth | null>(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState({
      open: false,
      type: "success" as AlertColor,
      title: "",
    });

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${IGlobal.BACK_ROUTE}/auth/check-auth`, {
        withCredentials: true,
      });
      const userInfo = await axios.get(`${IGlobal.BACK_ROUTE}/users/${response.data.user.id}`, {
        withCredentials: true,
      });
      setUser(response.data.user);
      setUserInfo(userInfo.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al verificar autenticación:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert({ ...openAlert, open: false });
  };

  const handleSidebar = () => {
    setOpenSidebar(!openSidebar);
  }

  const handleCloseSidebar = () => {
    setOpenSidebar(false);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      refreshUser: fetchUser,
      setUser,
      userInfo,
      setLoading,
      handleSidebar,
      openSidebar,
      openAlert,
      setOpenAlert,
      handleCloseAlert,
      handleCloseSidebar,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
