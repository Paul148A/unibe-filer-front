import React, { useState } from 'react';
import axios from 'axios';
import { PersonalDocument } from '../../../../interfaces/IPersonalDocument';
import { useAlert } from '../../../../components/Context/AlertContext';
import '../../../../styles/update-documents.css';

interface UpdatePersonalDocumentsModalProps {
  document: PersonalDocument;
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
  const { showAlert } = useAlert();

  const handleFileChange = (field: keyof typeof files) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFiles(prev => ({
        ...prev,
        [field]: e.target.files?.[0] || undefined
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(files).length === 0) {
      showAlert('Debes seleccionar al menos un documento para actualizar', 'warning');
      return;
    }

    setIsUpdating(true);
    const formData = new FormData();

    if (files.pictureDoc) formData.append('pictureDoc', files.pictureDoc);
    if (files.dniDoc) formData.append('dniDoc', files.dniDoc);
    if (files.votingBallotDoc) formData.append('votingBallotDoc', files.votingBallotDoc);
    if (files.notarizDegreeDoc) formData.append('notarizDegreeDoc', files.notarizDegreeDoc);

    try {
      await axios.put(
        `http://localhost:3000/files/update-personal-documents/${document.id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      showAlert('Documentos actualizados correctamente', 'success');
      onUpdate();
      onClose();
    } catch (error: any) {
      showAlert(error.response?.data?.message || 'Error al actualizar los documentos', 'error');
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
              Foto tamaño carnet (actual: {document.pictureDoc})
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
              Cedula de identidad (actual: {document.dniDoc})
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
              Papeleta de votación (actual: {document.votingBallotDoc})
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
              Título notariado (actual: {document.notarizDegreeDoc})
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