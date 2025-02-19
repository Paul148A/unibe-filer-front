import { IRole } from "./IRole";
import { IStatus } from "./IStatus";

export interface IUser {
  id: string;
  names: string;
  last_names: string;
  identification: string;
  email: string;
  role: IRole;
  status: IStatus;
}

