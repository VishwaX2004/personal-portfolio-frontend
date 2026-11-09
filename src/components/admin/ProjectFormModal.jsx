import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ImageUploader from "../ImageUploader";
import {
  createAdminProject,
  updateAdminProject,
} from "../../services/adminService";
import { parseErrorMessage } from "../../utils/adminHelpers";

const PROJECT_TYPES = [
  "Web App",
  "Mobile App",
  "UI/UX Design",
  "Backend API",
  "Data Science",
  "Game",
  "Design",
  "Other"
];

export default function ProjectFormModal({ isOpen, onClose, project, onSuccess }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "Web App",
    technologies: [],
    techInput: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    status: "completed",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImageUrls, setNewImageUrls] = useState([]);
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        slug: project.slug || "",
        description: project.description || "",
        category: project.category || "Web App",
        technologies: project.technologies || [],
        techInput: "",
        githubUrl: project.githubUrl || "",
        liveUrl: project.liveUrl || "",
        featured: project.featured || false,
        status: project.status || "completed",
      });
      setExistingImages((project.images || []).map(url => ({ url })));
      setNewImageUrls([]);
      setCoverImage(project.coverImage || project.images?.[0] || '');
      setStep(1);
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
      category: "Web App",
      technologies: [],
      techInput: "",
      githubUrl: "",
      liveUrl: "",
      featured: false,
      status: "completed",
    });
    setExistingImages([]);
    setNewImageUrls([]);
    setCoverImage('');
    setErrors({});
    setStep(1);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const addTechnology = () => {
    if (formData.techInput.trim()) {
      const newTech = formData.techInput.trim();
      if (!formData.technologies.includes(newTech)) {
        setFormData((prev) => ({
          ...prev,
          technologies: [...prev.technologies, newTech],
          techInput: "",
        }));
      }
    }
  };

  const removeTechnology = (index) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const removeExistingImage = (index) => {
    const removed = existingImages[index];
    const newList = existingImages.filter((_, i) => i !== index);
    setExistingImages(newList);
    if (coverImage === removed.url) {
      setCoverImage(newList[0]?.url || newImageUrls[0] || '');
    }
  };

  const handleTechInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology();
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    const totalImages = existingImages.length + newImageUrls.length;
    if (totalImages === 0) newErrors.images = "At least one image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (formData.liveUrl && !isValidUrl(formData.liveUrl)) newErrors.liveUrl = "Invalid URL";
    if (formData.githubUrl && !isValidUrl(formData.githubUrl)) newErrors.githubUrl = "Invalid URL";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      toast.error("Please fix the errors");
      return;
    }

    try {
      setLoading(true);

      const keptUrls = existingImages.map(img => img.url);
      const allImages = [...keptUrls, ...newImageUrls];
      const finalCoverImage = coverImage || allImages[0] || '';

      const submitData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        category: formData.category,
        technologies: formData.technologies,
        githubUrl: formData.githubUrl,
        liveUrl: formData.liveUrl,
        featured: formData.featured,
        status: formData.status,
        images: allImages,
        coverImage: finalCoverImage,
      };

      if (project?._id) {
        await updateAdminProject(project._id, submitData);
        toast.success("Project updated successfully! 🎉");
      } else {
        await createAdminProject(submitData);
        toast.success("Project created successfully! 🎉");
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
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a2e] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {project ? "Edit Project" : "Add New Project"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">Step {step} of 2</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#6c63ff] to-[#5a52d5] transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* STEP 1: Basic Info & Images */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g., E-commerce Platform, Mobile App, etc."
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.title ? "border-red-500" : "border-white/10"
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c63ff] transition`}
                  disabled={loading}
                  autoFocus
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                <p className="text-xs text-gray-500 mt-1">💡 Slug auto-generated from title</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about your project... What does it do? What problem does it solve?"
                  rows="5"
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.description ? "border-red-500" : "border-white/10"
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c63ff] transition resize-none`}
                  disabled={loading}
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PROJECT_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: type })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        formData.category === type
                          ? "bg-[#6c63ff] text-white"
                          : "bg-white/5 border border-white/10 text-gray-300 hover:border-[#6c63ff]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Existing Images (Edit Mode) */}
              {project && existingImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Images
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {existingImages.map((img, index) => (
                      <div
                        key={img.url}
                        className={`relative group aspect-square rounded-lg overflow-hidden bg-white/5 border-2 transition ${
                          coverImage === img.url
                            ? 'border-yellow-400'
                            : 'border-white/10'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Cover badge */}
                        {coverImage === img.url && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-yellow-500 rounded text-[10px] font-bold text-black">
                            COVER
                          </div>
                        )}
                        {/* Action overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5">
                          {coverImage !== img.url && (
                            <button
                              type="button"
                              onClick={() => setCoverImage(img.url)}
                              className="px-2 py-1 bg-yellow-500/80 hover:bg-yellow-500 rounded text-[10px] font-semibold text-black transition"
                            >
                              Set Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Remove this image from the project?')) {
                                removeExistingImage(index);
                              }
                            }}
                            className="p-1.5 bg-red-500/80 hover:bg-red-600 rounded text-white transition"
                            title="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Hover to set cover or remove. Gold border = current cover.</p>
                </div>
              )}

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {project ? 'Add New Images' : 'Project Images'}
                </label>
                <ImageUploader
                  onImagesUploaded={setNewImageUrls}
                  maxImages={8}
                />
                {errors.images && <p className="text-red-400 text-sm mt-1">{errors.images}</p>}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) {
                    setStep(2);
                  } else {
                    toast.error("Please fill in all required fields");
                  }
                }}
                disabled={loading}
                className="w-full px-4 py-3 bg-[#6c63ff] hover:bg-[#5a52d5] text-white rounded-lg transition font-semibold disabled:opacity-50"
              >
                Next: Add Technologies & Links →
              </button>
            </div>
          )}

          {/* STEP 2: Technologies & Links */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Technologies Used
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={formData.techInput}
                    onChange={(e) => setFormData({ ...formData, techInput: e.target.value })}
                    onKeyPress={handleTechInputKeyPress}
                    placeholder="e.g., React, Node.js..."
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c63ff]"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={addTechnology}
                    disabled={loading}
                    className="px-4 py-2 bg-[#6c63ff] hover:bg-[#5a52d5] text-white rounded-lg transition disabled:opacity-50 flex items-center gap-1"
                  >
                    <Plus size={18} /> Add
                  </button>
                </div>
                {formData.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((tech, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1 bg-[#6c63ff]/20 border border-[#6c63ff] rounded-full text-sm text-[#6c63ff]"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(idx)}
                          className="hover:text-red-400 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* GitHub URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub Repository (Optional)
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className={`w-full px-4 py-2 bg-white/5 border ${
                    errors.githubUrl ? "border-red-500" : "border-white/10"
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c63ff]`}
                  disabled={loading}
                />
                {errors.githubUrl && <p className="text-red-400 text-sm mt-1">{errors.githubUrl}</p>}
              </div>

              {/* Live URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Live Website URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  placeholder="https://yourproject.com"
                  className={`w-full px-4 py-2 bg-white/5 border ${
                    errors.liveUrl ? "border-red-500" : "border-white/10"
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c63ff]`}
                  disabled={loading}
                />
                {errors.liveUrl && <p className="text-red-400 text-sm mt-1">{errors.liveUrl}</p>}
              </div>

              {/* Status & Featured */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#6c63ff]"
                    disabled={loading}
                  >
                    <option value="draft">Draft</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      disabled={loading}
                      className="w-4 h-4 accent-[#6c63ff]"
                    />
                    <span className="text-sm text-gray-300">⭐ Featured Project</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition disabled:opacity-50 font-semibold"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-[#6c63ff] hover:bg-[#5a52d5] text-white rounded-lg transition disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {project ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>✨ {project ? "Update Project" : "Create Project"}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
