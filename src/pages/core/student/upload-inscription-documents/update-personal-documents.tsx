import React, { useState } from 'react';
import axios from 'axios';
import { InscriptionDocument } from '../../../../interfaces/IInscriptionDocument';
import { useAlert } from '../../../../components/Context/AlertContext';
import '../../../../styles/update-documents.css';

interface UpdateInscriptionDocumentsModalProps {
  document: InscriptionDocument;
  onClose: () => void;
  onUpdate: () => void;
}

const UpdateInscriptionDocumentsModal: React.FC<UpdateInscriptionDocumentsModalProps> = ({ 
  document, 
  onClose,
  onUpdate
}) => {
  const [files, setFiles] = useState<{
    registrationDoc?: File;
    semesterGradeChartDoc?: File;
    reEntryDoc?: File;
    englishCertificateDoc?: File;
    enrollmentCertificateDoc?: File;
    approvalDoc?: File;
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

    if (files.registrationDoc) formData.append('registration_doc', files.registrationDoc);
    if (files.semesterGradeChartDoc) formData.append('semester_grade_chart_doc', files.semesterGradeChartDoc);
    if (files.reEntryDoc) formData.append('re_entry_doc', files.reEntryDoc);
    if (files.englishCertificateDoc) formData.append('english_certificate_doc', files.englishCertificateDoc);
    if (files.enrollmentCertificateDoc) formData.append('enrollment_certificate_doc', files.enrollmentCertificateDoc);
    if (files.approvalDoc) formData.append('approval_doc', files.approvalDoc);

    try {
      await axios.put(
        `http://localhost:3000/files/update-inscription-form/${document.id}`, 
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
        <h2>Actualizar Documentos de Inscripción</h2>
        <p className="modal-description">Selecciona solo los documentos que deseas actualizar</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.registrationDoc}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  registrationDoc: prev.registrationDoc ? undefined : new File([], '')
                }))}
              />
              Documento de Registro (actual: {document.registrationDoc})
            </label>
            {files.registrationDoc !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('registrationDoc')}
                required={!!files.registrationDoc}
              />
            )}
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.semesterGradeChartDoc}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  semesterGradeChartDoc: prev.semesterGradeChartDoc ? undefined : new File([], '')
                }))}
              />
              Boletín de Notas (actual: {document.semesterGradeChartDoc})
            </label>
            {files.semesterGradeChartDoc !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('semesterGradeChartDoc')}
                required={!!files.semesterGradeChartDoc}
              />
            )}
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.reEntryDoc}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  reEntryDoc: prev.reEntryDoc ? undefined : new File([], '')
                }))}
              />
              Documento de Reingreso (actual: {document.reEntryDoc})
            </label>
            {files.reEntryDoc !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('reEntryDoc')}
                required={!!files.reEntryDoc}
              />
            )}
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.englishCertificateDoc}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  englishCertificateDoc: prev.englishCertificateDoc ? undefined : new File([], '')
                }))}
              />
              Certificado de Inglés (actual: {document.englishCertificateDoc})
            </label>
            {files.englishCertificateDoc !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('englishCertificateDoc')}
                required={!!files.englishCertificateDoc}
              />
            )}
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.enrollmentCertificateDoc}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  enrollmentCertificateDoc: prev.enrollmentCertificateDoc ? undefined : new File([], '')
                }))}
              />
              Certificado de Matrícula (actual: {document.enrollmentCertificateDoc})
            </label>
            {files.enrollmentCertificateDoc !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('enrollmentCertificateDoc')}
                required={!!files.enrollmentCertificateDoc}
              />
            )}
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={!!files.approvalDoc}
                onChange={() => setFiles(prev => ({
                  ...prev,
                  approvalDoc: prev.approvalDoc ? undefined : new File([], '')
                }))}
              />
              Documento de Aprobación (actual: {document.approvalDoc})
            </label>
            {files.approvalDoc !== undefined && (
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange('approvalDoc')}
                required={!!files.approvalDoc}
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

export default UpdateInscriptionDocumentsModal;