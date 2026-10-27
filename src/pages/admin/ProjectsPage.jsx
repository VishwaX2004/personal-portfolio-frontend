import { useEffect, useState } from "react";
import { Plus, Trash2, X, Edit2, ExternalLink, FolderKanban } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAdminProjects,
  createAdminProject,
  deleteAdminProject,
  updateAdminProject,
} from "../../services/adminService";
import AdminModal from "../../components/admin/AdminModal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

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

  const handleProjectChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
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
    setEditingProject(null);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      image: project.image,
      category: project.category,
      technologies: project.technologies?.join(", ") || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      featured: project.featured || false,
      status: project.status || "Completed",
    });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!projectForm.title || !projectForm.slug || !projectForm.description) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const projectData = {
        ...projectForm,
        technologies: projectForm.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await createAdminProject(projectData);
      toast.success("Project added successfully!");
      resetForm();
      setShowAddForm(false);
      fetchProjects();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();

    if (!projectForm.title || !projectForm.slug || !projectForm.description) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const projectData = {
        ...projectForm,
        technologies: projectForm.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await updateAdminProject(editingProject._id, projectData);
      toast.success("Project updated successfully!");
      resetForm();
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update project");
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Manage Projects</h2>
          <p className="text-gray-500 mt-1">
            Add and manage your portfolio projects.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (showAddForm) resetForm();
          }}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center gap-2 transition"
        >
          {showAddForm ? (
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

      {showAddForm && (
        <form
          onSubmit={handleCreateProject}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 mb-8"
        >
          <h3 className="text-xl font-semibold mb-6">Add New Project</h3>

          <ProjectFormFields
            form={projectForm}
            onChange={handleProjectChange}
          />

          <button
            type="submit"
            className="mt-7 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition"
          >
            Create Project
          </button>
        </form>
      )}

      {projects.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white/[0.03] border border-white/10 rounded-2xl">
          <FolderKanban size={48} className="text-gray-700 mb-3" />
          <p className="text-gray-500 text-center">
            No projects yet. Add your first project to get started.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={openEditModal}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      <AdminModal
        isOpen={editingProject !== null}
        title="Edit Project"
        onClose={() => {
          resetForm();
          setEditingProject(null);
        }}
      >
        <form onSubmit={handleUpdateProject} className="space-y-5">
          <ProjectFormFields
            form={projectForm}
            onChange={handleProjectChange}
          />

          <div className="flex gap-3 pt-5">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setEditingProject(null);
              }}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}

function ProjectFormFields({ form, onChange }) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <Input
        label="Project Title"
        name="title"
        value={form.title}
        onChange={onChange}
        placeholder="Metal Garage"
        required
      />

      <Input
        label="Slug"
        name="slug"
        value={form.slug}
        onChange={onChange}
        placeholder="metal-garage"
        required
      />

      <Input
        label="Category"
        name="category"
        value={form.category}
        onChange={onChange}
        placeholder="MERN Stack"
      />

      <Input
        label="Image URL"
        name="image"
        value={form.image}
        onChange={onChange}
        placeholder="/images/projects/project.jpg"
      />

      <div className="md:col-span-2">
        <Input
          label="Technologies"
          name="technologies"
          value={form.technologies}
          onChange={onChange}
          placeholder="React, Node.js, Express, MongoDB"
        />

        <p className="text-xs text-gray-600 mt-2">Separate with commas.</p>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm text-gray-400 mb-2">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          rows="5"
          required
          placeholder="Describe your project..."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500 transition resize-none"
        />
      </div>

      <Input
        label="GitHub URL"
        name="githubUrl"
        value={form.githubUrl}
        onChange={onChange}
        placeholder="https://github.com/..."
      />

      <Input
        label="Live URL"
        name="liveUrl"
        value={form.liveUrl}
        onChange={onChange}
        placeholder="https://..."
      />

      <div>
        <label className="block text-sm text-gray-400 mb-2">Status</label>

        <select
          name="status"
          value={form.status}
          onChange={onChange}
          className="w-full bg-black border border-white/10 rounded-xl p-3.5 outline-none focus:border-blue-500"
        >
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Active">Active</option>
        </select>
      </div>

      <label className="flex items-center gap-3 cursor-pointer mt-8">
        <input
          type="checkbox"
          name="featured"
          checked={form.featured}
          onChange={onChange}
          className="w-4 h-4"
        />

        <span className="text-sm text-gray-300">Featured project</span>
      </label>
    </div>
  );
}

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
      <label className="block text-sm text-gray-400 mb-2">{label}</label>

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

function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden group">
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
              onClick={() => onEdit(project)}
              aria-label="Edit project"
              title="Edit project"
              className="p-2 text-gray-500 hover:text-blue-400 transition"
            >
              <Edit2 size={16} />
            </button>

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
