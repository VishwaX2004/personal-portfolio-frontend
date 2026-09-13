import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../components/header";
import Footer from "../components/footer";

import API from "../services/api";
import ProjectCard from "../components/projectCard";

export default function ProjectsPage() {

  const [projects, setProjects] = useState([]);

  useEffect(() => {

    API.get("/projects")
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

  }, []);


  return (
    <div className="min-h-screen bg-black text-white">

      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-36 pb-24">

        <Link
          to="/"
          className="text-gray-500 hover:text-white"
        >
          ← Back Home
        </Link>


        <div className="mt-10">

          <p className="text-blue-500 font-semibold">
            MY WORK
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mt-3">
            All Projects
          </h1>

        </div>


        <div className="grid md:grid-cols-2 gap-6 mt-16">

          {projects.map((project) => (

            <ProjectCard
              key={project._id}
              project={project}
            />

          ))}

        </div>

      </main>

      <Footer />

    </div>
  );
}