import { IUser } from "./IUser";

export interface IRecord {
  id: string;
  code: string;
  user: IUser;
}