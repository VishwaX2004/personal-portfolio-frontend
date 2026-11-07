import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectDetailsModal({ isOpen, onClose, project }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
          className="bg-[#1a1a2e] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#1a1a2e] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
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

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Gallery */}
            {images.length > 0 && (
              <div className="space-y-3">
                {/* Main Image */}
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft size={24} />
                      </button>

                      {/* Right Arrow */}
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
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

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 aspect-square w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                          index === currentImageIndex
                            ? "border-[#6c63ff]"
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
                      <Github size={20} />
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
