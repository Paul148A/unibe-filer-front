import React, { useState } from 'react';
import axiosInstance from '../../../../api/axios';
import { IPersonalDocument } from '../../../../interfaces/IPersonalDocument';
import { useAuth } from '../../../../components/Context/context';
import '../../../../styles/update-documents.css';

interface UpdatePersonalDocumentsModalProps {
  document: IPersonalDocument;
  onClose: () => void;
  onUpdate: () => void;
}

const UpdatePersonalDocumentsModal: React.FC<UpdatePersonalDocumentsModalProps> = ({ 
  document, 
  onClose,
  onUpdate
}) => {
  const [files, setFiles] = useState<{
    pictureDoc?: File;
    dniDoc?: File;
    votingBallotDoc?: File;
    notarizDegreeDoc?: File;
  }>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const { setOpenAlert } = useAuth();

  const handleFileChange = (field: keyof typeof files) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type !== 'application/pdf') {
        setOpenAlert({ open: true, type: 'error', title: 'Solo se permiten archivos PDF' });
        return;
      }
      setFiles(prev => ({
        ...prev,
        [field]: file || undefined
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(files).length === 0) {
      setOpenAlert({ open: true, type: "error", title: "Debes subir todos los archivos del formulario" });
      return;
    }

    if (!document.id) {
      setOpenAlert({ open: true, type: "error", title: "No se encontró el ID del documento." });
      setIsUpdating(false);
      return;
    }

    setIsUpdating(true);
    const formData = new FormData();

    if (files.pictureDoc) formData.append('pictureDoc', files.pictureDoc);
    if (files.dniDoc) formData.append('dniDoc', files.dniDoc);
    if (files.votingBallotDoc) formData.append('votingBallotDoc', files.votingBallotDoc);
    if (files.notarizDegreeDoc) formData.append('notarizDegreeDoc', files.notarizDegreeDoc);

    try {
      await axiosInstance.put(
        `api1/personal/update-personal-documents/${document.id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setOpenAlert({open: true, type: "success", title: "Documentos actualizados correctamente"});
      onUpdate();
      onClose();
    } catch (error: any) {
      setOpenAlert({ open: true, type: "error", title: "Error al actualizar los documentos" + error });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Actualizar Documentos</h2>
        <p className="modal-description">Selecciona solo los documentos que deseas actualizar</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.pictureDoc}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  pictureDoc: prev.pictureDoc ? undefined : new File([], '')
                }))}
              />
              Foto tamaño carnet (actual: {document.pictureDoc || "No subido"})
            </label>
            {files.pictureDoc !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('pictureDoc')}
                required={!!files.pictureDoc}
              />
            )}
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.dniDoc}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  dniDoc: prev.dniDoc ? undefined : new File([], '')
                }))}
              />
              Cedula de identidad (actual: {document.dniDoc || "No subido"})
            </label>
            {files.dniDoc !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('dniDoc')}
                required={!!files.dniDoc}
              />
            )}
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.votingBallotDoc}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  votingBallotDoc: prev.votingBallotDoc ? undefined : new File([], '')
                }))}
              />
              Papeleta de votación (actual: {document.votingBallotDoc || "No subido"})
            </label>
            {files.votingBallotDoc !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('votingBallotDoc')}
                required={!!files.votingBallotDoc}
              />
            )}
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.notarizDegreeDoc}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  notarizDegreeDoc: prev.notarizDegreeDoc ? undefined : new File([], '')
                }))}
              />
              Título notariado (actual: {document.notarizDegreeDoc || "No subido"})
            </label>
            {files.notarizDegreeDoc !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('notarizDegreeDoc')}
                required={!!files.notarizDegreeDoc}
              />
            )}
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={isUpdating}>
              Cancelar
            </button>
            <button type="submit" disabled={isUpdating || Object.keys(files).length === 0}>
              {isUpdating ? 'Actualizando...' : 'Actualizar seleccionados'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePersonalDocumentsModal;