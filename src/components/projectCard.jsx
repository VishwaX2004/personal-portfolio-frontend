import { ExternalLink, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ProjectCard({ project, onSelectProject, index = 0 }) {
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
      y: -8,
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
      className="group bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-[#6c63ff]/40 transition-all duration-300 cursor-pointer"
    >
      {/* IMAGE - WITH ZOOM AND OVERLAY */}
      <div className="aspect-video overflow-hidden bg-black relative">
        {coverImage ? (
          <>
            <motion.img
              src={coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Gradient Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* View Details Badge */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1 }}
                className="px-4 py-2 bg-[#6c63ff] rounded-lg font-semibold text-white"
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
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
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
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/30 text-orange-200 backdrop-blur-sm">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <motion.p
              className="text-[#6c63ff] text-sm font-medium"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
            >
              {project.category}
            </motion.p>

            <motion.h3 className="text-2xl font-semibold mt-2 text-white group-hover:text-[#6c63ff] transition-colors duration-300">
              {project.title}
            </motion.h3>
          </div>

          <motion.div
            whileHover={{ x: 4, y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpRight
              size={22}
              className="flex-shrink-0 text-gray-500 group-hover:text-[#6c63ff] transition-colors duration-300"
            />
          </motion.div>
        </div>

        {/* Description */}
        <motion.p
          className="text-gray-400 mt-4 leading-relaxed line-clamp-2 group-hover:line-clamp-3 transition-all duration-300"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          {project.description}
        </motion.p>

        {/* TECHNOLOGIES */}
        <motion.div className="flex flex-wrap gap-2 mt-5">
          {project.technologies?.slice(0, 4).map((tech, idx) => (
            <motion.span
              key={tech}
              custom={idx}
              variants={techVariants}
              initial="initial"
              animate="animate"
              className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-[#6c63ff]/20 to-[#6c63ff]/10 border border-[#6c63ff]/30 text-[#a89bff] group-hover:bg-gradient-to-r group-hover:from-[#6c63ff]/40 group-hover:to-[#6c63ff]/20 group-hover:border-[#6c63ff]/50 transition-all duration-300 hover:scale-105 transform"
            >
              {tech}
            </motion.span>
          ))}
          {project.technologies && project.technologies.length > 4 && (
            <motion.span
              custom={4}
              variants={techVariants}
              initial="initial"
              animate="animate"
              className="text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-gray-300 group-hover:bg-white/20 transition-all duration-300"
            >
              +{project.technologies.length - 4} more
            </motion.span>
          )}
        </motion.div>

        {/* PROJECT LINKS */}
        <motion.div
          className="flex flex-wrap gap-3 mt-6"
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
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/10"
            >
              <svg
                width="17"
                height="17"
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
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#6c63ff] transition px-3 py-1.5 rounded-lg hover:bg-[#6c63ff]/10"
            >
              <ExternalLink size={16} />
              Live Demo
            </motion.a>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
