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

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin */}
        <Route element={<Template />}>
          <Route element={<Auth allowedRoles={["admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>
          
        {/* Student */}
          <Route element={<Auth allowedRoles={["student"]} />}>
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/upload-inscription-documents" element={<UploadInscriptionDocuments />} />
            <Route path="/upload-personal-documents" element={<UploadPersonalDocuments />} />
            <Route path="/upload-degree-documents" element={<UploadDegreeDocuments />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
