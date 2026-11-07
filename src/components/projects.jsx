import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import ProjectCard from "./projectCard";
import ProjectDetailsModal from "./ProjectDetailsModal";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await API.get("/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section id="projects" className="py-24 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-12"
        >
          <div>
            <p className="text-[#6c63ff] font-semibold uppercase tracking-wider">
              SELECTED WORK
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              My Projects
            </h2>
          </div>

          <Link
            to="/projects"
            className="hidden md:flex text-gray-400 hover:text-[#6c63ff] transition font-medium"
          >
            View all →
          </Link>
        </motion.div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500"
          >
            No projects available yet.
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {projects.slice(0, 4).map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                onSelectProject={setSelectedProject}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {/* Mobile View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="md:hidden mt-8"
        >
          <Link
            to="/projects"
            className="inline-flex text-gray-400 hover:text-[#6c63ff] transition font-medium"
          >
            View all projects →
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