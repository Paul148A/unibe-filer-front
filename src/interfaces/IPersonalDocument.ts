import { IRecord } from "./IRecord";

export interface IPersonalDocument {
  id: string;
  pictureDoc?: string;
  dniDoc?: string;
  votingBallotDoc?: string;
  notarizDegreeDoc?: string;
  record: IRecord;
}