import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { IDegreeDocument } from '../../../interfaces/IDegreeDocument';
import FilePreviewModal from '../../Modals/FilePreviewModal/file-preview-modal';

interface Props {
  degreeDocs: IDegreeDocument;
}

const documentTypes = [
  { key: 'topicComplainDoc', label: 'Tema Reclamo' },
  { key: 'topicApprovalDoc', label: 'Tema Aprobación' },
  { key: 'tutorAssignmentDoc', label: 'Asignación Tutor' },
  { key: 'tutorFormatDoc', label: 'Formato Tutor' },
  { key: 'antiplagiarismDoc', label: 'Antiplagio' },
  { key: 'tutorLetter', label: 'Carta Tutor' },
  { key: 'electiveGrade', label: 'Nota Electiva' },
  { key: 'academicClearance', label: 'Solvencia Académica' },
];

const DegreeDocumentsTable: React.FC<Props> = ({ degreeDocs }) => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);

  const handlePreviewClick = (fieldKey: string, fieldName: string, fieldValue: string) => {
    setPreviewFile({
      url: fieldValue,
      name: fieldName
    });
    setShowPreviewModal(true);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <TableContainer component={Paper} sx={{ maxWidth: '95%', boxShadow: 3, borderRadius: 2, marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documentTypes.map((doc) => {
                const value = (degreeDocs as any)[doc.key];
                const hasDoc = !!value;
                return (
                  <TableRow key={doc.key}>
                    <TableCell>{doc.label}</TableCell>
                    <TableCell>{hasDoc ? value : '-'}</TableCell>
                    <TableCell>
                      {hasDoc ? (
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="small"
                          onClick={() => handlePreviewClick(doc.key, doc.label, value)}
                        >
                          Ver
                        </Button>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {showPreviewModal && previewFile && (
        <FilePreviewModal
          open={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          fileName={previewFile.name}
          fileUrl={previewFile.url}
          documentType="degree"
        />
      )}
    </>
  );
};

export default DegreeDocumentsTable;