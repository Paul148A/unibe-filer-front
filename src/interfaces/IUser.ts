import { IRole } from "./IRole";
import { IStatus } from "./IStatus";
import { ISemester } from "./ISemester";
import { ICareer } from "./ICareer";

export interface IUser {
  id: string;
  names: string;
  last_names: string;
  identification: string;
  email: string;
  role: IRole;
  status?: IStatus;
  semester?: ISemester;
  career?: ICareer
  is_approved?: boolean;
}