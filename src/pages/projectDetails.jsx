import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Share2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

import API from "../services/api";
import Header from "../components/header";
import Footer from "../components/footer";

export default function ProjectDetails() {

  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);


  useEffect(() => {

    API.get(`/projects/${id}`)
      .then((res) => {
        setProject(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load project");
      });

  }, [id]);


  // Get all images (prioritize coverImage, then images array, then legacy image)
  const getAllImages = () => {
    if (!project) return [];
    const images = project.images || [];
    return images.length > 0 ? images : (project.image ? [project.image] : []);
  };

  const images = getAllImages();

  const handleOpenLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleNextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShareProject = async () => {
    const shareText = `Check out "${project.title}" - ${window.location.href}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "Escape") setLightboxOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, images.length]);


  if (!project) {

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading project...</p>
        </div>
      </div>
    );

  }


  return (
    <div className="min-h-screen bg-black text-white">

      <Header />

      <main className="max-w-6xl mx-auto px-6 pt-36 pb-24">

        <Link
          to="/projects"
          className="text-gray-500 hover:text-white transition flex items-center gap-2"
        >
          ← Back to Projects
        </Link>


        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mt-10">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold">
              {project.title}
            </h1>

            <p className="text-blue-500 text-lg mt-4 font-semibold">
              {project.category}
            </p>

            {project.status && (
              <p className="text-gray-400 text-sm mt-2">
                Status: <span className="text-green-400">{project.status}</span>
              </p>
            )}
          </div>

          <button
            onClick={handleShareProject}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition w-fit"
            title="Share project"
          >
            <Share2 size={18} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>


        {/* Main Image / Gallery */}
        {images.length > 0 && (
          <div className="mt-12">
            {images.length === 1 ? (
              // Single image display
              <div className="aspect-video overflow-hidden rounded-3xl bg-black cursor-pointer hover:opacity-90 transition">
                <img
                  src={images[0]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onClick={() => handleOpenLightbox(0)}
                />
              </div>
            ) : (
              // Multiple images - show main + thumbnails
              <>
                <div className="aspect-video overflow-hidden rounded-3xl bg-black mb-6 cursor-pointer hover:opacity-90 transition">
                  <img
                    src={images[lightboxIndex]}
                    alt={`${project.title} - ${lightboxIndex + 1}`}
                    className="w-full h-full object-cover"
                    onClick={() => handleOpenLightbox(lightboxIndex)}
                  />
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className={`aspect-square overflow-hidden rounded-xl border-2 transition ${
                        idx === lightboxIndex
                          ? "border-blue-500"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}


        {/* Project Details */}
        <div className="max-w-3xl mt-16">

          <h2 className="text-3xl font-semibold">
            About the Project
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed mt-5">
            {project.description}
          </p>


          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <>
              <h2 className="text-3xl font-semibold mt-16">
                Technologies Used
              </h2>

              <div className="flex flex-wrap gap-3 mt-6">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 transition"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </>
          )}


          {/* Links */}
          <div className="flex flex-wrap gap-4 mt-16">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 flex items-center gap-2 transition"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.621.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.944 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682 0 3.844-2.339 4.688-4.566 4.936.359.309.678.92.678 1.855 0 1.338-.012 2.417-.012 2.746 0 .267.18.579.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z" />
                </svg>
                View on GitHub
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 transition"
              >
                <ExternalLink size={18} />
                Live Demo
              </a>
            )}

            {project.projectLink && (
              <a
                href={project.projectLink}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-xl border border-purple-500/30 flex items-center gap-2 transition"
              >
                <ExternalLink size={18} />
                View Project
              </a>
            )}
          </div>

        </div>

      </main>


      {/* Lightbox Modal */}
      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
            title="Close"
          >
            <X size={24} />
          </button>

          {/* Image */}
          <div className="w-full h-full flex items-center justify-center px-6">
            <img
              src={images[lightboxIndex]}
              alt={`${project.title} - ${lightboxIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition"
                title="Previous image (← or Swipe)"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition"
                title="Next image (→ or Swipe)"
              >
                <ChevronRight size={24} />
              </button>

              {/* Counter */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 rounded-lg text-sm">
                {lightboxIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}

      <Footer />

    </div>
  );
}