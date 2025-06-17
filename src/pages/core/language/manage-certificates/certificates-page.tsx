import { Grid2, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IRecord } from "../../../../interfaces/IRecord";
import { IInscriptionDocument } from "../../../../interfaces/IInscriptionDocument";
import { getRecordByUserId } from "../../../../services/upload-files/record.service";
import { useAuth } from "../../../../components/Context/context";
import { getInscriptionDocumentsByRecordId } from "../../../../services/upload-files/inscription-documents.service";
import CertificateSection from "../../../../components/CertificateSection/certificate-section";

const CertificatePage = () => {
    const { id } = useParams<{ id: string }>();
    const [record, setRecord] = useState<IRecord[]>([]);
    const [inscriptionDocs, setInscriptionDocs] = useState<IInscriptionDocument>();
    const { setOpenAlert } = useAuth();

    const handleStatusChange = async (newStatus: 'approved' | 'rejected' | 'pending') => {
        if (inscriptionDocs) {
            setInscriptionDocs({
                ...inscriptionDocs,
                englishCertificateStatus: newStatus
            });
        }
    };

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
                const inscriptionDocuments = await getInscriptionDocumentsByRecordId(record[0]?.id);
                setInscriptionDocs(inscriptionDocuments[0]);

                if (!inscriptionDocuments || inscriptionDocuments.length === 0) {
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
                <Typography sx={{ p: 2, mt: 1 }} variant="h5" component="h3" gutterBottom>
                    {/* Certificado de ingles del estudiante: {record[0]?.user?.names} {record[0]?.user?.last_names} */}
                </Typography>
            </Grid2>
            <Grid2 sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Grid2 sx={{ boxShadow: 3, borderRadius: 2, marginTop: 2 }}>
                    <Grid2 container sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Grid2 size={10}>
                            {inscriptionDocs?.englishCertificateDoc && (
                                <CertificateSection
                                    docs={{
                                        id: inscriptionDocs.id,
                                        englishCertificateDoc: inscriptionDocs.englishCertificateDoc,
                                        registrationDoc: "",
                                        semesterGradeChartDoc: "",
                                        reEntryDoc: "",
                                        enrollmentCertificateDoc: "",
                                        approvalDoc: "",
                                        englishCertificateStatus: inscriptionDocs.englishCertificateStatus
                                    }}
                                    img='/downloaddocuments.png'
                                    title={`Certificado de inglés de: ${record[0]?.user?.names} ${record[0]?.user?.last_names}`}
                                    description=''
                                    sectionType='inscription'
                                    documentId={inscriptionDocs.id}
                                    documentType='english_certificate'
                                    status={inscriptionDocs.englishCertificateStatus}
                                    onStatusChange={handleStatusChange}
                                />
                            )}
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Grid2>
        </>
    )
}

export default CertificatePage