import { Link } from "react-router-dom";
import {
  ArrowRight,
  Download,
} from "lucide-react";

export default function Hero() {

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden"
    >

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[120px]" />

        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[120px]" />

      </div>


      <div className="relative max-w-7xl mx-auto px-6 w-full pt-24">

        <div className="max-w-4xl">

          <p className="text-blue-500 font-semibold mb-5 tracking-widest">
            FULL-STACK DEVELOPER
          </p>


          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">

            Building digital
            <br />

            <span className="text-gray-500">
              experiences
            </span>

            <br />

            that matter.

          </h1>


          <p className="mt-8 text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">

            I'm a passionate developer focused on creating
            modern, scalable and user-friendly web
            applications using the MERN stack.

          </p>


          <div className="flex flex-wrap gap-4 mt-10">

            <Link
              to="/projects"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 transition"
            >
              View My Work
              <ArrowRight size={18} />
            </Link>


            <a
              href="/resume.pdf"
              download
              className="px-6 py-3 border border-white/20 hover:bg-white/10 rounded-xl flex items-center gap-2 transition"
            >
              Download CV
              <Download size={18} />
            </a>

          </div>

        </div>

      </div>

    </section>
  );
}