import React, { useEffect, useState } from "react";
import axios from "axios";
import { IDegreeDocument } from "../../../../interfaces/IDegreeDocument";
import { useAlert } from "../../../../components/Context/AlertContext";
import UpdateDegreeDocumentsModal from "./update-degree-documents";
import '../../../../styles/list-documents.css';

const ListDegreeDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<IDegreeDocument[]>([]);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<IDegreeDocument | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = () => {
    axios
      .get("http://localhost:3000/files/list-degrees")
      .then((res) => setDocuments(res.data.degrees))
      .catch((err) => console.error("Error al obtener los documentos", err));
  };

  const toggleDropdown = (id: string) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/files/delete-degree/${id}`);
      showAlert("Documentos eliminados correctamente", "success");
      fetchDocuments();
    } catch (error) {
      showAlert("Error al eliminar los documentos", "error");
      console.error("Error al eliminar:", error);
    }
    setShowDropdown(null);
  };

  const handleUpdateClick = (document: IDegreeDocument) => {
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
      <h2 className="documents-title">Lista de Documentos de Grado</h2>
      <table className="documents-table">
        <thead>
          <tr>
            <th>Solicitud de Tema</th>
            <th>Aprobación de Tema</th>
            <th>Asignación de Tutor</th>
            <th>Formato de Tutor</th>
            <th>Antiplagio</th>
            <th>Carta de Tutor</th>
            <th>Nota Electivo</th>
            <th>Libre de Deuda</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="document-row">
              <td>{doc.topicComplainDoc}</td>
              <td>{doc.topicApprovalDoc}</td>
              <td>{doc.tutorAssignmentDoc}</td>
              <td>{doc.tutorFormatDoc}</td>
              <td>{doc.antiplagiarismDoc}</td>
              <td>{doc.tutorLetter}</td>
              <td>{doc.electiveGrade}</td>
              <td>{doc.academicClearance}</td>
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
        <UpdateDegreeDocumentsModal
          document={selectedDocument}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default ListDegreeDocuments;