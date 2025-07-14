export interface IInscriptionDocument {
  id: string;
  registrationDoc: string;
  registrationDocStatus?: { id: string; name: string };
  semesterGradeChartDoc: string;
  semesterGradeChartDocStatus?: { id: string; name: string };
  reEntryDoc: string;
  reEntryDocStatus?: { id: string; name: string };
  englishCertificateDoc: string;
  englishCertificateDocStatus?: { id: string; name: string };
  enrollmentCertificateDoc: string;
  enrollmentCertificateDocStatus?: { id: string; name: string };
  approvalDoc: string;
  approvalDocStatus?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}