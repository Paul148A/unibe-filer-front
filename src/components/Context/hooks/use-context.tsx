import { useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { IGlobal } from "../../../global/IGlobal";
import { AuthContext } from "./auth-context";
import { IUserAuth } from "../../../interfaces/IUserAuth";

export const UseContext = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUserAuth | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${IGlobal.BACK_ROUTE}/auth/check-auth`, {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Error al verificar autenticación:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser: fetchUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
