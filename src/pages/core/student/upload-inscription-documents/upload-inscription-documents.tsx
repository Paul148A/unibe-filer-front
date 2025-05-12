import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../../../components/Context/AlertContext';
import '../../../../styles/upload-documents.css';

const UploadInscriptionDocuments: React.FC = () => {
  const [registrationDoc, setRegistrationDoc] = useState<File | null>(null);
  const [semesterGradeChartDoc, setSemesterGradeChartDoc] = useState<File | null>(null);
  const [reEntryDoc, setReEntryDoc] = useState<File | null>(null);
  const [englishCertificateDoc, setEnglishCertificateDoc] = useState<File | null>(null);
  const [enrollmentCertificateDoc, setEnrollmentCertificateDoc] = useState<File | null>(null);
  const [approvalDoc, setApprovalDoc] = useState<File | null>(null);
  const [message] = useState('');
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registrationDoc || !semesterGradeChartDoc || !reEntryDoc || 
        !englishCertificateDoc || !enrollmentCertificateDoc || !approvalDoc) {
      showAlert('Debes subir todos los archivos requeridos', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('registration_doc', registrationDoc);
    formData.append('semester_grade_chart_doc', semesterGradeChartDoc);
    formData.append('re_entry_doc', reEntryDoc);
    formData.append('english_certificate_doc', englishCertificateDoc);
    formData.append('enrollment_certificate_doc', enrollmentCertificateDoc);
    formData.append('approval_doc', approvalDoc);

    try {
      const response = await axios.post('http://localhost:3000/files/upload-inscription-form', formData);
      showAlert(response.data.message, 'success');
      setTimeout(() => {
        navigate('/list-inscription-documents');
      }, 1500);
    } catch (error: any) {
      showAlert(error.response?.data?.message || 'Error al subir los documentos', 'error');
    }
  };

  return (
    <div className="upload-documents-container">
      <h2 className="upload-documents-title">Subir Documentos de Inscripción</h2>
      <form className="upload-documents-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Documento de Registro:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setRegistrationDoc(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <div className="form-group">
          <label>Boletín de Notas:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setSemesterGradeChartDoc(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <div className="form-group">
          <label>Documento de Reingreso:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setReEntryDoc(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <div className="form-group">
          <label>Certificado de Inglés:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setEnglishCertificateDoc(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <div className="form-group">
          <label>Certificado de Matrícula:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setEnrollmentCertificateDoc(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <div className="form-group">
          <label>Documento de Aprobación:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setApprovalDoc(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <button type="submit" className="submit-button">Subir Documentos</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default UploadInscriptionDocuments;