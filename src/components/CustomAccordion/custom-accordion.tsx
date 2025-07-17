import { IGrade } from '../../interfaces/IGrade'
import { IEnrollment } from '../../interfaces/IEnrollment'
import { IPermissionDocument } from '../../interfaces/IPermissionDocument'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
    content: IGrade[] | IEnrollment[] | IPermissionDocument[]
}

const CustomAccordion = (props: Props) => {
    return (
        <>
            <Accordion sx={{ boxShadow: 3, borderRadius: 2, marginTop: 2, ml: 20, mr: 20 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" gutterBottom>
                        Documentos de Notas
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {props.content.map ((item, index) => (
                        <Typography key={index} variant="body1" sx={{ marginBottom: 1 }}>
                            {item.id} - {item.description}
                        </Typography>
                    ))}
                </AccordionDetails>
            </Accordion>
        </>
    )
}

export default CustomAccordion