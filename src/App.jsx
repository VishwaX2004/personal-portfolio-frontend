import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import ScrollToTop from "./components/scrollToTop";
import PageTransition from "./components/PageTransition";
import Login from "./pages/login";
import ProjectDetails from "./pages/projectDetails";
import ProjectPage from "./pages/projectPage";
import HomePage from "./pages/homePage";
import AdminRoute from "./components/adminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ProjectsPage from "./pages/admin/ProjectsPage";
import EducationPage from "./pages/admin/EducationPage";
import MessagesPage from "./pages/admin/MessagesPage";

function App() {
  return (
    <>
      {/* Handle page and hash scrolling - only for user pages */}
      <ScrollToTop />

      <AnimatePresence mode="wait">
        <Routes>

          {/* =====================================================
              PUBLIC PAGES (with smooth transitions & scroll to top)
          ====================================================== */}

          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />

          <Route
            path="/projects"
            element={
              <PageTransition>
                <ProjectPage />
              </PageTransition>
            }
          />

          <Route
            path="/projects/:id"
            element={
              <PageTransition>
                <ProjectDetails />
              </PageTransition>
            }
          />

          <Route
            path="/login"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />

          <Route
            path="/admin/login"
            element={
              <PageTransition>
                <AdminLoginPage />
              </PageTransition>
            }
          />


          {/* =====================================================
              PROTECTED ADMIN ROUTES (no transitions, no scroll to top)
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
      </AnimatePresence>
    </>
  );
}

export default App;