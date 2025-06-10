import { IDegreeDocument } from "../../interfaces/IDegreeDocument";
import { IInscriptionDocument } from "../../interfaces/IInscriptionDocument";
import { IPersonalDocument } from "../../interfaces/IPersonalDocument";
import DegreeDocsTable from "../Modals/DegreeDocsTable/degree-docs-table";
import InscriptionDocsTable from "../Modals/InscriptionDocsTable/inscription-docs-table";
import PersonalDocsTable from "../Modals/PersonalDocsTable/personal-docs-table";

interface Props {
  sectionType?: string;
  docs: IPersonalDocument | IInscriptionDocument | IDegreeDocument;
  open: boolean; // Nuevo prop para controlar el modal
  onClose: () => void;
}

const RecordSectionHandler = (props: Props) => {
  let content;

  switch (props.sectionType) {
    case "degree":
      { const degreeDocs = props.docs as IDegreeDocument;
      content = <DegreeDocsTable degreeDocs={degreeDocs}/>;
      break; }
    case "inscription":
      { const inscriptionDocs = props.docs as IInscriptionDocument;
      content = <InscriptionDocsTable inscriptionDocs={inscriptionDocs}/>;
      break;}
    case "personal":
      { const personalDocs = props.docs as IPersonalDocument;
      content = <PersonalDocsTable personalDocs={personalDocs}/>;
      break;}
    default:
      content = <div>Tipo de sección no válido</div>;
  }

  return (
    <>{content}</>
  );
}

export default RecordSectionHandler