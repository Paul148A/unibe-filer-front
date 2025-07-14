export interface IDegreeDocument {
  id: string;
  topicComplainDoc: string;
  topicComplainDocStatus?: { id: string; name: string };
  topicApprovalDoc: string;
  topicApprovalDocStatus?: { id: string; name: string };
  tutorAssignmentDoc: string;
  tutorAssignmentDocStatus?: { id: string; name: string };
  tutorFormatDoc: string;
  tutorFormatDocStatus?: { id: string; name: string };
  antiplagiarismDoc: string;
  antiplagiarismDocStatus?: { id: string; name: string };
  tutorLetter: string;
  tutorLetterStatus?: { id: string; name: string };
  electiveGrade: string;
  electiveGradeStatus?: { id: string; name: string };
  academicClearance: string;
  academicClearanceStatus?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}