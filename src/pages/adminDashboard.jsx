import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Plus,
  Trash2,
  LogOut,
  ExternalLink,
  Eye,
  X,
  ArrowUpRight,
} from "lucide-react";

import toast from "react-hot-toast";

import API from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [loading, setLoading] = useState(true);

  const [showProjectForm, setShowProjectForm] = useState(false);

  const [projectForm, setProjectForm] = useState({
    title: "",
    slug: "",
    description: "",
    image: "",
    category: "MERN Stack",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    status: "Completed",
  });

  // =========================================================
  // AUTH CHECK
  // =========================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    let user = null;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      console.error("Invalid user data in localStorage");
    }

    if (!token || !user?.isAdmin) {
      navigate("/login");
      return;
    }

    fetchData();
  }, []);

  // =========================================================
  // FETCH PROJECTS + MESSAGES
  // =========================================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [projectsResponse, messagesResponse] = await Promise.all([
        API.get("/projects"),
        API.get("/messages", config),
      ]);

      setProjects(projectsResponse.data);
      setMessages(messagesResponse.data);
    } catch (error) {
      console.error(error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
      } else {
        toast.error("Failed to load dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FORM INPUT
  // =========================================================

  const handleProjectChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProjectForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // CREATE PROJECT
  // =========================================================

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const projectData = {
        ...projectForm,

        technologies: projectForm.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await API.post("/projects", projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Project added successfully!");

      setProjectForm({
        title: "",
        slug: "",
        description: "",
        image: "",
        category: "MERN Stack",
        technologies: "",
        githubUrl: "",
        liveUrl: "",
        featured: false,
        status: "Completed",
      });

      setShowProjectForm(false);

      fetchData();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create project"
      );
    }
  };

  // =========================================================
  // DELETE PROJECT
  // =========================================================

  const deleteProject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Project deleted");

      fetchData();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete project");
    }
  };

  // =========================================================
  // DELETE MESSAGE
  // =========================================================

  const deleteMessage = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this message?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Message deleted");

      fetchData();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete message");
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  // =========================================================
  // USER
  // =========================================================

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    user = null;
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-4">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-white/10 hidden lg:flex flex-col">

        {/* Logo */}

        <div className="p-6 border-b border-white/10">

          <Link
            to="/"
            className="text-2xl font-bold"
          >
            VISH
            <span className="text-blue-500">
              .
            </span>
          </Link>

          <p className="text-xs text-gray-600 mt-1">
            ADMIN DASHBOARD
          </p>

        </div>


        {/* Navigation */}

        <nav className="p-4 space-y-2 flex-1">

          {/* Dashboard */}

          <button
            type="button"
            onClick={() =>
              setActiveTab("dashboard")
            }
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
              activeTab === "dashboard"
                ? "bg-blue-600"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <LayoutDashboard size={18} />

            Dashboard
          </button>


          {/* Projects */}

          <button
            type="button"
            onClick={() =>
              setActiveTab("projects")
            }
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
              activeTab === "projects"
                ? "bg-blue-600"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <FolderKanban size={18} />

            Projects

            <span className="ml-auto text-xs">
              {projects.length}
            </span>
          </button>


          {/* Messages */}

          <button
            type="button"
            onClick={() =>
              setActiveTab("messages")
            }
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
              activeTab === "messages"
                ? "bg-blue-600"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <MessageSquare size={18} />

            Messages

            <span className="ml-auto text-xs">
              {messages.length}
            </span>
          </button>

        </nav>


        {/* User */}

        <div className="p-4 border-t border-white/10">

          <div className="px-3 py-3 mb-2">

            <p className="text-sm font-medium truncate">
              {user?.name}
            </p>

            <p className="text-xs text-gray-600 truncate">
              {user?.email}
            </p>

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

              <h1 className="text-xl font-semibold mt-1">

                {activeTab === "dashboard" &&
                  "Dashboard"}

                {activeTab === "projects" &&
                  "Projects"}

                {activeTab === "messages" &&
                  "Messages"}

              </h1>

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

          {/* =================================================
              DASHBOARD TAB
          ================================================== */}

          {activeTab === "dashboard" && (
            <>

              {/* Welcome */}

              <div className="mb-10">

                <h2 className="text-3xl md:text-4xl font-bold">

                  Welcome back,{" "}

                  <span className="text-blue-500">
                    {user?.name}
                  </span>

                </h2>

                <p className="text-gray-500 mt-2">
                  Here's what's happening with
                  your portfolio.
                </p>

              </div>


              {/* Stats */}

              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

                <StatCard
                  title="Total Projects"
                  value={projects.length}
                  icon={
                    <FolderKanban size={20} />
                  }
                />


                <StatCard
                  title="Featured Projects"
                  value={
                    projects.filter(
                      (project) =>
                        project.featured
                    ).length
                  }
                  icon={
                    <Eye size={20} />
                  }
                />


                <StatCard
                  title="Messages"
                  value={messages.length}
                  icon={
                    <MessageSquare size={20} />
                  }
                />


                <StatCard
                  title="Completed"
                  value={
                    projects.filter(
                      (project) =>
                        project.status ===
                        "Completed"
                    ).length
                  }
                  icon={
                    <ArrowUpRight size={20} />
                  }
                />

              </div>


              {/* Recent Projects */}

              <div className="mt-10">

                <div className="flex items-center justify-between mb-5">

                  <h2 className="text-xl font-semibold">
                    Recent Projects
                  </h2>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab("projects")
                    }
                    className="text-sm text-blue-500 hover:text-blue-400"
                  >
                    View all
                  </button>

                </div>


                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                  {projects
                    .slice(0, 3)
                    .map((project) => (
                      <ProjectMiniCard
                        key={project._id}
                        project={project}
                        onDelete={
                          deleteProject
                        }
                      />
                    ))}

                </div>

              </div>

            </>
          )}


          {/* =================================================
              PROJECTS TAB
          ================================================== */}

          {activeTab === "projects" && (
            <>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">

                <div>

                  <h2 className="text-2xl font-bold">
                    Manage Projects
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Add and manage your portfolio
                    projects.
                  </p>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setShowProjectForm(
                      !showProjectForm
                    )
                  }
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center gap-2 transition"
                >

                  {showProjectForm ? (
                    <>
                      <X size={18} />

                      Close
                    </>
                  ) : (
                    <>
                      <Plus size={18} />

                      Add Project
                    </>
                  )}

                </button>

              </div>


              {/* Add Project Form */}

              {showProjectForm && (
                <form
                  onSubmit={
                    handleCreateProject
                  }
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 mb-8"
                >

                  <h3 className="text-xl font-semibold mb-6">
                    Add New Project
                  </h3>


                  <div className="grid md:grid-cols-2 gap-5">

                    {/* Title */}

                    <Input
                      label="Project Title"
                      name="title"
                      value={
                        projectForm.title
                      }
                      onChange={
                        handleProjectChange
                      }
                      placeholder="Metal Garage"
                      required
                    />


                    {/* Slug */}

                    <Input
                      label="Slug"
                      name="slug"
                      value={
                        projectForm.slug
                      }
                      onChange={
                        handleProjectChange
                      }
                      placeholder="metal-garage"
                      required
                    />


                    {/* Category */}

                    <Input
                      label="Category"
                      name="category"
                      value={
                        projectForm.category
                      }
                      onChange={
                        handleProjectChange
                      }
                      placeholder="MERN Stack"
                    />


                    {/* Image */}

                    <Input
                      label="Image URL"
                      name="image"
                      value={
                        projectForm.image
                      }
                      onChange={
                        handleProjectChange
                      }
                      placeholder="/images/projects/project.jpg"
                    />


                    {/* Technologies */}

                    <div className="md:col-span-2">

                      <Input
                        label="Technologies"
                        name="technologies"
                        value={
                          projectForm.technologies
                        }
                        onChange={
                          handleProjectChange
                        }
                        placeholder="React, Node.js, Express, MongoDB"
                      />

                      <p className="text-xs text-gray-600 mt-2">
                        Separate technologies
                        with commas.
                      </p>

                    </div>


                    {/* Description */}

                    <div className="md:col-span-2">

                      <label className="block text-sm text-gray-400 mb-2">
                        Description
                      </label>

                      <textarea
                        name="description"
                        value={
                          projectForm.description
                        }
                        onChange={
                          handleProjectChange
                        }
                        rows="5"
                        required
                        placeholder="Describe your project..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500 transition resize-none"
                      />

                    </div>


                    {/* GitHub URL */}

                    <Input
                      label="GitHub URL"
                      name="githubUrl"
                      value={
                        projectForm.githubUrl
                      }
                      onChange={
                        handleProjectChange
                      }
                      placeholder="https://github.com/..."
                    />


                    {/* Live URL */}

                    <Input
                      label="Live URL"
                      name="liveUrl"
                      value={
                        projectForm.liveUrl
                      }
                      onChange={
                        handleProjectChange
                      }
                      placeholder="https://..."
                    />


                    {/* Status */}

                    <div>

                      <label className="block text-sm text-gray-400 mb-2">
                        Status
                      </label>

                      <select
                        name="status"
                        value={
                          projectForm.status
                        }
                        onChange={
                          handleProjectChange
                        }
                        className="w-full bg-black border border-white/10 rounded-xl p-3.5 outline-none focus:border-blue-500"
                      >

                        <option value="Completed">
                          Completed
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Active">
                          Active
                        </option>

                      </select>

                    </div>


                    {/* Featured */}

                    <label className="flex items-center gap-3 cursor-pointer mt-8">

                      <input
                        type="checkbox"
                        name="featured"
                        checked={
                          projectForm.featured
                        }
                        onChange={
                          handleProjectChange
                        }
                        className="w-4 h-4"
                      />

                      <span className="text-sm text-gray-300">
                        Featured project
                      </span>

                    </label>

                  </div>


                  <button
                    type="submit"
                    className="mt-7 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition"
                  >
                    Create Project
                  </button>

                </form>
              )}


              {/* Project List */}

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                {projects.map((project) => (

                  <ProjectMiniCard
                    key={project._id}
                    project={project}
                    onDelete={
                      deleteProject
                    }
                  />

                ))}

              </div>

            </>
          )}


          {/* =================================================
              MESSAGES TAB
          ================================================== */}

          {activeTab === "messages" && (
            <>

              <div className="mb-8">

                <h2 className="text-2xl font-bold">
                  Contact Messages
                </h2>

                <p className="text-gray-500 mt-1">
                  Messages submitted through
                  your portfolio.
                </p>

              </div>


              {messages.length === 0 ? (

                <div className="border border-white/10 rounded-2xl p-12 text-center">

                  <MessageSquare
                    size={40}
                    className="mx-auto text-gray-700"
                  />

                  <p className="text-gray-500 mt-4">
                    No messages yet.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {messages.map((message) => (

                    <div
                      key={message._id}
                      className="bg-white/[0.03] border border-white/10 rounded-2xl p-6"
                    >

                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">

                        <div className="flex-1">

                          <div className="flex flex-wrap items-center gap-3">

                            <h3 className="font-semibold">
                              {message.name}
                            </h3>

                            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                              {message.email}
                            </span>

                          </div>


                          <h4 className="text-lg font-medium mt-4">
                            {message.subject}
                          </h4>


                          <p className="text-gray-400 mt-3 leading-relaxed">
                            {message.message}
                          </p>


                          <p className="text-xs text-gray-600 mt-5">

                            {new Date(
                              message.createdAt
                            ).toLocaleString()}

                          </p>

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            deleteMessage(
                              message._id
                            )
                          }
                          className="self-start p-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </>
          )}

        </div>

      </main>

    </div>
  );
}


// =============================================================
// STAT CARD
// =============================================================

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">

      <div className="flex items-center justify-between">

        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
          {icon}
        </div>

        <ArrowUpRight
          size={18}
          className="text-gray-700"
        />

      </div>

      <p className="text-gray-500 text-sm mt-6">
        {title}
      </p>

      <p className="text-3xl font-bold mt-1">
        {value}
      </p>

    </div>
  );
}


// =============================================================
// INPUT COMPONENT
// =============================================================

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>

      <label className="block text-sm text-gray-400 mb-2">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 outline-none focus:border-blue-500 transition"
      />

    </div>
  );
}


// =============================================================
// PROJECT MINI CARD
// =============================================================

function ProjectMiniCard({
  project,
  onDelete,
}) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden group">

      {/* Image */}

      <div className="aspect-video bg-black overflow-hidden">

        {project.image ? (

          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />

        ) : (

          <div className="w-full h-full flex items-center justify-center text-gray-700">

            <FolderKanban size={35} />

          </div>

        )}

      </div>


      {/* Content */}

      <div className="p-5">

        <div className="flex justify-between gap-3">

          <div>

            <p className="text-blue-500 text-xs font-medium">
              {project.category}
            </p>

            <h3 className="text-lg font-semibold mt-1">
              {project.title}
            </h3>

          </div>


          {project.featured && (

            <span className="text-[10px] px-2 py-1 h-fit rounded-full bg-blue-500/10 text-blue-400">
              FEATURED
            </span>

          )}

        </div>


        <p className="text-gray-500 text-sm mt-3 line-clamp-2">
          {project.description}
        </p>


        {/* Technologies */}

        <div className="flex flex-wrap gap-1.5 mt-4">

          {project.technologies
            ?.slice(0, 4)
            .map((tech) => (

              <span
                key={tech}
                className="text-[10px] px-2 py-1 bg-white/5 rounded-md text-gray-400"
              >
                {tech}
              </span>

            ))}

        </div>


        {/* Footer */}

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">

          <span className="text-xs text-gray-600">
            {project.status}
          </span>


          <div className="flex items-center gap-1">

            {/* =================================================
                GITHUB - INLINE SVG
            ================================================== */}

            {project.githubUrl && (

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className="p-2 text-gray-500 hover:text-white transition"
              >

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >

                  <path
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.621.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.944 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682 0 3.844-2.339 4.688-4.566 4.936.359.309.678.92.678 1.855 0 1.338-.012 2.417-.012 2.746 0 .267.18.579.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z"
                  />

                </svg>

              </a>

            )}


            {/* Live URL */}

            {project.liveUrl && (

              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Live project"
                title="Live project"
                className="p-2 text-gray-500 hover:text-white transition"
              >

                <ExternalLink size={16} />

              </a>

            )}


            {/* Delete */}

            <button
              type="button"
              onClick={() =>
                onDelete(project._id)
              }
              aria-label="Delete project"
              title="Delete project"
              className="p-2 text-gray-500 hover:text-red-400 transition"
            >

              <Trash2 size={16} />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

