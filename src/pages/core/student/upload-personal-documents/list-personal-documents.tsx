import React, { useEffect, useState } from "react";
import axios from "axios";
import { PersonalDocument } from "../../../../interfaces/IPersonalDocument";
import { useAlert } from "../../../../components/Context/AlertContext";
import UpdatePersonalDocumentsModal from "./update-personal-documents";
import '../../../../styles/list-documents.css';

const ListPersonalDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<PersonalDocument[]>([]);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<PersonalDocument | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = () => {
    axios
      .get("http://localhost:3000/files/list-personal-documents")
      .then((res) => setDocuments(res.data.personalDocuments))
      .catch((err) => console.error("Error al obtener los documentos", err));
  };

  const toggleDropdown = (id: string) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/files/delete-personal-documents/${id}`);
      showAlert("Documentos eliminados correctamente", "success");
      fetchDocuments();
    } catch (error) {
      showAlert("Error al eliminar los documentos", "error");
      console.error("Error al eliminar:", error);
    }
    setShowDropdown(null);
  };

  const handleUpdateClick = (document: PersonalDocument) => {
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
      <h2 className="documents-title">Lista de Documentos Personales</h2>
      <table className="documents-table">
        <thead>
          <tr>
            <th>Foto Carnet</th>
            <th>Cedula de Identidad</th>
            <th>Papeleta de votacion</th>
            <th>Título Notariado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="document-row">
              <td>{doc.pictureDoc}</td>
              <td>{doc.dniDoc}</td>
              <td>{doc.votingBallotDoc}</td>
              <td>{doc.notarizDegreeDoc}</td>
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
        <UpdatePersonalDocumentsModal
          document={selectedDocument}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default ListPersonalDocuments;