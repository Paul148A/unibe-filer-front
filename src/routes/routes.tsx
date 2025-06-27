import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "../components/Auth/auth";
import Login from "../pages/auth/login/login";
import AdminDashboard from "../pages/core/admin/admin-dashboard/admin-dashboard";
import StudentDashboard from "../pages/core/student/student-dashboard/student-dashboard";
import Unauthorized from "../components/Unauthorized/unauthorized";
import Template from "../template/template";
import UploadInscriptionDocuments from "../pages/core/student/upload-inscription-documents/upload-inscription-documents";
import UploadPersonalDocuments from "../pages/core/student/upload-personal-documents/upload-personal-documents";
import UploadDegreeDocuments from "../pages/core/student/upload-degree-documents/upload-degree-documents";
import ListPersonalDocuments from "../pages/core/student/upload-personal-documents/list-personal-documents";
import ListInscriptionDocuments from "../pages/core/student/upload-inscription-documents/list-inscription-documents";
import ListDegreeDocuments from "../pages/core/student/upload-degree-documents/list-degree-documents";
import StudentForm from "../pages/core/admin/manage-students/students-form";
import StudentsList from "../pages/core/admin/manage-students/students-list";
import RecordsList from "../pages/core/admin/records/records-list";
import LanguageDashboard from "../pages/core/language/language-dashboard/language-dashboard";
import RecordPage from "../pages/core/admin/records/record-page";
import CertificaList from "../pages/core/language/manage-certificates/certificates-list";
import CertificatePage from "../pages/core/language/manage-certificates/certificates-page";
import TeacherDashboard from "../pages/core/teacher/teacher-dashboard/teacher-dashboard";
import UploadPermissionDocuments from "../pages/core/teacher/manage-permissions/upload-permission-documents";
import ListPermissionDocuments from "../pages/core/teacher/manage-permissions/list-permission-documents";
import UpdatePermissionDocuments from "../pages/core/teacher/manage-permissions/update-permission-documents";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin */}
        <Route element={<Template />}>
          <Route element={<Auth allowedRoles={["admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            {/* Rutas manejo de estudiantes */}
            <Route path="/students-form" element={<StudentForm />} />
            <Route path="/students-list" element={<StudentsList />} />

            {/* Rutas expedientes estudiantiles */}
            <Route path="/records-list" element={<RecordsList />} />
            <Route path="/records-page/:id" element={<RecordPage />} />
          </Route>
          
        {/* Student */}
          <Route element={<Auth allowedRoles={["student"]} />}>
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            
            {/* Rutas documentos de inscripcion */}
            <Route path="/upload-inscription-documents" element={<UploadInscriptionDocuments />} />
            <Route path="/list-inscription-documents" element={<ListInscriptionDocuments />} />
            
            {/* Rutas documentos de grado */}
            <Route path="/upload-degree-documents" element={<UploadDegreeDocuments />} />
            <Route path="/list-degree-documents" element={<ListDegreeDocuments />} />
            
            {/* Rutas documentos personales */}
            <Route path="/upload-personal-documents" element={<UploadPersonalDocuments />} />
            <Route path="/list-personal-documents" element={<ListPersonalDocuments />} />
          </Route>

        {/* Language */}
          <Route element={<Auth allowedRoles={["language"]} />}>
            <Route path="/language-dashboard" element={<LanguageDashboard />} />
            <Route path="/certificates-language-list" element={<CertificaList />} />
            <Route path="/certificates-language-page/:id" element={<CertificatePage />} />
          </Route>

        {/* Teacher */}
          <Route element={<Auth allowedRoles={["teacher"]} />}>
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            
            {/* Rutas manejo de permisos */}
            <Route path="/teacher/manage-permissions/upload-permission-documents" element={<UploadPermissionDocuments />} />
            <Route path="/teacher/manage-permissions/list-permission-documents" element={<ListPermissionDocuments />} />
            <Route path="/teacher/manage-permissions/update-permission-documents/:id" element={<UpdatePermissionDocuments />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
