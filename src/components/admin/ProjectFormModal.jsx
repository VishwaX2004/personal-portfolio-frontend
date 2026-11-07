import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import ImageUploader from "../ImageUploader";
import {
  createAdminProject,
  updateAdminProject,
} from "../../services/adminService";
import { parseErrorMessage } from "../../utils/adminHelpers";

const CATEGORIES = ["Web App", "Mobile App", "UI/UX Design", "Backend", "Other"];
const STATUSES = ["draft", "in-progress", "completed"];

export default function ProjectFormModal({ isOpen, onClose, project, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    status: "draft",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with project data if editing
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        slug: project.slug || "",
        description: project.description || "",
        category: project.category || "",
        technologies: project.technologies?.join(", ") || "",
        githubUrl: project.githubUrl || "",
        liveUrl: project.liveUrl || "",
        featured: project.featured || false,
        status: project.status || "draft",
      });
      setImages(project.images || []);
    } else {
      resetForm();
    }
    setErrors({});
  }, [project, isOpen]);

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      category: "",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
      featured: false,
      status: "draft",
    });
    setImages([]);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Project title is required";
    }

    if (!formData.slug?.trim()) {
      newErrors.slug = "Project slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug must contain only lowercase letters, numbers, and hyphens";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category?.trim()) {
      newErrors.category = "Category is required";
    }

    if (images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    if (formData.liveUrl && !isValidUrl(formData.liveUrl)) {
      newErrors.liveUrl = "Invalid website URL";
    }

    if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
      newErrors.githubUrl = "Invalid GitHub URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImagesUploaded = (imageUrls) => {
    setImages(imageUrls);
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        images,
        technologies: formData.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
      };

      if (project?._id) {
        // Edit mode
        await updateAdminProject(project._id, submitData);
        toast.success("Project updated successfully");
      } else {
        // Create mode
        await createAdminProject(submitData);
        toast.success("Project created successfully");
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(parseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a2e] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {project ? "Edit Project" : "Create New Project"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Project Title *
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., E-commerce Platform"
              className={`w-full px-4 py-2 bg-white/5 border ${
                errors.title ? "border-red-500" : "border-white/10"
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c63ff] transition`}
              disabled={loading}
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
              Project Slug * (URL-friendly name)
            </label>
            <input
              id="slug"
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="e.g., ecommerce-platform"
              className={`w-full px-4 py-2 bg-white/5 border ${
                errors.slug ? "border-red-500" : "border-white/10"
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c63ff] transition`}
              disabled={loading}
            />
            {errors.slug && (
              <p className="text-red-400 text-sm mt-1">{errors.slug}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your project..."
              rows="4"
              className={`w-full px-4 py-2 bg-white/5 border ${
                errors.description ? "border-red-500" : "border-white/10"
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c63ff] transition resize-none`}
              disabled={loading}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-white/5 border ${
                errors.category ? "border-red-500" : "border-white/10"
              } rounded-lg text-white focus:outline-none focus:border-[#6c63ff] transition`}
              disabled={loading}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-400 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Technologies */}
          <div>
            <label htmlFor="technologies" className="block text-sm font-medium text-gray-300 mb-2">
              Technologies (comma-separated)
            </label>
            <input
              id="technologies"
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleInputChange}
              placeholder="e.g., React, Node.js, MongoDB"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c63ff] transition"
              disabled={loading}
            />
          </div>

          {/* GitHub URL */}
          <div>
            <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-300 mb-2">
              GitHub Repository URL
            </label>
            <input
              id="githubUrl"
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleInputChange}
              placeholder="https://github.com/..."
              className={`w-full px-4 py-2 bg-white/5 border ${
                errors.githubUrl ? "border-red-500" : "border-white/10"
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c63ff] transition`}
              disabled={loading}
            />
            {errors.githubUrl && (
              <p className="text-red-400 text-sm mt-1">{errors.githubUrl}</p>
            )}
          </div>

          {/* Live URL */}
          <div>
            <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-300 mb-2">
              Live Website URL
            </label>
            <input
              id="liveUrl"
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleInputChange}
              placeholder="https://project.com"
              className={`w-full px-4 py-2 bg-white/5 border ${
                errors.liveUrl ? "border-red-500" : "border-white/10"
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c63ff] transition`}
              disabled={loading}
            />
            {errors.liveUrl && (
              <p className="text-red-400 text-sm mt-1">{errors.liveUrl}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#6c63ff] transition"
              disabled={loading}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="w-4 h-4 accent-[#6c63ff] cursor-pointer"
              disabled={loading}
            />
            <label htmlFor="featured" className="text-sm text-gray-300 cursor-pointer">
              Mark as featured project
            </label>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Images *
            </label>
            <ImageUploader onImagesUploaded={handleImagesUploaded} maxImages={8} />
            {errors.images && (
              <p className="text-red-400 text-sm mt-1">{errors.images}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#6c63ff] hover:bg-[#5a52d5] text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {project ? "Updating..." : "Creating..."}
                </>
              ) : project ? (
                "Update Project"
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
