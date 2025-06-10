import { Grid2, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IRecord } from "../../../../interfaces/IRecord";
import { IPersonalDocument } from "../../../../interfaces/IPersonalDocument";
import { IDegreeDocument } from "../../../../interfaces/IDegreeDocument";
import { IInscriptionDocument } from "../../../../interfaces/IInscriptionDocument";
import { getRecordByUserId } from "../../../../services/upload-files/record.service";
import { useAuth } from "../../../../components/Context/context";
import { getPersonalDocumentsByRecordId } from "../../../../services/upload-files/personal-documents.service";
import { getDegreeDocumentsByRecordId } from "../../../../services/upload-files/degree-documents.service";
import { getInscriptionDocumentsByRecordId } from "../../../../services/upload-files/inscription-documents.service";
import RecordSection from "../../../../components/RecordSection/record-section";

const RecordPage = () => {
    const { id } = useParams<{ id: string }>();
    const [record, setRecord] = useState<IRecord[]>([]);
    const [personalDocs, setPersonalDocs] = useState<IPersonalDocument>();
    const [degreeDocs, setDegreeDocs] = useState<IDegreeDocument>();
    const [inscriptionDocs, setInscriptionDocs] = useState<IInscriptionDocument>();
    const { setOpenAlert } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching record data for user ID:", id);
                if (!id) {
                    setOpenAlert({
                        open: true,
                        type: "error",
                        title: "ID de usuario no proporcionado",
                    });
                    return;
                }
                const record = await getRecordByUserId(id);
                console.log("Record fetched:", record);
                if (!record || record.length === 0) {
                    setOpenAlert({
                        open: true,
                        type: "error",
                        title: "No se encontró el expediente para el usuario con ID: " + id,
                    });
                    return;
                }
                setRecord(record);
                const personalDocuments = await getPersonalDocumentsByRecordId(record[0]?.id);
                setPersonalDocs(personalDocuments[0]);
                const degreeDocuments = await getDegreeDocumentsByRecordId(record[0]?.id);
                setDegreeDocs(degreeDocuments[0]);
                const inscriptionDocuments = await getInscriptionDocumentsByRecordId(record[0]?.id);
                setInscriptionDocs(inscriptionDocuments[0]);

                if (!personalDocuments || personalDocuments.length === 0 || !degreeDocuments || degreeDocuments.length === 0 || !inscriptionDocuments || inscriptionDocuments.length === 0) {
                    setOpenAlert({
                        open: true,
                        type: "error",
                        title: "No se encontraron documentos para el usuario con ID: " + id,
                    });
                }
            } catch (error) {
                console.error("Error fetching record data:", error);
            }
        };
        fetchData();
    }, [id]);
    return (
        <>
            <Grid2>
                <Typography sx={{ p: 2, mt: 1 }} variant="h4" component="h2" gutterBottom>
                    Expediente individual
                </Typography>
            </Grid2>
            <Grid2 sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Grid2 sx={{ boxShadow: 3, borderRadius: 2, marginTop: 2 }}>
                    <Typography sx={{ p: 2, mt: 1 }} variant="h5" component="h3" gutterBottom>
                        Expediente del estudiante: {record[0]?.user?.names} {record[0]?.user?.last_names}
                    </Typography>
                    <Grid2 container sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Grid2 size={4}>
                            {personalDocs &&
                                <RecordSection
                                    docs={personalDocs}
                                    img='/personalimg.png'
                                    title='Documentos Personales'
                                    description='Documentos personales del estudiante'
                                    sectionType='personal'
                                />}
                        </Grid2>
                        <Grid2 size={4}>
                            {degreeDocs &&
                                <RecordSection
                                    docs={degreeDocs}
                                    img='/degreeimg.png'
                                    title='Documentos de Título'
                                    description='Documentos relacionados al título del estudiante'
                                    sectionType='degree'
                                />}
                        </Grid2>
                        <Grid2 size={4}>
                            {inscriptionDocs &&
                                <RecordSection
                                    docs={inscriptionDocs}
                                    img='/inscriptionimg.png'
                                    title='Documentos de Inscripción'
                                    description='Documentos relacionados a la inscripción del estudiante'
                                    sectionType='inscription'
                                />}
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Grid2>
        </>
    )
}

export default RecordPage