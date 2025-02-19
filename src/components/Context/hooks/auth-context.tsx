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
}

export const AuthContext = createContext<AuthContextType | null>(null);
