import { Button, IconButton, Stack } from '@mui/material';
import { useCallback } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

export type ActionKey =
  | 'EditarUsuario'
  | 'EliminarUsuario'
  | 'VerUsuario';

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

export function useCustomTable<T>(actions?: ActionKey[]) {
  return useCallback(
    (row: T) => {
      if (!actions) return null;

      return (
        <Stack direction="row" spacing={1}>
          {actions.includes('EditarUsuario') && (
            <Button size="small" onClick={() => console.log('Editar', row)}>
              Editar
            </Button>
          )}
          {actions.includes('EliminarUsuario') && (
            <IconButton size="large" onClick={() => console.log('Eliminar', row)}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          )}
        </Stack>
      );
    },
    [actions]
  );
}
