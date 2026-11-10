import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ExternalLink, Code2, Clock, Tag } from "lucide-react";
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
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] border border-[#6c63ff]/30 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-[#6c63ff]/20"
        >
          {/* Header - Fixed */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-[#1a1a2e]/80 to-[#16213e]/80 border-b border-[#6c63ff]/20 px-6 py-5 flex items-center justify-between z-20 flex-shrink-0 backdrop-blur-xl"
          >
            <div>
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent truncate"
              >
                {project.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-sm text-gray-400 mt-1"
              >
                {project.category}
              </motion.p>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="p-2.5 hover:bg-[#6c63ff]/20 rounded-xl transition text-gray-400 hover:text-[#6c63ff] flex-shrink-0 border border-transparent hover:border-[#6c63ff]/30"
            >
              <X size={24} />
            </motion.button>
          </motion.div>

          {/* Content - Scrollable */}
          <motion.div 
            className="flex-1 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <div className="p-6 space-y-6">
              {/* Gallery - Main Image + Thumbnails */}
              {images.length > 0 && (
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Main Image - Full Width */}
                  <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden group shadow-2xl shadow-[#6c63ff]/20">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        src={currentImage}
                        alt={`${project.title} - ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Navigation Overlay */}
                    {images.length > 1 && (
                      <>
                        {/* Left Arrow */}
                        <motion.button
                          onClick={prevImage}
                          whileHover={{ scale: 1.15, backgroundColor: "rgba(0, 0, 0, 0.8)" }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <ChevronLeft size={24} />
                        </motion.button>

                        {/* Right Arrow */}
                        <motion.button
                          onClick={nextImage}
                          whileHover={{ scale: 1.15, backgroundColor: "rgba(0, 0, 0, 0.8)" }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <ChevronRight size={24} />
                        </motion.button>

                        {/* Image Counter */}
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-gradient-to-r from-[#6c63ff]/80 to-[#5a52d5]/80 text-white text-sm font-bold backdrop-blur-xl border border-white/20"
                        >
                          {currentImageIndex + 1} / {images.length}
                        </motion.div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Strip - Horizontal Below Main Image */}
                  {images.length > 1 && (
                    <motion.div 
                      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      {images.map((img, index) => (
                        <motion.button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.25 + index * 0.05 }}
                          className={`flex-shrink-0 aspect-square w-24 h-24 rounded-xl overflow-hidden border-2 transition transform ${
                            index === currentImageIndex
                              ? "border-[#6c63ff] shadow-lg shadow-[#6c63ff]/50"
                              : "border-white/10 hover:border-[#6c63ff]/50"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Project Info Grid */}
              <motion.div 
                className="grid md:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Left Column - Main Info */}
                <div className="md:col-span-2 space-y-5">
                  {/* Category & Status Badges */}
                  <motion.div 
                    className="flex items-center gap-2 flex-wrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    {project.category && (
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-gradient-to-r from-[#6c63ff]/30 to-[#5a52d5]/20 text-[#e0d7ff] rounded-full text-sm font-bold border border-[#6c63ff]/40"
                      >
                        <Tag size={14} className="inline mr-1" />
                        {project.category}
                      </motion.span>
                    )}
                    {project.status && (
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-4 py-2 rounded-full text-sm font-bold border ${
                          project.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : project.status === "in-progress"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-slate-500/20 text-slate-300 border-slate-500/40"
                        }`}
                      >
                        <Clock size={14} className="inline mr-1" />
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </motion.span>
                    )}
                    {project.featured && (
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500/30 to-yellow-500/20 text-orange-200 rounded-full text-sm font-bold border border-orange-500/40"
                      >
                        ⭐ Featured
                      </motion.span>
                    )}
                  </motion.div>

                  {/* Description */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-sm font-bold text-[#6c63ff] mb-3 uppercase tracking-wider">
                      About This Project
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-base">
                      {project.description}
                    </p>
                  </motion.div>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45 }}
                    >
                      <h3 className="text-sm font-bold text-[#6c63ff] mb-3 uppercase tracking-wider">
                        Technologies Used
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.45 + index * 0.05 }}
                            whileHover={{ scale: 1.08, y: -2 }}
                            className="px-4 py-2 bg-gradient-to-r from-[#6c63ff]/25 to-[#5a52d5]/15 border border-[#6c63ff]/40 rounded-lg text-sm text-[#e0d7ff] font-medium hover:from-[#6c63ff]/40 hover:to-[#5a52d5]/25 transition-all"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Right Column - Action Buttons */}
                <motion.div 
                  className="space-y-3 flex flex-col"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  {/* Links */}
                  <div className="space-y-3 flex-1 flex flex-col justify-start">
                    {project.liveUrl && (
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-[#6c63ff] via-[#7d76ff] to-[#5a52d5] hover:from-[#7d76ff] hover:to-[#6d61e8] rounded-xl transition text-white font-bold group shadow-lg shadow-[#6c63ff]/30 border border-white/20 hover:border-white/40"
                      >
                        <ExternalLink size={18} className="group-hover:rotate-45 transition-transform duration-300" />
                        <span>Live Demo</span>
                      </motion.a>
                    )}

                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                        className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/15 rounded-xl transition text-white font-bold group border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/10"
                      >
                        <Code2 size={18} className="group-hover:-rotate-12 transition-transform duration-300" />
                        <span>View Code</span>
                      </motion.a>
                    )}

                    {!project.liveUrl && !project.githubUrl && (
                      <p className="text-gray-400 text-sm italic text-center py-4">
                        No links available for this project
                      </p>
                    )}
                  </div>

                  {/* Close Button */}
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition font-bold border border-white/20 hover:border-white/40"
                  >
                    Close
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
