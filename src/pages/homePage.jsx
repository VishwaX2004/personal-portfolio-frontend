import { Toaster } from "react-hot-toast";

import Header from "../components/Header";
import Footer from "../components/Footer";

import Hero from "../components/hero";
import About from "../components/about";
import Skills from "../components/skills";
import Experience from "../components/experience";
import Projects from "../components/projects";
import Contact from "../components/contacts";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">

      <Toaster position="top-right" />

      <Header />

      <main>

        {/* =================================================
            HERO
        ================================================= */}

        <Hero />


        {/* =================================================
            ABOUT
        ================================================= */}

        <About />


        {/* =================================================
            SKILLS
        ================================================= */}

        <Skills />


        {/* =================================================
            EXPERIENCE + EDUCATION
        ================================================= */}

        <Experience />


        {/* =================================================
            PROJECTS
        ================================================= */}

        <Projects />


        {/* =================================================
            CONTACT
        ================================================= */}

        <Contact />

      </main>

      <Footer />

    </div>
  );
}