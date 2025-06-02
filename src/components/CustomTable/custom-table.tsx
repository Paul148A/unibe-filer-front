import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ActionKey, Column, useCustomTable } from './hooks/use-custom-table';

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  actionKeys?: ActionKey[];
  renderActions?: (row: T) => React.ReactNode;
}

const CustomTable = <T,>({
  data,
  columns,
  actionKeys,
  renderActions,
}: Props<T>) => {
  const getActions = useCustomTable<T>(actionKeys);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <TableContainer sx={{ maxWidth: '95%', boxShadow: 3, borderRadius: 2, marginTop: 2 }}>
        <Table sx={{}}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              {columns.map((column, index) => (
                <TableCell sx={{color: 'white'}} key={index}>{column.label}</TableCell>
              ))}
              {(renderActions || actionKeys) && <TableCell sx={{color: 'white'}}>Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
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
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CustomTable