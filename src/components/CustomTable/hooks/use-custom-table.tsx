import { Button, Stack } from '@mui/material';
import { useCallback } from 'react';

export type ActionKey =
  | 'Editar'
  | 'Eliminar'
  | 'VisualizarPDF'
  | 'RechazarDocumento'
  | 'AprobarDocumento';

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
          {actions.includes('Editar') && (
            <Button size="small" onClick={() => console.log('Editar', row)}>
              Editar
            </Button>
          )}
          {actions.includes('Eliminar') && (
            <Button size="small" color="error" onClick={() => console.log('Eliminar', row)}>
              Eliminar
            </Button>
          )}
          {actions.includes('VisualizarPDF') && (
            <Button size="small" onClick={() => console.log('Ver PDF', row)}>
              Ver PDF
            </Button>
          )}
          {actions.includes('RechazarDocumento') && (
            <Button size="small" color="warning" onClick={() => console.log('Rechazar', row)}>
              Rechazar
            </Button>
          )}
          {actions.includes('AprobarDocumento') && (
            <Button size="small" color="success" onClick={() => console.log('Aprobar', row)}>
              Aprobar
            </Button>
          )}
        </Stack>
      );
    },
    [actions]
  );
}
