import { Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/scrollToTop";
import Login from "./pages/login";
import ProjectDetails from "./pages/projectDetails";
import ProjectPage from "./pages/projectPage";
import HomePage from "./pages/homePage";
import AdminDashboard from "./pages/adminDashboard";
import AdminRoute from "./components/adminRoute";

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
            element={<AdminDashboard />}
          />

        </Route>

      </Routes>
    </>
  );
}

export default App;