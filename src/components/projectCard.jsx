import {
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  // Use coverImage if available, otherwise fall back to image, then to first image in array
  const coverImage = project.coverImage || project.image || (project.images?.[0] || "");

  return (
    <Link
      to={`/projects/${project._id}`}
      className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-300"
    >

      {/* =====================================================
          IMAGE - WITH ZOOM AND OVERLAY
      ====================================================== */}

      <div className="aspect-video overflow-hidden bg-black relative">

        {coverImage ? (

          <>
            <img
              src={coverImage}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>

        ) : (

          <div className="w-full h-full flex items-center justify-center text-gray-600">
            No Image
          </div>

        )}

      </div>


      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="p-6">

        {/* Header */}

        <div className="flex justify-between items-start gap-4">

          <div>

            <p className="text-blue-500 text-sm font-medium">
              {project.category}
            </p>

            <h3 className="text-2xl font-semibold mt-2 text-white group-hover:text-blue-400 transition-colors duration-300">
              {project.title}
            </h3>

          </div>


          <ArrowUpRight
            size={22}
            className="flex-shrink-0 text-gray-500 group-hover:text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
          />

        </div>


        {/* Description */}

        <p className="text-gray-400 mt-4 leading-relaxed line-clamp-2 group-hover:line-clamp-3 transition-all duration-300">
          {project.description}
        </p>


        {/* =================================================
            TECHNOLOGIES
        ================================================== */}

        <div className="flex flex-wrap gap-2 mt-5">

          {project.technologies?.map((tech, idx) => (
            <span
              key={tech}
              className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-all duration-300 hover:scale-105 transform"
              style={{
                animationDelay: `${idx * 30}ms`,
                animation: 'fadeInUp 0.3s ease-out forwards',
                opacity: 0,
              }}
            >
              {tech}
            </span>
          ))}

        </div>


        {/* =================================================
            PROJECT LINKS
        ================================================== */}

        <div className="flex flex-wrap gap-3 mt-6">

          {/* GitHub */}

          {project.githubUrl && (

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
            >

              {/* GitHub SVG */}

              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.621.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.944 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682 0 3.844-2.339 4.688-4.566 4.936.359.309.678.92.678 1.855 0 1.338-.012 2.417-.012 2.746 0 .267.18.579.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z"
                />
              </svg>

              GitHub

            </a>

          )}


          {/* Live Project */}

          {project.liveUrl && (

            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-500 transition"
            >

              <ExternalLink size={16} />

              Live Demo

            </a>

          )}

        </div>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .group:hover span {
          animation: fadeInUp 0.3s ease-out forwards !important;
        }
      `}</style>

    </Link>
  );
}

