import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { IInscriptionDocument } from "../../interfaces/IInscriptionDocument";
import CertificateSectionHandler from "../CertificateSectionHandler/certificate-section-handler";

interface Props {
    img: string;
    title: string;
    description: string;
    sectionType: string;
    docs: IInscriptionDocument;
    documentId: string;
    documentType: string;
    status?: 'approved' | 'rejected' | 'pending';
    onStatusChange?: (newStatus: 'approved' | 'rejected' | 'pending') => void;
}

const CertificateSection = (props: Props) => {
    return (
        <Card sx={{
            margin: 2,
            transition: '0.3s',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            '&:hover': {
                boxShadow: '0px 4px 20px rgba(0, 0, 255, 0.5)',
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
        }}>
            <CardMedia sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', pt: 2 }}>
                <img src={props.img} width="200" height="200" alt={props.title} />
            </CardMedia>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {props.description}
                </Typography>
                <CertificateSectionHandler
                    sectionType={props.sectionType}
                    docs={props.docs}
                    documentId={props.documentId}
                    documentType={props.documentType}
                    status={props.status}
                    onStatusChange={props.onStatusChange}
                />
            </CardContent>
        </Card>
    )
}

export default CertificateSection