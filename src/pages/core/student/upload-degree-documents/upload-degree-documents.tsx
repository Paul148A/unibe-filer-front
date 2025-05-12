import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../../../components/Context/AlertContext';
import '../../../../styles/upload-documents.css';

const UploadDegreeDocuments: React.FC = () => {
  const [topicComplainDoc, setTopicComplainDoc] = useState<File | null>(null);
  const [topicApprovalDoc, setTopicApprovalDoc] = useState<File | null>(null);
  const [tutorAssignmentDoc, setTutorAssignmentDoc] = useState<File | null>(null);
  const [tutorFormatDoc, setTutorFormatDoc] = useState<File | null>(null);
  const [antiplagiarismDoc, setAntiplagiarismDoc] = useState<File | null>(null);
  const [tutorLetter, setTutorLetter] = useState<File | null>(null);
  const [electiveGrade, setElectiveGrade] = useState<File | null>(null);
  const [academicClearance, setAcademicClearance] = useState<File | null>(null);
  const [message] = useState('');
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topicComplainDoc || !topicApprovalDoc || !tutorAssignmentDoc || 
        !tutorFormatDoc || !antiplagiarismDoc || !tutorLetter || 
        !electiveGrade || !academicClearance) {
      showAlert('Debes subir todos los archivos requeridos', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('topic_complain_doc', topicComplainDoc);
    formData.append('topic_approval_doc', topicApprovalDoc);
    formData.append('tutor_assignment_doc', tutorAssignmentDoc);
    formData.append('tutor_format_doc', tutorFormatDoc);
    formData.append('antiplagiarism_doc', antiplagiarismDoc);
    formData.append('tutor_letter', tutorLetter);
    formData.append('elective_grade', electiveGrade);
    formData.append('academic_clearance', academicClearance);

    try {
      const response = await axios.post('http://localhost:3000/files/upload-degree', formData);
      showAlert(response.data.message, 'success');
      setTimeout(() => {
        navigate('/list-degree-documents');
      }, 1500);
    } catch (error: any) {
      showAlert(error.response?.data?.message || 'Error al subir los documentos', 'error');
    }
  };

  return (
    <div className="upload-documents-container">
      <h2 className="upload-documents-title">Subir Documentos de Grado</h2>
      <form className="upload-documents-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Solicitud de Tema:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setTopicComplainDoc(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <div className="form-group">
          <label>Aprobación de Tema:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setTopicApprovalDoc(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <div className="form-group">
          <label>Asignación de Tutor:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setTutorAssignmentDoc(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <div className="form-group">
          <label>Formato de Tutor:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setTutorFormatDoc(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <div className="form-group">
          <label>Antiplagio:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setAntiplagiarismDoc(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <div className="form-group">
          <label>Carta de Tutor:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setTutorLetter(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <div className="form-group">
          <label>Nota Electivo:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setElectiveGrade(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <div className="form-group">
          <label>Libre de Deuda:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setAcademicClearance(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <button type="submit" className="submit-button">Subir Documentos</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default UploadDegreeDocuments;