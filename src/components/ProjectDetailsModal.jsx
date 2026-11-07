import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectDetailsModal({ isOpen, onClose, project }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const images = project.images || [];
  const currentImage = images[currentImageIndex] || project.coverImage;

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-[#1a1a2e] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header - Fixed */}
          <div className="bg-[#1a1a2e] border-b border-white/10 px-6 py-4 flex items-center justify-between z-20 flex-shrink-0">
            <h2 className="text-2xl font-bold text-white truncate">
              {project.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white flex-shrink-0"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Gallery - Main Image + Bottom Thumbnails */}
              {images.length > 0 && (
                <div className="space-y-3">
                  {/* Main Image - Full Width */}
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden group">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        src={currentImage}
                        alt={`${project.title} - ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>

                    {/* Navigation Overlay */}
                    {images.length > 1 && (
                      <>
                        {/* Left Arrow */}
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <ChevronLeft size={24} />
                        </button>

                        {/* Right Arrow */}
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <ChevronRight size={24} />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm font-medium">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Strip - Horizontal Below Main Image */}
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 aspect-square w-20 h-20 rounded-lg overflow-hidden border-2 transition transform hover:scale-105 ${
                            index === currentImageIndex
                              ? "border-[#6c63ff] shadow-lg shadow-[#6c63ff]/30"
                              : "border-white/10 hover:border-white/30"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Project Info Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Category & Status */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {project.category && (
                      <span className="px-3 py-1 bg-[#6c63ff]/20 text-[#6c63ff] rounded-full text-sm font-medium">
                        {project.category}
                      </span>
                    )}
                    {project.status && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          project.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : project.status === "in-progress"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {project.status.charAt(0).toUpperCase() +
                          project.status.slice(1)}
                      </span>
                    )}
                    {project.featured && (
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-sm text-gray-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Action Buttons */}
                <div className="space-y-3 flex flex-col justify-between">
                  {/* Links */}
                  <div className="space-y-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#6c63ff] to-[#5a52d5] hover:from-[#7a72ff] hover:to-[#6860e0] rounded-lg transition text-white font-medium group"
                      >
                        <ExternalLink size={20} />
                        <span>Visit Website</span>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition">
                          →
                        </div>
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition text-white font-medium group"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.621.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.944 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682 0 3.844-2.339 4.688-4.566 4.936.359.309.678.92.678 1.855 0 1.338-.012 2.417-.012 2.746 0 .267.18.579.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z" />
                        </svg>
                        <span>View Code</span>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition">
                          →
                        </div>
                      </a>
                    )}

                    {!project.liveUrl && !project.githubUrl && (
                      <p className="text-gray-400 text-sm italic">
                        No links available for this project
                      </p>
                    )}
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
