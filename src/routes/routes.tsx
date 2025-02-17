import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "../components/Auth/auth";
import Login from "../pages/auth/login/login";
import AdminDashboard from "../pages/core/admin/admin-dashboard/admin-dashboard";
import StudentDashboard from "../pages/core/student/student-dashboard/student-dashboard";
import Unauthorized from "../components/Unauthorized/unauthorized";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route element={<Auth allowedRoles={["admin"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<Auth allowedRoles={["student"]} />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
