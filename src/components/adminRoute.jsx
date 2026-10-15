import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {

  const adminToken = localStorage.getItem("adminToken");

  // =========================================================
  // NO ADMIN LOGIN
  // =========================================================

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  // =========================================================
  // ADMIN AUTHENTICATED
  // =========================================================

  return <Outlet />;
}