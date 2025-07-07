import { IInscriptionDocument } from "./IInscriptionDocument";

export interface IGradeEnrollment {
    id: string;
    inscriptionDocument: IInscriptionDocument;
    name: string;
    description: string;
}