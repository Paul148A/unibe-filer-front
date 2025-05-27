import { useEffect, useState, ReactNode, useMemo, useCallback } from "react";
import axios from "axios";
import { IGlobal } from "../../../global/IGlobal";
import { AuthContext } from "./auth-context";
import { IUserAuth } from "../../../interfaces/IUserAuth";
import { IUser } from "../../../interfaces/IUser";
import { AlertColor } from "@mui/material";
import { IRecord } from "../../../interfaces/IRecord";
import { getRecordById } from "../../../services/upload-files/record.service";

export const UseContext = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUserAuth | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState({
    open: false,
    type: "success" as AlertColor,
    title: "",
  });
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<IRecord | null>(null);

  const fetchUser = async () => {
    setAuthLoading(true);
    try {
      const response = await axios.get(`${IGlobal.BACK_ROUTE}/auth/check-auth`, {
        withCredentials: true,
      });
      const userInfo = await axios.get(`${IGlobal.BACK_ROUTE}/api1/users/${response.data.user.id}`, {
        withCredentials: true,
      });

      const record = await getRecordById(response.data.user.id);

      setUser(response.data.user);
      setUserInfo(userInfo.data.data);
      if (response.data.user.role.name === "student") {
        setRecord(record[0]);
      } else {
        setRecord(null);
      }
      setAuthLoading(false);
    } catch (error) {
      console.error("Error al verificar autenticación:", error);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCloseAlert = useCallback(() => {
    setOpenAlert(prev => ({ ...prev, open: false }));
  }, []);

  const handleCloseSidebar = (open: boolean) => {
    setOpenSidebar(open);
  }

  const handleSidebar = () => {
    setOpenSidebar(true);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const contextValue = useMemo(() => ({
    user,
    authLoading,
    refreshUser: fetchUser,
    setUser,
    userInfo,
    setAuthLoading,
    openSidebar,
    openAlert,
    setOpenAlert,
    handleCloseAlert,
    handleCloseSidebar,
    setOpenSidebar,
    handleSidebar,
    loading,
    setLoading,
    record,
  }), [
    user,
    authLoading,
    userInfo,
    openSidebar,
    openAlert,
    handleCloseAlert,
    setAuthLoading,
    loading,
    setLoading,
    record,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
