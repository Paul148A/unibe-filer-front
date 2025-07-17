import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import RecordSectionHandler from "../RecordSectionHandler/record-section-handler";
import { IPersonalDocument } from "../../interfaces/IPersonalDocument";
import { IDegreeDocument } from "../../interfaces/IDegreeDocument";
import { IInscriptionDocument } from "../../interfaces/IInscriptionDocument";
import { useState } from "react";

interface Props {
    img: string;
    title: string;
    description: string;
    sectionType: string;
    docs: IPersonalDocument | IDegreeDocument | IInscriptionDocument;
    onDataChanged?: () => void;
}

const RecordSection = (props: Props) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <>
            <Card sx={{
                margin: 2,
                transition: '0.3s',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                    boxShadow: '0px 4px 20px rgba(0, 0, 255, 0.5)',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
            }} onClick={() => {} }>
                <CardActionArea onClick={handleOpen}>
                    <CardMedia sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                        <img src={props.img} width="200" height="200" />
                    </CardMedia>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {props.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {props.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card >
            <RecordSectionHandler
                sectionType={props.sectionType}
                docs={props.docs}
                open={open}
                onClose={handleClose}
                onDataChanged={props.onDataChanged}
            />
        </>
    )
}

export default RecordSection