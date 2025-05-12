import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../../../components/Context/AlertContext';
import '../../../../styles/upload-documents.css';

const UploadPersonalDocuments: React.FC = () => {
  const [pictureDoc, setPictureDoc] = useState<File | null>(null);
  const [dniDoc, setDniDoc] = useState<File | null>(null);
  const [votingBallotDoc, setVotingBallotDoc] = useState<File | null>(null);
  const [notarizDegreeDoc, setNotarizDegreeDoc] = useState<File | null>(null);
  const [message] = useState('');
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pictureDoc || !dniDoc || !votingBallotDoc || !notarizDegreeDoc) {
      showAlert('Debes subir exactamente los 4 archivos requeridos', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('files', pictureDoc);
    formData.append('files', dniDoc);
    formData.append('files', votingBallotDoc);
    formData.append('files', notarizDegreeDoc);

    try {
      const response = await axios.post('http://localhost:3000/files/upload-personal-documents', formData);
      showAlert(response.data.message, 'success');
      setTimeout(() => {
        navigate('/list-personal-documents');
      }, 1500);
    } catch (error: any) {
      showAlert(error.response?.data?.message || 'Error al subir los documentos', 'error');
    }
  };

  return (
    <div className="upload-documents-container">
      <h2 className="upload-documents-title">Subir Documentos Personales</h2>
      <form className="upload-documents-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Foto tamaño carnet:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setPictureDoc(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <div className="form-group">
          <label>Cedula de identidad:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setDniDoc(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <div className="form-group">
          <label>Papeleta de votación:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setVotingBallotDoc(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <div className="form-group">
          <label>Título notariado:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setNotarizDegreeDoc(e.target.files?.[0] || null)} 
            className="file-input"
          />
        </div>
        <button type="submit" className="submit-button">Subir Documentos</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default UploadPersonalDocuments;