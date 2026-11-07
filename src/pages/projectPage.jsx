import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Header from "../components/header";
import Footer from "../components/footer";

import API from "../services/api";
import ProjectCard from "../components/projectCard";
import ProjectDetailsModal from "../components/ProjectDetailsModal";

export default function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    API.get("/projects")
      .then((res) => {
        setProjects(res.data || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
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
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-36 pb-24">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/" className="text-gray-400 hover:text-white transition">
            ← Back Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-10"
        >
          <p className="text-[#6c63ff] font-semibold uppercase tracking-wider">
            MY WORK
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mt-3">
            All Projects
          </h1>

          <p className="text-gray-400 mt-4 max-w-2xl">
            Explore my latest projects showcasing full-stack development,
            design, and creative solutions.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
          >
            {projects.map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                onSelectProject={setSelectedProject}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 mt-16"
          >
            <p className="text-gray-400 text-lg">No projects yet.</p>
          </motion.div>
        )}
      </main>

      <Footer />

      {/* Project Details Modal */}
      <ProjectDetailsModal
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </div>
  );
}