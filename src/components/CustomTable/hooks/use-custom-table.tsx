import { Button, Stack } from '@mui/material';
import { useCallback } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import { Link } from 'react-router-dom';
import { IRecord } from '../../../interfaces/IRecord';

export type ActionKey =
  | 'EditarUsuario'
  | 'EliminarUsuario'
  | 'VerUsuario'
  | 'VisualizarPdf'
  | 'DescargarExpediente'
  | 'EditarDocumentoGrado'
  | 'EliminarDocumentoGrado'
  | 'EditarDocumentoPersonal'
  | 'EliminarDocumentoPersonal'
  | 'EditarDocumentoInscripcion'
  | 'EliminarDocumentoInscripcion'
  | 'RevisarExpediente'
  | 'RevisarCertificadoIngles'
  | 'DescargarDocumentoPermiso'
  | 'EditarDocumentoPermiso'
  | 'EliminarDocumentoPermiso'
  ;

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

export function useCustomTable<T>(
  actions?: ActionKey[],
  onEditClick?: (row: T) => void,
  onDeleteClick?: (row: T) => void,
  onDownloadClick?: (row: T) => void,
  onPreviewClick?: (row: T) => void
) {
  return useCallback(
    (row: T) => {
      if (!actions) return null;

      return (
        <Stack direction="row" spacing={1}>
          {actions.includes('EditarUsuario') && (
            <Button size="small" sx={{backgroundColor: 'blue'}} onClick={() => onEditClick && onEditClick(row)}>
              <EditIcon sx={{color: 'white'}} />
            </Button>
          )}
          {actions.includes('EliminarUsuario') && (
            <Button size="small" sx={{backgroundColor: 'red'}} onClick={() => console.log('Editar', row)}>
              <DeleteIcon sx={{color: 'white'}} />
            </Button>
          )}
          {actions.includes('VisualizarPdf') && (
            <Button size="small" sx={{backgroundColor: 'orange'}} onClick={() => onPreviewClick && onPreviewClick(row)}>
              <VisibilityIcon sx={{color: 'white'}} />
            </Button>
          )}
          {actions.includes('DescargarExpediente') && (
            <Button size="small" sx={{backgroundColor: 'green'}} onClick={() => console.log('Descargar', row)}>
              <VisibilityIcon sx={{color: 'white'}} />
            </Button>
          )}
          {actions.includes('EditarDocumentoGrado') && (
            <Button size="small" sx={{backgroundColor: 'blue'}} onClick={() => onEditClick && onEditClick(row)}>
              <EditIcon sx={{color: 'white'}} />
            </Button>
          )}
          {actions.includes('EliminarDocumentoGrado') && (
            <Button size="small" sx={{backgroundColor: 'red'}} onClick={() => onDeleteClick && onDeleteClick(row)}>
              <DeleteIcon sx={{color: 'white'}} />
            </Button>
          )}
          {actions.includes('EditarDocumentoPersonal') && (
            <Button size="small" sx={{backgroundColor: 'blue'}} onClick={() => onEditClick && onEditClick(row)}>
              <EditIcon sx={{color: 'white'}} />
            </Button>
          )}
          {actions.includes('EliminarDocumentoPersonal') && (
            <Button size="small" sx={{backgroundColor: 'red'}} onClick={() => onDeleteClick && onDeleteClick(row)}>
              <DeleteIcon sx={{color: 'white'}} />
            </Button>
          )}
          {actions.includes('EditarDocumentoInscripcion') && (
            <Button size="small" sx={{backgroundColor: 'blue'}} onClick={() => onEditClick && onEditClick(row)}>
              <EditIcon sx={{color: 'white'}} />
            </Button>
          )}
          {actions.includes('EliminarDocumentoInscripcion') && (
            <Button size="small" sx={{backgroundColor: 'red'}} onClick={() => onDeleteClick && onDeleteClick(row)}>
              <DeleteIcon sx={{color: 'white'}} />
            </Button>
          )}
          {actions.includes('RevisarExpediente') && (
            <Button size="small" sx={{ backgroundColor: 'yellow' }} component={Link} to={`/records-page/${(row as IRecord).user.id}`}>
              <VisibilityIcon sx={{ color: 'white' }} />
            </Button>
          )}
          {actions.includes('RevisarCertificadoIngles') && (
            <Button size="small" sx={{ backgroundColor: 'green' }} component={Link} to={`/certificates-language-page/${(row as IRecord).user.id}`}>
              <VisibilityIcon sx={{ color: 'white' }} />
            </Button>
          )}
          {actions.includes('DescargarDocumentoPermiso') && (
            <Button size="small" sx={{backgroundColor: 'green'}} onClick={() => onDownloadClick && onDownloadClick(row)}>
              <DownloadIcon sx={{color: 'white'}} />
            </Button>
          )}
          {actions.includes('EditarDocumentoPermiso') && (
            <Button size="small" sx={{backgroundColor: 'blue'}} onClick={() => onEditClick && onEditClick(row)}>
              <EditIcon sx={{color: 'white'}} />
            </Button>
          )}
          {actions.includes('EliminarDocumentoPermiso') && (
            <Button size="small" sx={{backgroundColor: 'red'}} onClick={() => onDeleteClick && onDeleteClick(row)}>
              <DeleteIcon sx={{color: 'white'}} />
            </Button>
          )}
        </Stack>
      ); 
    },
    [actions, onEditClick, onDeleteClick, onDownloadClick, onPreviewClick]
  );
}
