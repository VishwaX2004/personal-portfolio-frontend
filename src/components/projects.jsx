import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import ProjectCard from "./projectCard";

export default function Projects() {

  const [projects, setProjects] = useState([]);

  useEffect(() => {

    const fetchProjects = async () => {

      try {

        const response = await API.get("/projects");

        setProjects(response.data);

      } catch (error) {

        console.error(
          "Failed to fetch projects:",
          error
        );

      }

    };

    fetchProjects();

  }, []);


  return (
    <section
      id="projects"
      className="py-24 bg-[#080808]"
    >

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-end mb-12">

          <div>

            <p className="text-blue-500 font-semibold">
              SELECTED WORK
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              My Projects
            </h2>

          </div>


          <Link
            to="/projects"
            className="hidden md:flex text-gray-400 hover:text-white"
          >
            View all →
          </Link>

        </div>


        {projects.length === 0 ? (

          <div className="text-gray-500">
            No projects available yet.
          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-6">

            {projects.slice(0, 4).map((project) => (

              <ProjectCard
                key={project._id}
                project={project}
              />

            ))}

          </div>

        )}

      </div>

    </section>
  );
}