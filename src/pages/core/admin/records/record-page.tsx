import { Accordion, AccordionDetails, AccordionSummary, Chip, Grid2, Typography, Button, Box } from "@mui/material";
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
import FilePreviewModal from "../../../../components/Modals/FilePreviewModal/file-preview-modal";
import VisibilityIcon from '@mui/icons-material/Visibility';

const RecordPage = () => {
    const { id } = useParams<{ id: string }>();
    const [record, setRecord] = useState<IRecord | null>(null);
    const [personalDocs, setPersonalDocs] = useState<IPersonalDocument | null>(null);
    const [degreeDocs, setDegreeDocs] = useState<IDegreeDocument | null>(null);
    const [inscriptionDocs, setInscriptionDocs] = useState<IInscriptionDocument | null>(null);
    const [gradeDocs, setGradeDocs] = useState<IGrade[] | null>(null);
    const [enrollmentDocs, setEnrollmentDocs] = useState<IEnrollment[] | null>(null);
    const [permissionDocs, setPermissionDocs] = useState<IPermissionDocument[] | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);
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
            console.log('Fetching permission documents for record ID:', recordData.id);
            const permissionDocuments = await PermissionDocumentsService.getPermissionDocumentsByRecordId(recordData.id);
            console.log('Permission documents received:', permissionDocuments);
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

    const handlePreviewGrade = async (grade: IGrade) => {
        try {
            const { downloadGradeDocument } = await import("../../../../services/upload-files/grade.service");
            const blob = await downloadGradeDocument(grade.id!);
            const url = window.URL.createObjectURL(blob);
            setPreviewFile({
                url: url,
                name: grade.name
            });
            setShowPreviewModal(true);
        } catch (error: any) {
            setOpenAlert({
                open: true,
                type: "error",
                title: error.response?.data?.message || "Error al previsualizar documento"
            });
        }
    };

    const handlePreviewEnrollment = async (enrollment: IEnrollment) => {
        try {
            const { downloadEnrollmentDocument } = await import("../../../../services/upload-files/enrollment.service");
            const blob = await downloadEnrollmentDocument(enrollment.id!);
            const url = window.URL.createObjectURL(blob);
            setPreviewFile({
                url: url,
                name: enrollment.name
            });
            setShowPreviewModal(true);
        } catch (error: any) {
            setOpenAlert({
                open: true,
                type: "error",
                title: error.response?.data?.message || "Error al previsualizar documento"
            });
        }
    };

    const handlePreviewPermission = async (permission: IPermissionDocument) => {
        try {
            const blob = await PermissionDocumentsService.downloadDocument(permission.id);
            const url = window.URL.createObjectURL(blob);
            setPreviewFile({
                url: url,
                name: permission.supportingDoc
            });
            setShowPreviewModal(true);
        } catch (error: any) {
            setOpenAlert({
                open: true,
                type: "error",
                title: error.response?.data?.message || "Error al previsualizar documento"
            });
        }
    };

    const handleClosePreviewModal = () => {
        setShowPreviewModal(false);
        if (previewFile?.url.startsWith('blob:')) {
            window.URL.revokeObjectURL(previewFile.url);
        }
    };

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
                                {gradeDocs && gradeDocs.length > 0 ? (
                                    <Box>
                                        {gradeDocs.map((grade) => (
                                            <Box key={grade.id} sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center',
                                                py: 1,
                                                borderBottom: '1px solid #e0e0e0'
                                            }}>
                                                <Box>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {grade.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {grade.description}
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => handlePreviewGrade(grade)}
                                                    startIcon={<VisibilityIcon />}
                                                >
                                                    Visualizar
                                                </Button>
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography>Aun no hay documentos de notas cargados</Typography>
                                )}
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
                                {enrollmentDocs && enrollmentDocs.length > 0 ? (
                                    <Box>
                                        {enrollmentDocs.map((enrollment) => (
                                            <Box key={enrollment.id} sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center',
                                                py: 1,
                                                borderBottom: '1px solid #e0e0e0'
                                            }}>
                                                <Box>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {enrollment.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {enrollment.description}
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => handlePreviewEnrollment(enrollment)}
                                                    startIcon={<VisibilityIcon />}
                                                >
                                                    Visualizar
                                                </Button>
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography>Aun no hay documentos de matrícula cargados</Typography>
                                )}
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
                                {permissionDocs && permissionDocs.length > 0 ? (
                                    <Box>
                                        {permissionDocs.map((permission) => (
                                            <Box key={permission.id} sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center',
                                                py: 1,
                                                borderBottom: '1px solid #e0e0e0'
                                            }}>
                                                <Box>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {permission.supportingDoc}
                                                    </Typography>
                                                    {permission.description && (
                                                        <Typography variant="body2" color="text.secondary">
                                                            {permission.description}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => handlePreviewPermission(permission)}
                                                    startIcon={<VisibilityIcon />}
                                                >
                                                    Visualizar
                                                </Button>
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography>No hay permisos ni notificaciones cargados</Typography>
                                )}
                            </AccordionDetails>
                        </Accordion>
                        <br />
                    </Grid2>
                </Grid2>
            </Grid2>
            <br />

            {showPreviewModal && previewFile && (
                <FilePreviewModal
                    open={showPreviewModal}
                    onClose={handleClosePreviewModal}
                    fileName={previewFile.name}
                    fileUrl={previewFile.url}
                />
            )}
        </>
    )
}

export default RecordPage