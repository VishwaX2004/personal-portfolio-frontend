import { useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import ScrollToTop from "./components/scrollToTop";

import Home from "./pages/homePage";
import ProjectsPage from "./pages/projectPage";
import ProjectDetails from "./pages/projectDetails";
import Login from "./pages/login";
import AdminDashboard from "./pages/adminDashboard";
import AdminRoute from "./components/adminRoute";



function App() {

  const location = useLocation();

  // =========================================================
  // HANDLE HOME PAGE HASH NAVIGATION
  // =========================================================

  useEffect(() => {

    if (location.pathname !== "/") {
      return;
    }

    if (!location.hash) {
      return;
    }

    const sectionId = location.hash.substring(1);

    const timer = setTimeout(() => {

      const section = document.getElementById(sectionId);

      if (!section) {
        return;
      }

      const headerHeight = 80;

      const sectionTop =
        section.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: sectionTop,
        behavior: "smooth",
      });

    }, 100);

    return () => clearTimeout(timer);

  }, [
    location.pathname,
    location.hash,
  ]);


  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* =====================================================
            PUBLIC PAGES
        ====================================================== */}

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