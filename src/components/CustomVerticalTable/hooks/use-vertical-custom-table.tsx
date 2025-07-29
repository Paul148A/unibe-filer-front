import { useCallback } from 'react';
import { Button, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';

export type ActionKey =
  | 'EditarDocumentoGrado'
  | 'EliminarDocumentoGrado'
  | 'EditarDocumentoPersonal'
  | 'EliminarDocumentoPersonal'
  | 'EditarDocumentoInscripcion'
  | 'EliminarDocumentoInscripcion'
  | 'Refrescar'
  | 'Previsualizar'
  ;

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

export function useVerticalCustomTable<T>(
  actions?: ActionKey[],
  onEditClick?: (row: T) => void,
  onDeleteClick?: (row: T) => void,
  onRefreshClick?: () => void,
  onPreviewClick?: (row: T) => void
) {
  return useCallback(
    (row: T) => {
      if (!actions) return null;

      return (
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
          {actions.includes('EditarDocumentoGrado') && (
            <Button size="small" sx={{ backgroundColor: 'blue', minWidth: '40px' }} onClick={() => onEditClick && onEditClick(row)}>
              <EditIcon sx={{ color: 'white' }} />
            </Button>
          )}
          {actions.includes('EliminarDocumentoGrado') && (
            <Button size="small" sx={{ backgroundColor: 'red', minWidth: '40px' }} onClick={() => onDeleteClick && onDeleteClick(row)}>
              <DeleteIcon sx={{ color: 'white' }} />
            </Button>
          )}
          {actions.includes('EditarDocumentoPersonal') && (
            <Button size="small" sx={{ backgroundColor: 'blue', minWidth: '40px' }} onClick={() => onEditClick && onEditClick(row)}>
              <EditIcon sx={{ color: 'white' }} />
            </Button>
          )}
          {actions.includes('EliminarDocumentoPersonal') && (
            <Button size="small" sx={{ backgroundColor: 'red', minWidth: '40px' }} onClick={() => onDeleteClick && onDeleteClick(row)}>
              <DeleteIcon sx={{ color: 'white' }} />
            </Button>
          )}
          {actions.includes('EditarDocumentoInscripcion') && (
            <Button size="small" sx={{ backgroundColor: 'blue', minWidth: '40px' }} onClick={() => onEditClick && onEditClick(row)}>
              <EditIcon sx={{ color: 'white' }} />
            </Button>
          )}
          {actions.includes('EliminarDocumentoInscripcion') && (
            <Button size="small" sx={{ backgroundColor: 'red', minWidth: '40px' }} onClick={() => onDeleteClick && onDeleteClick(row)}>
              <DeleteIcon sx={{ color: 'white' }} />
            </Button>
          )}
          {actions.includes('Refrescar') && (
            <Button size="small" sx={{ backgroundColor: 'green', minWidth: '40px' }} onClick={() => onRefreshClick && onRefreshClick()}>
              <RefreshIcon sx={{ color: 'white' }} />
            </Button>
          )}
          {actions.includes('Previsualizar') && (
            <Button size="small" sx={{ backgroundColor: 'orange', minWidth: '40px' }} onClick={() => onPreviewClick && onPreviewClick(row)}>
              <VisibilityIcon sx={{ color: 'white' }} />
            </Button>
          )}
        </Stack>
      );
    },
    [actions, onDeleteClick, onEditClick, onRefreshClick, onPreviewClick]
  );
}

export { EditIcon, DeleteIcon, RefreshIcon, VisibilityIcon };