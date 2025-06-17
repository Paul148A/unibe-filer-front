export interface IInscriptionDocument {
  id: string;
  registrationDoc: string;
  semesterGradeChartDoc: string;
  reEntryDoc: string;
  englishCertificateDoc: string;
  enrollmentCertificateDoc: string;
  approvalDoc: string;
  englishCertificateStatus?: 'approved' | 'rejected' | 'pending';
}