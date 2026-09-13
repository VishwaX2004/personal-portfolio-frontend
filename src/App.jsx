import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/scrollToTop";
import Home from "./pages/homePage";
import ProjectsPage from "./pages/projectPage";
import ProjectDetails from "./pages/projectDetails";
import Login from "./pages/login";
import AdminDashboard from "./pages/adminDashboard";







function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* Public Pages */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/projects"
          element={<ProjectsPage />}
        />

        <Route
          path="/projects/:id"
          element={<ProjectDetails />}
        />


        {/* Admin Pages */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>
    </>
  );
}

export default App;