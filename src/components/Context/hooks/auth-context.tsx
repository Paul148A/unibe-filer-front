import { createContext } from "react";
import { IUserAuth } from "../../../interfaces/IUserAuth";

interface AuthContextType {
  user: IUserAuth | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setUser: (user: IUserAuth | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
