import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Eye,
  MessageSquare,
  ArrowUpRight,
  Trash2,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getProjects,
  deleteProject,
  getEducation,
  getMessages,
} from "../../services/api";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH DATA
  // =========================================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [projectsData, educationData, messagesData] = await Promise.all([
        getProjects(),
        getEducation().catch(() => []), // Education endpoint may not exist yet
        getMessages().catch(() => []),
      ]);

      setProjects(projectsData || []);
      setEducation(educationData || []);
      setMessages(messagesData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================================================
  // DELETE PROJECT
  // =========================================================

  const handleDeleteProject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProject(id);
      toast.success("Project deleted");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project");
    }
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    user = null;
  }

  return (
    <>
      {/* Welcome */}

      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">
          Welcome back,{" "}
          <span className="text-blue-500">{user?.name || "Admin"}</span>
        </h2>

        <p className="text-gray-500 mt-2">
          Here's what's happening with your portfolio.
        </p>
      </div>

      {/* Stats */}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Projects"
          value={projects.length}
          icon={<FolderKanban size={20} />}
        />

        <StatCard
          title="Featured Projects"
          value={projects.filter((p) => p.featured).length}
          icon={<Eye size={20} />}
        />

        <StatCard
          title="Education"
          value={education.length}
          icon={<GraduationCap size={20} />}
        />

        <StatCard
          title="Messages"
          value={messages.length}
          icon={<MessageSquare size={20} />}
        />
      </div>

      {/* Recent Projects */}

      <div className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">Recent Projects</h2>

          <Link
            to="/admin/projects"
            className="text-sm text-blue-500 hover:text-blue-400"
          >
            View all
          </Link>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.slice(0, 3).map((project) => (
            <ProjectMiniCard
              key={project._id}
              project={project}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// =============================================================
// STAT CARD
// =============================================================

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
          {icon}
        </div>

        <ArrowUpRight size={18} className="text-gray-700" />
      </div>

      <p className="text-gray-500 text-sm mt-6">{title}</p>

      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

// =============================================================
// PROJECT MINI CARD
// =============================================================

function ProjectMiniCard({ project, onDelete }) {
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

            <h3 className="text-lg font-semibold mt-1">{project.title}</h3>
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
          {project.technologies?.slice(0, 4).map((tech) => (
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
          <span className="text-xs text-gray-600">{project.status}</span>

          <div className="flex items-center gap-1">
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
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.621.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.944 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682 0 3.844-2.339 4.688-4.566 4.936.359.309.678.92.678 1.855 0 1.338-.012 2.417-.012 2.746 0 .267.18.579.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z" />
                </svg>
              </a>
            )}

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

            <button
              type="button"
              onClick={() => onDelete(project._id)}
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
