import { Accordion, AccordionDetails, AccordionSummary, Chip, Grid2, TableRow, Typography } from "@mui/material";
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
import { IGrade } from "../../../../interfaces/IGrade";
import { getGradesByInscriptionDocumentsId } from "../../../../services/upload-files/grade.service";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IEnrollment } from "../../../../interfaces/IEnrollment";
import { getEnrollmentsByInscriptionDocumentsId } from "../../../../services/upload-files/enrollment.service";
import { IPermissionDocument } from "../../../../interfaces/IPermissionDocument";
import { PermissionDocumentsService } from "../../../../services/upload-files/permission-documents.service";

const RecordPage = () => {
    const { id } = useParams<{ id: string }>();
    const [record, setRecord] = useState<IRecord | null>(null);
    const [personalDocs, setPersonalDocs] = useState<IPersonalDocument | null>(null);
    const [degreeDocs, setDegreeDocs] = useState<IDegreeDocument | null>(null);
    const [inscriptionDocs, setInscriptionDocs] = useState<IInscriptionDocument | null>(null);
    const [gradeDocs, setGradeDocs] = useState<IGrade[] | null>(null);
    const [enrollmentDocs, setEnrollmentDocs] = useState<IEnrollment[] | null>(null);
    const [permissionDocs, setPermissionDocs] = useState<IPermissionDocument[] | null>(null);
    const { setOpenAlert } = useAuth();

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
            const recordArr = await getRecordByUserId(id);
            if (!recordArr || recordArr.length === 0) {
                setOpenAlert({
                    open: true,
                    type: "error",
                    title: "No se encontró el expediente para el usuario con ID: " + id,
                });
                return;
            }
            const recordData = recordArr[0];
            setRecord(recordData);
            const personalDocuments = await getPersonalDocumentsByRecordId(recordData.id);
            setPersonalDocs(personalDocuments);
            const degreeDocuments = await getDegreeDocumentsByRecordId(recordData.id);
            setDegreeDocs(degreeDocuments);
            const inscriptionDocuments = await getInscriptionDocumentsByRecordId(recordData.id);
            setInscriptionDocs(inscriptionDocuments);
            const gradeDocuments = await getGradesByInscriptionDocumentsId(inscriptionDocuments.id);
            setGradeDocs(gradeDocuments);
            const enrollmentDocuments = await getEnrollmentsByInscriptionDocumentsId(inscriptionDocuments.id);
            setEnrollmentDocs(enrollmentDocuments);
            const permissionDocuments = await PermissionDocumentsService.getPermissionDocumentsByRecordId(recordData.id);
            setPermissionDocs(permissionDocuments.data);
            if (!personalDocuments || !degreeDocuments || !inscriptionDocuments) {
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

    useEffect(() => {
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
                        Expediente del estudiante: {record?.user?.names} {record?.user?.last_names}
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
                                    onDataChanged={fetchData}
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
                                    onDataChanged={fetchData}
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
                                    onDataChanged={fetchData}
                                />}
                        </Grid2>
                    </Grid2>
                    <Grid2>
                        <Accordion sx={{ boxShadow: 3, borderRadius: 2, marginTop: 2, ml: 2, mr: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" gutterBottom>
                                    Documentos de Notas
                                </Typography>
                                <Chip
                                    label={`${gradeDocs ? gradeDocs.length : 0} Documentos`}
                                    color="secondary"
                                    variant="outlined"
                                    sx={{ borderColor: "#d500f9", color: "#d500f9", ml: 2 }}
                                />
                            </AccordionSummary>
                            <AccordionDetails>
                                {gradeDocs ? gradeDocs.map((grade) => (
                                    <TableRow
                                        key={grade.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >{grade.name}</TableRow>
                                )) : (<TableRow> Aun no hay documentos de notas cargados</TableRow>)}
                            </AccordionDetails>
                        </Accordion>
                        <Accordion sx={{ boxShadow: 3, borderRadius: 2, marginTop: 2, ml: 2, mr: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" gutterBottom>
                                    Documentos de Matrícula
                                </Typography>
                                <Chip
                                    label={`${enrollmentDocs ? enrollmentDocs.length : 0} Documentos`}
                                    color="secondary"
                                    variant="outlined"
                                    sx={{ borderColor: "#d500f9", color: "#d500f9", ml: 2 }}
                                />
                            </AccordionSummary>
                            <AccordionDetails>
                                {enrollmentDocs ? enrollmentDocs.map((enrollment) => (
                                    <TableRow
                                        key={enrollment.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >{enrollment.name}</TableRow>
                                )) : (<TableRow> Aun no hay documentos de matrícula cargados</TableRow>)}
                            </AccordionDetails>
                        </Accordion>
                        <Accordion sx={{ boxShadow: 3, borderRadius: 2, marginTop: 2, ml: 2, mr: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" gutterBottom>
                                    Permisos y notificaciones
                                </Typography>
                                <Chip
                                    label={`${permissionDocs ? permissionDocs.length : 0} Documentos`}
                                    color="secondary"
                                    variant="outlined"
                                    sx={{ borderColor: "#d500f9", color: "#d500f9", ml: 2 }}
                                />
                            </AccordionSummary>
                            <AccordionDetails>
                                {permissionDocs ? permissionDocs.map((permission) => (
                                    <TableRow
                                        key={permission.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >{permission.supportingDoc}</TableRow>
                                )) : (<TableRow> No hay permisos ni notificaciones cargados</TableRow>)}
                            </AccordionDetails>
                        </Accordion>
                        <br />
                    </Grid2>
                </Grid2>
            </Grid2>
            <br />
        </>
    )
}

export default RecordPage