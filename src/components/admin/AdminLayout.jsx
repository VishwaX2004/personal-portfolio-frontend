import { useState } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  GraduationCap,
  LogOut,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { clearAdminToken } from "../../utils/adminAuth";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminUsername, setAdminUsername] = useState("Admin");

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    clearAdminToken();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  // =========================================================
  // DETERMINE ACTIVE TAB FROM URL
  // =========================================================

  const getActiveTab = () => {
    const path = location.pathname;

    if (path === "/admin" || path === "/admin/dashboard") {
      return "dashboard";
    }

    if (path === "/admin/projects") {
      return "projects";
    }

    if (path === "/admin/education") {
      return "education";
    }

    if (path === "/admin/messages") {
      return "messages";
    }

    return "dashboard";
  };

  const activeTab = getActiveTab();

  // =========================================================
  // GET TAB TITLE
  // =========================================================

  const getTabTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "projects":
        return "Projects";
      case "education":
        return "Education";
      case "messages":
        return "Messages";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-white/10 hidden lg:flex flex-col">
        {/* Logo */}

        <div className="p-6 border-b border-white/10">
          <Link to="/" className="text-2xl font-bold">
            VISH
            <span className="text-blue-500">.</span>
          </Link>

          <p className="text-xs text-gray-600 mt-1">ADMIN DASHBOARD</p>
        </div>

        {/* Navigation */}

        <nav className="p-4 space-y-2 flex-1">
          {/* Dashboard */}

          <Link
            to="/admin/dashboard"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
              activeTab === "dashboard"
                ? "bg-blue-600"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          {/* Projects */}

          <Link
            to="/admin/projects"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
              activeTab === "projects"
                ? "bg-blue-600"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <FolderKanban size={18} />
            Projects
          </Link>

          {/* Education */}

          <Link
            to="/admin/education"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
              activeTab === "education"
                ? "bg-blue-600"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <GraduationCap size={18} />
            Education
          </Link>

          {/* Messages */}

          <Link
            to="/admin/messages"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
              activeTab === "messages"
                ? "bg-blue-600"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <MessageSquare size={18} />
            Messages
          </Link>
        </nav>

        {/* User */}

        <div className="p-4 border-t border-white/10">
          <div className="px-3 py-3 mb-2">
            <p className="text-sm font-medium truncate">{adminUsername}</p>

            <p className="text-xs text-gray-600 truncate">Admin Account</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="lg:ml-64 min-h-screen">
        {/* Header */}

        <header className="sticky top-0 z-30 bg-[#050505]/90 backdrop-blur-xl border-b border-white/10">
          <div className="px-6 md:px-10 py-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-500 font-semibold tracking-widest">
                ADMIN PANEL
              </p>

              <h1 className="text-xl font-semibold mt-1">{getTabTitle()}</h1>
            </div>

            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
            >
              View Portfolio
              <ExternalLink size={16} />
            </Link>
          </div>
        </header>

        {/* Content */}

        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
