import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import ProjectCard from "./projectCard";
import ProjectDetailsModal from "./ProjectDetailsModal";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await API.get("/api/projects");
        // Sort by globalOrder, then by createdAt
        const sortedProjects = (response.data || []).sort((a, b) => {
          const orderDiff = (a.globalOrder || 0) - (b.globalOrder || 0);
          if (orderDiff !== 0) return orderDiff;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setProjects(sortedProjects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Track scroll to trigger animations
  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled down to projects section
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        const rect = projectsSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 0.8;
        
        if (isInView && !hasScrolled) {
          setHasScrolled(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section id="projects" className="py-24 bg-[#080808] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#6c63ff]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#6c63ff]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-16"
        >
          <div>
            <p className="text-[#6c63ff] font-semibold uppercase tracking-wider text-sm">
              SELECTED WORK
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-3 bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              My Projects
            </h2>
          </div>

          <Link
            to="/projects"
            className="hidden md:flex items-center gap-2 text-gray-400 hover:text-[#6c63ff] transition font-medium group"
          >
            View all
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>

        {/* Projects Grid - All same size */}
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 text-center py-12"
          >
            No projects available yet.
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate={hasScrolled ? "animate" : "initial"}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.slice(0, 6).map((project, index) => (
              <div key={project._id}>
                <ProjectCard
                  project={project}
                  onSelectProject={setSelectedProject}
                  index={index}
                  hasScrolled={hasScrolled}
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* View All Button - Mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="md:hidden mt-12 flex justify-center"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#6c63ff] to-[#5a52d5] hover:from-[#7d76ff] hover:to-[#6d61e8] text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#6c63ff]/50"
          >
            View all projects
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </section>
  );
}