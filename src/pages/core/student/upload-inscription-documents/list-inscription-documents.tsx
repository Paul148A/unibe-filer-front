import React, { useEffect, useState } from "react";
import axios from "axios";
import { InscriptionDocument } from "../../../../interfaces/IInscriptionDocument";
import { useAlert } from "../../../../components/Context/AlertContext";
import UpdateInscriptionDocumentsModal from "./update-personal-documents";
import '../../../../styles/list-documents.css';

const ListInscriptionDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<InscriptionDocument[]>([]);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<InscriptionDocument | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = () => {
    axios
      .get("http://localhost:3000/files/list-inscription-forms")
      .then((res) => setDocuments(res.data.inscriptionForms))
      .catch((err) => console.error("Error al obtener los documentos", err));
  };

  const toggleDropdown = (id: string) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/files/delete-inscription-form/${id}`);
      showAlert("Documentos eliminados correctamente", "success");
      fetchDocuments();
    } catch (error) {
      showAlert("Error al eliminar los documentos", "error");
      console.error("Error al eliminar:", error);
    }
    setShowDropdown(null);
  };

  const handleUpdateClick = (document: InscriptionDocument) => {
    setSelectedDocument(document);
    setShowUpdateModal(true);
    setShowDropdown(null);
  };

  const handleUpdateSuccess = () => {
    fetchDocuments();
    setShowUpdateModal(false);
  };

  return (
    <div className="documents-container">
      <h2 className="documents-title">Lista de Documentos de Inscripción</h2>
      <table className="documents-table">
        <thead>
          <tr>
            <th>Documento de Registro</th>
            <th>Boletín de Notas</th>
            <th>Documento de Reingreso</th>
            <th>Certificado de Inglés</th>
            <th>Certificado de Matrícula</th>
            <th>Documento de Aprobación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="document-row">
              <td>{doc.registrationDoc}</td>
              <td>{doc.semesterGradeChartDoc}</td>
              <td>{doc.reEntryDoc}</td>
              <td>{doc.englishCertificateDoc}</td>
              <td>{doc.enrollmentCertificateDoc}</td>
              <td>{doc.approvalDoc}</td>
              <td className="actions-cell">
                <div className="dropdown-container">
                  <button 
                    className="dropdown-toggle"
                    onClick={() => toggleDropdown(doc.id)}
                  >
                    ⋮
                  </button>
                  {showDropdown === doc.id && (
                    <div className="dropdown-menu">
                      <button 
                        className="dropdown-item"
                        onClick={() => handleUpdateClick(doc)}
                      >
                        Actualizar
                      </button>
                      <button 
                        className="dropdown-item delete"
                        onClick={() => handleDelete(doc.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showUpdateModal && selectedDocument && (
        <UpdateInscriptionDocumentsModal
          document={selectedDocument}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default ListInscriptionDocuments;