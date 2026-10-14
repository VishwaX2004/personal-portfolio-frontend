import { Routes, Route, Navigate } from "react-router-dom";

import ScrollToTop from "./components/scrollToTop";
import Login from "./pages/login";
import ProjectDetails from "./pages/projectDetails";
import ProjectPage from "./pages/projectPage";
import HomePage from "./pages/homePage";
import AdminRoute from "./components/adminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import ProjectsPage from "./pages/admin/ProjectsPage";
import EducationPage from "./pages/admin/EducationPage";
import MessagesPage from "./pages/admin/MessagesPage";

function App() {
  return (
    <>
      {/* Handle page and hash scrolling */}
      <ScrollToTop />

      <Routes>

        {/* =====================================================
            PUBLIC PAGES
        ====================================================== */}

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/projects"
          element={<ProjectPage />}
        />

        <Route
          path="/projects/:id"
          element={<ProjectDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =====================================================
            PROTECTED ADMIN ROUTES
        ====================================================== */}

        <Route element={<AdminRoute />}>

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            <Route
              index
              element={<Navigate to="/admin/dashboard" replace />}
            />

            <Route
              path="dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="projects"
              element={<ProjectsPage />}
            />

            <Route
              path="education"
              element={<EducationPage />}
            />

            <Route
              path="messages"
              element={<MessagesPage />}
            />

          </Route>

        </Route>

      </Routes>
    </>
  );
}

export default App;