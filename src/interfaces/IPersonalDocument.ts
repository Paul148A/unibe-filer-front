export interface IPersonalDocument {
  id: string;
  pictureDoc: string;
  pictureDocStatus?: { id: string; name: string };
  dniDoc: string;
  dniDocStatus?: { id: string; name: string };
  votingBallotDoc: string;
  votingBallotDocStatus?: { id: string; name: string };
  notarizDegreeDoc: string;
  notarizDegreeDocStatus?: { id: string; name: string };
  record?: {
    id: string;
  };
  createdAt: string;
  updatedAt: string;
}