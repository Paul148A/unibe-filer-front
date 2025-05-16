import { createContext } from "react";
import { IUserAuth } from "../../../interfaces/IUserAuth";
import { IUser } from "../../../interfaces/IUser";

interface AuthContextType {
  user: IUserAuth | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setUser: (user: IUserAuth | null) => void;
  userInfo: IUser | null;
  setLoading: (loading: boolean) => void;
  openSidebar: boolean;
  openAlert: {
    open: boolean;
    type: "success" | "error" | "info" | "warning";
    title: string;
  };
  setOpenAlert: (alert: {
    open: boolean;
    type: "success" | "error" | "info" | "warning";
    title: string;
  }) => void;
  handleCloseAlert: () => void;
  handleCloseSidebar: (open: boolean) => void;
  setOpenSidebar: (open: boolean) => void;
  handleSidebar: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
