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
    const [record, setRecord] = useState<IRecord | null>(null);
    const [inscriptionDocs, setInscriptionDocs] = useState<IInscriptionDocument | null>(null);
    const { setOpenAlert } = useAuth();

    const handleStatusChange = async (newStatus: 'approved' | 'rejected' | 'pending') => {
        if (inscriptionDocs) {
            setInscriptionDocs({
                ...inscriptionDocs,
                englishCertificateDocStatus: { id: newStatus, name: newStatus }
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
                const recordDataArr = await getRecordByUserId(id);
                if (!recordDataArr || recordDataArr.length === 0) {
                    setOpenAlert({
                        open: true,
                        type: "error",
                        title: "No se encontró el expediente para el usuario con ID: " + id,
                    });
                    return;
                }
                const recordData = recordDataArr[0];
                setRecord(recordData);
                if (!recordData?.id) {
                    setOpenAlert({
                        open: true,
                        type: "error",
                        title: "El expediente no tiene un ID válido",
                    });
                    return;
                }
                const inscriptionDocument = await getInscriptionDocumentsByRecordId(recordData.id);
                setInscriptionDocs(inscriptionDocument);
                if (!inscriptionDocument) {
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
                    {/* Certificado de ingles del estudiante: {record?.user?.names} {record?.user?.last_names} */}
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
                                        ...inscriptionDocs,
                                        registrationDoc: inscriptionDocs.registrationDoc || "",
                                        semesterGradeChartDoc: inscriptionDocs.semesterGradeChartDoc || "",
                                        reEntryDoc: inscriptionDocs.reEntryDoc || "",
                                        enrollmentCertificateDoc: inscriptionDocs.enrollmentCertificateDoc || "",
                                        approvalDoc: inscriptionDocs.approvalDoc || "",
                                        englishCertificateDocStatus: inscriptionDocs.englishCertificateDocStatus
                                    }}
                                    img='/downloaddocuments.png'
                                    title={`Certificado de inglés de: ${record?.user?.names} ${record?.user?.last_names}`}
                                    description=''
                                    sectionType='inscription'
                                    documentId={inscriptionDocs.id}
                                    documentType='english_certificate'
                                    status={
                                        inscriptionDocs.englishCertificateDocStatus?.id === 'approved' ||
                                        inscriptionDocs.englishCertificateDocStatus?.id === 'rejected' ||
                                        inscriptionDocs.englishCertificateDocStatus?.id === 'pending'
                                            ? inscriptionDocs.englishCertificateDocStatus.id as 'approved' | 'rejected' | 'pending'
                                            : undefined
                                    }
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