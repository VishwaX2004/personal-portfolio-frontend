import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // =========================================================
  // NO LOGIN
  // =========================================================

  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  // =========================================================
  // GET USER
  // =========================================================

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  // =========================================================
  // NOT ADMIN
  // =========================================================

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // =========================================================
  // ADMIN
  // =========================================================

  return <Outlet />;
}