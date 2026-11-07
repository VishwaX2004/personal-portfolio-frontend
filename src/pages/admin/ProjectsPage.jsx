import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, ExternalLink, FolderKanban } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  getAdminProjects,
  deleteAdminProject,
} from "../../services/adminService";
import ProjectFormModal from "../../components/admin/ProjectFormModal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getAdminProjects();
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await deleteAdminProject(id);
      toast.success("Project deleted");
      fetchProjects();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project");
    }
  };

  const handleOpenForm = (project = null) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleFormSuccess = () => {
    fetchProjects();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-3xl font-bold">Manage Projects</h2>
          <p className="text-gray-400 mt-2">
            Create, edit, and manage your portfolio projects with images.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => handleOpenForm()}
          className="px-6 py-3 bg-gradient-to-r from-[#6c63ff] to-[#5a52d5] hover:from-[#7a72ff] hover:to-[#6860e0] rounded-xl flex items-center justify-center gap-2 transition font-semibold text-white"
        >
          <Plus size={20} />
          Add New Project
        </motion.button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full flex flex-col items-center justify-center py-20 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl"
        >
          <FolderKanban size={48} className="text-gray-600 mb-4" />
          <p className="text-gray-400 text-center mb-6">
            No projects yet. Add your first project to get started.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenForm()}
            className="px-4 py-2 bg-[#6c63ff] hover:bg-[#5a52d5] rounded-lg text-white font-medium transition"
          >
            Create First Project
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {projects.map((project, index) => (
            <AdminProjectCard
              key={project._id}
              project={project}
              index={index}
              onEdit={() => handleOpenForm(project)}
              onDelete={() => handleDeleteProject(project._id)}
            />
          ))}
        </motion.div>
      )}

      {/* Form Modal */}
      <ProjectFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        project={editingProject}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}

function AdminProjectCard({ project, index, onEdit, onDelete }) {
  const coverImage =
    project.coverImage || project.image || project.images?.[0] || "";

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover={{ y: -4 }}
      className="group bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-[#6c63ff]/40 transition-all"
    >
      {/* Image */}
      <div className="aspect-video bg-black overflow-hidden relative">
        {coverImage ? (
          <>
            <motion.img
              src={coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700">
            <FolderKanban size={35} />
          </div>
        )}

        {/* Status Badge */}
        {project.status && (
          <div className="absolute top-3 left-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                project.status === "completed"
                  ? "bg-green-500/30 text-green-200"
                  : project.status === "in-progress"
                  ? "bg-yellow-500/30 text-yellow-200"
                  : "bg-gray-500/30 text-gray-200"
              }`}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-500/30 text-orange-200 backdrop-blur-sm">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title & Category */}
        <div>
          <p className="text-[#6c63ff] text-xs font-medium uppercase tracking-wider">
            {project.category}
          </p>
          <h3 className="text-lg font-semibold mt-2 text-white group-hover:text-[#6c63ff] transition">
            {project.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mt-3 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.technologies?.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-1 bg-[#6c63ff]/20 border border-[#6c63ff]/30 rounded-md text-[#a89bff]"
            >
              {tech}
            </span>
          ))}
          {project.technologies && project.technologies.length > 3 && (
            <span className="text-xs px-2 py-1 bg-white/10 rounded-md text-gray-400">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
          <span className="text-xs text-gray-500">
            {project.images?.length || 0} image(s)
          </span>

          <div className="flex items-center gap-1">
            {/* GitHub Link */}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                title="GitHub"
                className="p-2 text-gray-500 hover:text-white transition hover:bg-white/10 rounded-lg"
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

            {/* Live Link */}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                title="Live project"
                className="p-2 text-gray-500 hover:text-[#6c63ff] transition hover:bg-[#6c63ff]/10 rounded-lg"
              >
                <ExternalLink size={16} />
              </a>
            )}

            {/* Edit Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              title="Edit project"
              className="p-2 text-gray-500 hover:text-blue-400 transition hover:bg-blue-400/10 rounded-lg"
            >
              <Edit2 size={16} />
            </motion.button>

            {/* Delete Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDelete}
              title="Delete project"
              className="p-2 text-gray-500 hover:text-red-400 transition hover:bg-red-400/10 rounded-lg"
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
