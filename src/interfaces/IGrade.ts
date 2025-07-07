import { IInscriptionDocument } from "./IInscriptionDocument";
import { ISemester } from "./ISemester.ts";

export interface IGrade {
    id: string;
    name: string;
    description: string;
    inscriptionDocument: IInscriptionDocument;
    semester: ISemester;
}