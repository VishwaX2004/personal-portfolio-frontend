import { ExternalLink, Code2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProjectCard({ project, onSelectProject, index = 0 }) {
  // Use coverImage if available, otherwise fall back to image, then to first image in array
  const coverImage =
    project.coverImage || project.image || project.images?.[0] || "";

  const containerVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.12,
        ease: "easeOut",
      },
    },
    hover: {
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const techVariants = {
    initial: { opacity: 0, y: 10, scale: 0.9 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.12 + i * 0.06,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  const handleClick = () => {
    if (onSelectProject) {
      onSelectProject(project);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onClick={handleClick}
      className="group relative h-full cursor-pointer overflow-hidden rounded-2xl"
    >
      {/* Animated background gradient with enhanced glow */}
      <motion.div 
        className="absolute inset-0 -z-10 bg-gradient-to-br from-[#6c63ff]/15 via-transparent to-[#5a52d5]/15 opacity-0 group-hover:opacity-100"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Animated glow orbs */}
      <motion.div 
        className="absolute top-0 right-0 w-40 h-40 bg-[#6c63ff]/20 rounded-full blur-3xl opacity-0 group-hover:opacity-40 pointer-events-none"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-40 h-40 bg-[#5a52d5]/20 rounded-full blur-3xl opacity-0 group-hover:opacity-30 pointer-events-none"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
      />

      {/* Card container with professional hover effect */}
      <motion.div 
        className="relative h-full flex flex-col bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent border border-white/15 group-hover:border-[#6c63ff]/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 backdrop-blur-xl"
        whileHover={{
          boxShadow: "0 30px 60px rgba(108, 99, 255, 0.3), 0 0 40px rgba(108, 99, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        
        {/* IMAGE SECTION WITH ADVANCED EFFECTS */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black aspect-video">
          {coverImage ? (
            <>
              {/* Background image with parallax effect */}
              <motion.img
                src={coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />

              {/* Multi-layer gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20"
                initial={{ opacity: 0.6 }}
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.4 }}
              />

              {/* Animated radial glow on hover */}
              <motion.div
                className="absolute inset-0 bg-radial-gradient pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle at 50% 50%, rgba(108, 99, 255, 0.15) 0%, transparent 70%)",
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />

              {/* Professional ripple pulse effect */}
              <motion.div
                className="absolute inset-0 border-2 border-[#6c63ff] rounded-2xl opacity-0 pointer-events-none"
                initial={{ opacity: 0, scale: 0.95 }}
                whileHover={{ opacity: [0, 0.5, 0], scale: [0.95, 1.05, 1.15] }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />

              {/* Interactive CTA with enhanced styling */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.12, y: -5 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="relative px-8 py-4 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-[#6c63ff] via-[#7d76ff] to-[#5a52d5] shadow-2xl shadow-[#6c63ff]/60 border border-white/40 overflow-hidden group/btn"
                >
                  {/* Button glow effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl"
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500" />
                  <span className="relative flex items-center gap-3 justify-center">
                    <motion.span animate={{ rotate: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      ✨
                    </motion.span>
                    View Details
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      →
                    </motion.span>
                  </span>
                </motion.div>
              </motion.div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-2 opacity-30">📸</div>
                <p className="text-gray-500 text-sm">No Image</p>
              </div>
            </div>
          )}

          {/* Status Badge with animation */}
          {project.status && (
            <motion.div
              className="absolute top-4 left-4 z-10"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.12 + 0.2, duration: 0.4 }}
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md transition-all duration-300 ${
                  project.status === "completed"
                    ? "bg-gradient-to-r from-emerald-500/50 to-emerald-400/40 text-emerald-50 border border-emerald-400/60 shadow-lg shadow-emerald-500/20"
                    : project.status === "in-progress"
                    ? "bg-gradient-to-r from-amber-500/50 to-amber-400/40 text-amber-50 border border-amber-400/60 shadow-lg shadow-amber-500/20"
                    : "bg-gradient-to-r from-slate-500/50 to-slate-400/40 text-slate-50 border border-slate-400/60 shadow-lg shadow-slate-500/20"
                }`}
              >
                {project.status === "completed" ? "✓ Completed" : 
                 project.status === "in-progress" ? "⏳ In Progress" : 
                 "Archived"}
              </motion.span>
            </motion.div>
          )}

          {/* Featured Badge with pulse effect */}
          {project.featured && (
            <motion.div
              className="absolute top-4 right-4 z-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.12 + 0.3, duration: 0.4 }}
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 0 0 rgba(251, 146, 60, 0.7)", "0 0 0 10px rgba(251, 146, 60, 0)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500/60 to-orange-400/50 text-orange-50 backdrop-blur-md border border-orange-400/70 shadow-lg shadow-orange-500/30"
              >
                ⭐ Featured
              </motion.span>
            </motion.div>
          )}
        </div>

        {/* CONTENT SECTION */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Category & Title */}
          <div className="mb-3">
            <motion.p
              className="text-[#6c63ff] text-xs font-bold uppercase tracking-widest letter-spacing"
              initial={{ opacity: 0.6 }}
              whileHover={{ opacity: 1 }}
            >
              {project.category}
            </motion.p>

            <motion.h3
              className="font-bold mt-2.5 text-white group-hover:text-[#6c63ff] transition-colors duration-300 line-clamp-2 text-xl md:text-2xl leading-snug"
            >
              {project.title}
            </motion.h3>
          </div>

          {/* Description with enhanced styling */}
          <motion.p
            className="text-gray-300 text-sm leading-relaxed line-clamp-2 transition-all duration-300 mb-4 flex-1"
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1, letterSpacing: "0.5px" }}
          >
            {project.description}
          </motion.p>

          {/* TECHNOLOGIES with staggered animation */}
          <motion.div className="flex flex-wrap gap-2 mb-5">
            {project.technologies?.slice(0, 3).map((tech, idx) => (
              <motion.span
                key={tech}
                custom={idx}
                variants={techVariants}
                initial="initial"
                animate="animate"
                whileHover={{ opacity: 1, backgroundColor: "rgba(108, 99, 255, 0.5)" }}
                transition={{ duration: 0.3 }}
                className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#6c63ff]/35 to-[#5a52d5]/25 border border-[#6c63ff]/50 text-[#e0d7ff] transition-all duration-300 font-medium shadow-lg shadow-[#6c63ff]/10"
              >
                {tech}
              </motion.span>
            ))}
            {project.technologies && project.technologies.length > 3 && (
              <motion.span
                custom={3}
                variants={techVariants}
                initial="initial"
                animate="animate"
                className="text-xs px-3 py-1.5 rounded-lg bg-white/15 border border-white/30 text-gray-200 group-hover:bg-white/25 transition-all duration-300 font-medium"
              >
                +{project.technologies.length - 3} more
              </motion.span>
            )}
          </motion.div>

          {/* PROJECT LINKS with enhanced styling */}
          <motion.div
            className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-white/10"
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
          >
            {/* GitHub Link */}
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ opacity: 1, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 text-xs text-gray-300 hover:text-white px-3.5 py-2 rounded-lg bg-white/5 border border-white/20 hover:border-white/40 transition-colors duration-300 font-semibold group/link"
              >
                <motion.div whileHover={{ rotate: 10 }}>
                  <Code2 size={15} />
                </motion.div>
                <span>Code</span>
              </motion.a>
            )}

            {/* Live Project Link */}
            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ 
                  opacity: 1,
                  backgroundColor: "rgba(108, 99, 255, 0.3)",
                  boxShadow: "0 0 15px rgba(108, 99, 255, 0.3)"
                }}
                whileTap={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 text-xs text-[#6c63ff] hover:text-white px-3.5 py-2 rounded-lg bg-[#6c63ff]/15 border border-[#6c63ff]/40 hover:border-[#6c63ff]/70 transition-all duration-300 font-semibold group/link shadow-lg shadow-[#6c63ff]/10"
              >
                <motion.div whileHover={{ rotate: 45 }}>
                  <ExternalLink size={15} />
                </motion.div>
                <span>Live Demo</span>
              </motion.a>
            )}
          </motion.div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#6c63ff]/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>
    </motion.div>
  );
}
