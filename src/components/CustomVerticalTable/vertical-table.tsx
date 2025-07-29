import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from '@mui/material';
import { ActionKey, Column, useVerticalCustomTable } from './hooks/use-vertical-custom-table';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface VerticalTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actionKeys?: ActionKey[];
  renderActions?: (row: T) => React.ReactNode;
  onEditClick?: (row: T) => void;
  onDeleteClick?: (row: T) => void;
  onRefreshClick?: () => void;
  onPreviewClick?: (row: T) => void;
  onFieldPreviewClick?: (row: T, fieldKey: string, fieldName: string, fieldValue: string) => void;
}

const VerticalTable = <T,>({
  data,
  columns,
  actionKeys,
  onEditClick,
  onDeleteClick,
  onRefreshClick,
  onPreviewClick,
  onFieldPreviewClick,
}: VerticalTableProps<T>) => {
  const getActions = useVerticalCustomTable<T>(actionKeys, onEditClick, onDeleteClick, onRefreshClick, onPreviewClick);

  const renderFieldValue = (value: any, row: T, column: Column<T>) => {
    if (value === null || value === undefined || String(value).trim() === '') {
      return '-';
    }
    const stringValue = String(value);
    
    if (stringValue && stringValue.trim() !== '' && onFieldPreviewClick) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ flex: 1 }}>{stringValue}</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '0.75rem', color: '#888', marginBottom: '2px' }}>Acciones</span>
            <Tooltip title={`Previsualizar ${column.label}`}>
              <IconButton
                size="small"
                onClick={() => onFieldPreviewClick(row, column.key as string, column.label, stringValue)}
                sx={{ 
                  backgroundColor: 'orange', 
                  color: 'white',
                  '&:hover': { backgroundColor: 'darkorange' },
                  width: '32px',
                  height: '32px',
                  borderRadius: 0,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      );
    }
    return stringValue;
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: '95%', boxShadow: 3, borderRadius: 2, marginTop: 2, mx: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Tipo</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            columns.map((column, colIndex) => {
              const value = row[column.key as keyof T];
              return (
                <TableRow key={`${rowIndex}-${colIndex}`}>
                  <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#0000' }}>
                    {column.label}
                  </TableCell>
                  <TableCell>
                    {column.render ? column.render(value, row) : (value === null || value === undefined || String(value).trim() === '' ? '-' : String(value))}
                  </TableCell>
                  <TableCell>
                    {(value && String(value).trim() !== '' && onFieldPreviewClick) ? (
                      <Tooltip title={`Previsualizar ${column.label}`}>
                        <IconButton
                          size="small"
                          onClick={() => onFieldPreviewClick(row, column.key as string, column.label, String(value))}
                          sx={{ 
                            backgroundColor: 'orange', 
                            color: 'white',
                            '&:hover': { backgroundColor: 'darkorange' },
                            width: '32px',
                            height: '32px',
                            borderRadius: 1,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VerticalTable;