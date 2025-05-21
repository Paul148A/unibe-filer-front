export interface IRecord {
  id: string;
  code: string;
  user: {
    id: string;
    names: string;
    last_names: string;
    email: string;
    identification: string;
  };
}