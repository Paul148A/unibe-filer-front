import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "../components/Auth/auth";
import Login from "../pages/auth/login/login";
import AdminDashboard from "../pages/core/admin/admin-dashboard/admin-dashboard";
import StudentDashboard from "../pages/core/student/student-dashboard/student-dashboard";
import Unauthorized from "../components/Unauthorized/unauthorized";
import Template from "../template/template";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route element={<Auth allowedRoles={["admin"]} />}>
          <Route element={<Template />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        <Route element={<Auth allowedRoles={["student"]} />}>
          <Route element={<Template />}>
            <Route path="/student-dashboard" element={<StudentDashboard />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
