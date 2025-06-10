import { Dialog, DialogTitle, IconButton, DialogContent } from "@mui/material";
import { IDegreeDocument } from "../../interfaces/IDegreeDocument";
import { IInscriptionDocument } from "../../interfaces/IInscriptionDocument";
import { IPersonalDocument } from "../../interfaces/IPersonalDocument";
import DegreeDocsTable from "../Modals/DegreeDocsTable/degree-docs-table";
import InscriptionDocsTable from "../Modals/InscriptionDocsTable/inscription-docs-table";
import PersonalDocsTable from "../Modals/PersonalDocsTable/personal-docs-table";
import CloseIcon from '@mui/icons-material/Close';

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
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Documentos del estudiante
        <IconButton
          aria-label="close"
          onClick={props.onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{content}</DialogContent>
    </Dialog>
  );
}

export default RecordSectionHandler