import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { IPersonalDocument } from '../../../interfaces/IPersonalDocument';

interface Props {
  personalDocs: IPersonalDocument;
}

const documentTypes = [
  { key: 'pictureDoc', label: 'Foto de tamaño carnet' },
  { key: 'dniDoc', label: 'Copia de cedula' },
  { key: 'votingBallotDoc', label: 'Papeleta de votación' },
  { key: 'notarizDegreeDoc', label: 'Documento de título notarizado' },
];

const PersonalDocumentsTable: React.FC<Props> = ({ personalDocs }) => (
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
            const value = (personalDocs as any)[doc.key];
            const hasDoc = !!value;
            return (
              <TableRow key={doc.key}>
                <TableCell>{doc.label}</TableCell>
                <TableCell>{hasDoc ? value : '-'}</TableCell>
                <TableCell>
                  {hasDoc ? (
                    <Button variant="contained" color="primary" size="small">
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
);

export default PersonalDocumentsTable;