import { createContext } from "react";
import { IUserAuth } from "../../../interfaces/IUserAuth";
import { IUser } from "../../../interfaces/IUser";
import { IRecord } from "../../../interfaces/IRecord";

interface AuthContextType {
  user: IUserAuth | null;
  authLoading: boolean;
  refreshUser: () => Promise<void>;
  setUser: (user: IUserAuth | null) => void;
  userInfo: IUser | null;
  setAuthLoading: (loading: boolean) => void;
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
  loading: boolean;
  setLoading: (loading: boolean) => void;
  record: IRecord | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);
