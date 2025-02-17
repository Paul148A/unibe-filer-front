import { useContext } from "react";
import { AuthContext } from "./hooks/auth-context";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un UseContext");
  }
  return context;
};
