import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import API from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ProjectDetails() {

  const { id } = useParams();

  const [project, setProject] = useState(null);


  useEffect(() => {

    API.get(`/projects/${id}`)
      .then((res) => {
        setProject(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

  }, [id]);


  if (!project) {

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );

  }


  return (
    <div className="min-h-screen bg-black text-white">

      <Header />

      <main className="max-w-6xl mx-auto px-6 pt-36 pb-24">

        <Link
          to="/projects"
          className="text-gray-500 hover:text-white"
        >
          ← Back to Projects
        </Link>


        <h1 className="text-5xl md:text-7xl font-bold mt-10">
          {project.title}
        </h1>


        <p className="text-blue-500 mt-4">
          {project.category}
        </p>


        {project.image && (

          <img
            src={project.image}
            alt={project.title}
            className="w-full rounded-3xl mt-12 max-h-[600px] object-cover"
          />

        )}


        <div className="max-w-3xl mt-12">

          <h2 className="text-2xl font-semibold">
            About the project
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed mt-5">
            {project.description}
          </p>


          <h2 className="text-2xl font-semibold mt-12">
            Technologies
          </h2>

          <div className="flex flex-wrap gap-3 mt-5">

            {project.technologies?.map((tech) => (

              <span
                key={tech}
                className="px-4 py-2 rounded-full bg-white/5"
              >
                {tech}
              </span>

            ))}

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}