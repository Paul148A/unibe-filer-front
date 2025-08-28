import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TablePagination, Paper } from '@mui/material';
import { ActionKey, Column, useCustomTable } from './hooks/use-custom-table';

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  actionKeys?: ActionKey[];
  renderActions?: (row: T) => React.ReactNode;
  onEditClick?: (row: T) => void;
  onDeleteClick?: (row: T) => void;
  onDownloadClick?: (row: T) => void;
  onPreviewClick?: (row: T) => void;
  initialRowsPerPage?: number;
}

const CustomTable = <T,>({
  data,
  columns,
  actionKeys,
  renderActions,
  onEditClick,
  onDeleteClick,
  onDownloadClick,
  onPreviewClick,
  initialRowsPerPage = 5,
}: Props<T>) => {
  // Estado para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const getActions = useCustomTable<T>(actionKeys, onEditClick, onDeleteClick, onDownloadClick, onPreviewClick);

  // Función para cambiar de página
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Función para cambiar filas por página
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Resetear a la primera página
  };

  // Calcular los datos a mostrar según la página actual
  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <Paper sx={{ maxWidth: '95%', boxShadow: 3, borderRadius: 2, marginTop: 2, width: '100%' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                {columns.map((column, index) => (
                  <TableCell sx={{ color: 'white' }} key={index}>
                    {column.label}
                  </TableCell>
                ))}
                {(renderActions || actionKeys) && (
                  <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => {
                    const value = row[column.key as keyof T];
                    return (
                      <TableCell key={colIndex}>
                        {column.render ? column.render(value, row) : String(value)}
                      </TableCell>
                    );
                  })}
                  {(renderActions || actionKeys) && (
                    <TableCell>
                      {renderActions ? renderActions(row) : getActions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {/* Mostrar filas vacías si hay menos datos que rowsPerPage */}
              {paginatedData.length < rowsPerPage && (
                Array.from({ length: rowsPerPage - paginatedData.length }).map((_, index) => (
                  <TableRow key={`empty-${index}`} sx={{ height: 53 }}>
                    <TableCell colSpan={columns.length + (renderActions || actionKeys ? 1 : 0)} />
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
          sx={{
            borderTop: '1px solid rgba(224, 224, 224, 1)',
            '.MuiTablePagination-toolbar': {
              paddingLeft: 2,
              paddingRight: 2,
            },
          }}
        />
      </Paper>
    </div>
  );
};

export default CustomTable;