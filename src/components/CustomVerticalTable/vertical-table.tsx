import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { ActionKey, Column, useVerticalCustomTable } from './hooks/use-vertical-custom-table';

interface VerticalTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actionKeys?: ActionKey[];
  renderActions?: (row: T) => React.ReactNode;
  onEditClick?: (row: T) => void;
  onDeleteClick?: (row: T) => void;
  onRefreshClick?: () => void;
}

const VerticalTable = <T,>({
  data,
  columns,
  actionKeys,
  renderActions,
  onEditClick,
  onDeleteClick,
  onRefreshClick,
}: VerticalTableProps<T>) => {
  const getActions = useVerticalCustomTable<T>(actionKeys, onEditClick, onDeleteClick, onRefreshClick);

  return (
    <TableContainer component={Paper} sx={{ maxWidth: '95%', boxShadow: 3, borderRadius: 2, marginTop: 2, mx: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Tipo</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <>
              {columns.map((column, colIndex) => {
                const value = row[column.key as keyof T];
                return (
                  <TableRow key={`${rowIndex}-${colIndex}`}>
                    <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#0000' }}>
                      {column.label}
                    </TableCell>
                    <TableCell>
                      {column.render ? column.render(value, row) : String(value)}
                    </TableCell>
                  </TableRow>
                );
              })}
              {(renderActions || actionKeys) && (
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#0000' }}>
                    Acciones
                  </TableCell>
                  <TableCell>
                    {renderActions ? renderActions(row) : getActions(row)}
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VerticalTable;