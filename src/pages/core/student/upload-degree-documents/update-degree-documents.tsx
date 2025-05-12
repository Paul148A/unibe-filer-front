import React, { useState } from 'react';
import axios from 'axios';
import { IDegreeDocument } from '../../../../interfaces/IDegreeDocument';
import { useAlert } from '../../../../components/Context/AlertContext';
import '../../../../styles/update-documents.css';

interface UpdateDegreeDocumentsModalProps {
  document: IDegreeDocument;
  onClose: () => void;
  onUpdate: () => void;
}

const UpdateDegreeDocumentsModal: React.FC<UpdateDegreeDocumentsModalProps> = ({ 
  document, 
  onClose,
  onUpdate
}) => {
  const [files, setFiles] = useState<{
    topicComplainDoc?: File;
    topicApprovalDoc?: File;
    tutorAssignmentDoc?: File;
    tutorFormatDoc?: File;
    antiplagiarismDoc?: File;
    tutorLetter?: File;
    electiveGrade?: File;
    academicClearance?: File;
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

    if (files.topicComplainDoc) formData.append('topic_complain_doc', files.topicComplainDoc);
    if (files.topicApprovalDoc) formData.append('topic_approval_doc', files.topicApprovalDoc);
    if (files.tutorAssignmentDoc) formData.append('tutor_assignment_doc', files.tutorAssignmentDoc);
    if (files.tutorFormatDoc) formData.append('tutor_format_doc', files.tutorFormatDoc);
    if (files.antiplagiarismDoc) formData.append('antiplagiarism_doc', files.antiplagiarismDoc);
    if (files.tutorLetter) formData.append('tutor_letter', files.tutorLetter);
    if (files.electiveGrade) formData.append('elective_grade', files.electiveGrade);
    if (files.academicClearance) formData.append('academic_clearance', files.academicClearance);

    try {
      await axios.put(
        `http://localhost:3000/files/update-degree/${document.id}`, 
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
        <h2>Actualizar Documentos de Grado</h2>
        <p className="modal-description">Selecciona solo los documentos que deseas actualizar</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.topicComplainDoc}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  topicComplainDoc: prev.topicComplainDoc ? undefined : new File([], '')
                }))}
              />
              Solicitud de Tema (actual: {document.topicComplainDoc})
            </label>
            {files.topicComplainDoc !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('topicComplainDoc')}
                required={!!files.topicComplainDoc}
              />
            )}
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.topicApprovalDoc}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  topicApprovalDoc: prev.topicApprovalDoc ? undefined : new File([], '')
                }))}
              />
              Aprobación de Tema (actual: {document.topicApprovalDoc})
            </label>
            {files.topicApprovalDoc !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('topicApprovalDoc')}
                required={!!files.topicApprovalDoc}
              />
            )}
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.tutorAssignmentDoc}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  tutorAssignmentDoc: prev.tutorAssignmentDoc ? undefined : new File([], '')
                }))}
              />
              Asignación de Tutor (actual: {document.tutorAssignmentDoc})
            </label>
            {files.tutorAssignmentDoc !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('tutorAssignmentDoc')}
                required={!!files.tutorAssignmentDoc}
              />
            )}
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.tutorFormatDoc}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  tutorFormatDoc: prev.tutorFormatDoc ? undefined : new File([], '')
                }))}
              />
              Formato de Tutor (actual: {document.tutorFormatDoc})
            </label>
            {files.tutorFormatDoc !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('tutorFormatDoc')}
                required={!!files.tutorFormatDoc}
              />
            )}
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.antiplagiarismDoc}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  antiplagiarismDoc: prev.antiplagiarismDoc ? undefined : new File([], '')
                }))}
              />
              Antiplagio (actual: {document.antiplagiarismDoc})
            </label>
            {files.antiplagiarismDoc !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('antiplagiarismDoc')}
                required={!!files.antiplagiarismDoc}
              />
            )}
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.tutorLetter}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  tutorLetter: prev.tutorLetter ? undefined : new File([], '')
                }))}
              />
              Carta de Tutor (actual: {document.tutorLetter})
            </label>
            {files.tutorLetter !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('tutorLetter')}
                required={!!files.tutorLetter}
              />
            )}
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.electiveGrade}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  electiveGrade: prev.electiveGrade ? undefined : new File([], '')
                }))}
              />
              Nota Electivo (actual: {document.electiveGrade})
            </label>
            {files.electiveGrade !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('electiveGrade')}
                required={!!files.electiveGrade}
              />
            )}
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.academicClearance}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  academicClearance: prev.academicClearance ? undefined : new File([], '')
                }))}
              />
              Libre de Deuda (actual: {document.academicClearance})
            </label>
            {files.academicClearance !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('academicClearance')}
                required={!!files.academicClearance}
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

export default UpdateDegreeDocumentsModal;