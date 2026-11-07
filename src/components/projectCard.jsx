import { ExternalLink, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ProjectCard({ project, onSelectProject, index = 0, isLarge = false }) {
  // Use coverImage if available, otherwise fall back to image, then to first image in array
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
    hover: {
      y: -6,
      transition: {
        duration: 0.3,
      },
    },
  };

  const techVariants = {
    initial: { opacity: 0, y: 10 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1 + i * 0.05,
        duration: 0.3,
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
      className={`group bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-xl overflow-hidden hover:border-[#6c63ff]/60 hover:shadow-lg hover:shadow-[#6c63ff]/20 transition-all duration-300 cursor-pointer h-full flex flex-col ${
        isLarge ? "lg:rounded-2xl" : ""
      }`}
    >
      {/* IMAGE - WITH ZOOM AND OVERLAY */}
      <div className={`overflow-hidden bg-black relative ${isLarge ? "aspect-square lg:aspect-video" : "aspect-video"}`}>
        {coverImage ? (
          <>
            <motion.img
              src={coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.5 }}
            />

            {/* Gradient Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* View Details Badge */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="px-4 py-2 bg-gradient-to-r from-[#6c63ff] to-[#5a52d5] rounded-lg font-semibold text-white text-sm hover:shadow-lg hover:shadow-[#6c63ff]/50"
              >
                View Details
              </motion.div>
            </motion.div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            No Image
          </div>
        )}

        {/* Status Badge */}
        {project.status && (
          <div className="absolute top-3 left-3">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                project.status === "completed"
                  ? "bg-green-500/40 text-green-100 border border-green-400/50"
                  : project.status === "in-progress"
                  ? "bg-yellow-500/40 text-yellow-100 border border-yellow-400/50"
                  : "bg-gray-500/40 text-gray-100 border border-gray-400/50"
              }`}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/40 text-orange-100 backdrop-blur-md border border-orange-400/50">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <motion.p
              className="text-[#6c63ff] text-xs font-semibold uppercase tracking-wider"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
            >
              {project.category}
            </motion.p>

            <motion.h3 className={`font-bold mt-1.5 text-white group-hover:text-[#6c63ff] transition-colors duration-300 line-clamp-2 ${
              isLarge ? "text-xl md:text-2xl" : "text-lg md:text-xl"
            }`}>
              {project.title}
            </motion.h3>
          </div>

          <motion.div
            whileHover={{ x: 3, y: -3 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <ArrowUpRight
              size={18}
              className="text-gray-500 group-hover:text-[#6c63ff] transition-colors duration-300"
            />
          </motion.div>
        </div>

        {/* Description */}
        <motion.p
          className="text-gray-400 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-3 transition-all duration-300 mb-3 flex-1"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          {project.description}
        </motion.p>

        {/* TECHNOLOGIES */}
        <motion.div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies?.slice(0, isLarge ? 5 : 3).map((tech, idx) => (
            <motion.span
              key={tech}
              custom={idx}
              variants={techVariants}
              initial="initial"
              animate="animate"
              className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-[#6c63ff]/25 to-[#6c63ff]/10 border border-[#6c63ff]/40 text-[#c5bfff] group-hover:from-[#6c63ff]/50 group-hover:to-[#6c63ff]/30 transition-all duration-300"
            >
              {tech}
            </motion.span>
          ))}
          {project.technologies && project.technologies.length > (isLarge ? 5 : 3) && (
            <motion.span
              custom={isLarge ? 5 : 3}
              variants={techVariants}
              initial="initial"
              animate="animate"
              className="text-xs px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-gray-300 group-hover:bg-white/20"
            >
              +{project.technologies.length - (isLarge ? 5 : 3)}
            </motion.span>
          )}
        </motion.div>

        {/* PROJECT LINKS */}
        <motion.div
          className="flex flex-wrap gap-2 mt-auto"
          initial={{ opacity: 0.7 }}
          whileHover={{ opacity: 1 }}
        >
          {/* GitHub */}
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition px-2.5 py-1.5 rounded-lg hover:bg-white/10 border border-transparent hover:border-white/20"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.621.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.944 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682 0 3.844-2.339 4.688-4.566 4.936.359.309.678.92.678 1.855 0 1.338-.012 2.417-.012 2.746 0 .267.18.579.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z" />
              </svg>
              GitHub
            </motion.a>
          )}

          {/* Live Project */}
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-[#6c63ff] transition px-2.5 py-1.5 rounded-lg hover:bg-[#6c63ff]/10 border border-transparent hover:border-[#6c63ff]/30"
            >
              <ExternalLink size={14} />
              Live
            </motion.a>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
