import { Link } from "react-router-dom";
import {
  ArrowRight,
  Download,
  Sparkles,
  Code2,
} from "lucide-react";
import heroImage from "../assets/hero.png";

export default function Hero() {
  const technologies = [
    "MongoDB",
    "Express.js",
    "React.js",
    "Node.js",
  ];

  return (
    <section
      id="home"
      className="
        relative
        min-h-[calc(100vh-73px)]
        w-full
        overflow-hidden
        bg-black
        text-white
        flex
        items-center
        mt-[40px]
      "
    >
      {/* =====================================================
          ANIMATED BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 pointer-events-none">
        {/* Large blue glow */}
        <div
          className="
            absolute
            -top-40
            -left-40
            w-[420px]
            h-[420px]
            rounded-full
            bg-blue-600/20
            blur-[130px]
            animate-pulse
          "
        />

        {/* Purple glow */}
        <div
          className="
            absolute
            -bottom-48
            -right-40
            w-[450px]
            h-[450px]
            rounded-full
            bg-purple-600/15
            blur-[140px]
            animate-pulse
          "
          style={{
            animationDelay: "1.5s",
          }}
        />

        {/* Center glow */}
        <div
          className="
            absolute
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-[500px]
            h-[500px]
            rounded-full
            bg-blue-500/[0.04]
            blur-[120px]
          "
        />

        {/* Small floating glow */}
        <div
          className="
            absolute
            top-[35%]
            right-[20%]
            w-32
            h-32
            rounded-full
            bg-blue-400/10
            blur-[70px]
            animate-pulse
          "
          style={{
            animationDelay: "2s",
          }}
        />

        {/* Grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)]
            bg-[size:55px_55px]
          "
        />

        {/* Radial fade */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_50%_40%,transparent_0%,#000_75%)]
          "
        />

        {/* Bottom fade */}
        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            h-32
            bg-gradient-to-t
            from-black
            to-transparent
          "
        />
      </div>

      {/* =====================================================
          MAIN CONTENT GRID
      ====================================================== */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-7xl
          mx-auto
          px-6
          sm:px-8
          lg:px-12
          py-15
          lg:py-14
        "
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start pt-10">

          {/* =====================================================
              LEFT SIDE - TEXT CONTENT
          ====================================================== */}

          <div className="max-w-2xl">

            {/* Developer Label */}
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-blue-500" />
              <p
                className="
                  text-blue-500
                  text-xs
                  sm:text-sm
                  font-semibold
                  tracking-[0.25em]
                  uppercase
                "
              >
                MERN FULL-STACK WEB DEVELOPER
              </p>
            </div>

            {/* Main Heading */}
            <h1
              className="
                text-5xl
                sm:text-6xl
                lg:text-7xl
                font-bold
                leading-tight
                tracking-[-0.02em]
                mb-6
              "
            >
              <span className="block">
                Vishwa
              </span>
              <span
                className="
                  block
                  bg-gradient-to-r
                  from-white
                  via-gray-300
                  to-gray-600
                  bg-clip-text
                  text-transparent
                "
              >
                Pramuditha
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                text-gray-400
                text-base
                sm:text-lg
                leading-relaxed
                mb-8
              "
            >
              I build modern, scalable and user-focused web
              applications using the{" "}
              <span className="text-white font-medium">
                MERN stack
              </span>
              {" "}— turning ideas into clean digital experiences.
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-10">
              {technologies.map((technology) => (
                <div
                  key={technology}
                  className="
                    flex
                    items-center
                    gap-2
                    px-3
                    py-1.5
                    rounded-lg
                    border
                    border-blue-500/40
                    bg-blue-500/[0.06]
                    text-xs
                    sm:text-sm
                    text-gray-300
                    hover:text-white
                    hover:border-blue-400/60
                    hover:bg-blue-500/[0.1]
                    transition-all
                    duration-300
                  "
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60" />
                  {technology}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                to="/projects"
                className="
                  inline-flex
                  items-center
                  gap-2.5
                  px-8
                  py-3.5
                  rounded-lg
                  bg-blue-600
                  hover:bg-blue-500
                  text-white
                  text-sm
                  sm:text-base
                  font-semibold
                  shadow-[0_0_25px_rgba(37,99,235,0.25)]
                  hover:shadow-[0_0_35px_rgba(37,99,235,0.4)]
                  transition-all
                  duration-300
                "
              >
                View My Work
                <ArrowRight size={18} />
              </Link>

              <a
                href="/resume.pdf"
                download
                className="
                  inline-flex
                  items-center
                  gap-2.5
                  px-8
                  py-3.5
                  rounded-lg
                  border-2
                  border-blue-600
                  bg-transparent
                  hover:bg-blue-600/10
                  text-blue-400
                  hover:text-white
                  text-sm
                  sm:text-base
                  font-semibold
                  transition-all
                  duration-300
                "
              >
                <Download size={20} />
                Download CV
              </a>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE - HERO IMAGE WITH ANIMATIONS
          ====================================================== */}

          <div className="hidden lg:flex items-start justify-center pt-8 pl-4">
            <div className="relative w-full max-w-sm">

              {/* Background glow */}
              <div
                className="
                  absolute
                  -inset-8
                  bg-blue-500/10
                  rounded-2xl
                  blur-2xl
                  animate-pulse
                  z-0
                "
                style={{
                  animationDuration: "3s",
                }}
              />

              {/* Main card container */}
              <div
                className="
                  relative
                  rounded-2xl
                  border
                  border-blue-500/30
                  overflow-hidden
                  bg-gradient-to-br
                  from-blue-900/20
                  to-transparent
                  shadow-[0_0_60px_rgba(37,99,235,0.3)]
                  hover:shadow-[0_0_80px_rgba(37,99,235,0.5)]
                  transition-all
                  duration-500
                  group
                  animate-[float_4s_ease-in-out_infinite]
                  z-10
                "
              >
                {/* Shimmer effect */}
                <div
                  className="
                    absolute
                    inset-0
                    rounded-2xl
                    bg-gradient-to-r
                    from-transparent
                    via-white/10
                    to-transparent
                    animate-[shimmer_3s_ease-in-out_infinite]
                    pointer-events-none
                    z-20
                  "
                />

                {/* Image */}
                <img
                  src={heroImage}
                  alt="Vishwa Pramuditha"
                  className="
                    w-full
                    h-auto
                    display-block
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                />

                {/* Info overlay */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    bg-gradient-to-t
                    from-black/90
                    via-black/50
                    to-transparent
                    p-6
                    pt-16
                    z-30
                  "
                >
                  <p className="text-white font-bold text-lg">
                    Vishwa Pramuditha
                  </p>
                  <p className="text-blue-400 text-sm font-medium mt-1">
                    Full-Stack Developer
                  </p>
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-500/50 rounded-tl-lg animate-pulse z-20" />
              <div
                className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-500/50 rounded-br-lg animate-pulse z-20"
                style={{
                  animationDelay: "0.5s",
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* =====================================================
          SCROLL INDICATOR
      ====================================================== */}

      <div
        className="
          absolute
          bottom-8
          left-1/2
          -translate-x-1/2
          flex
          flex-col
          items-center
          gap-3
          text-gray-600
          pointer-events-none
        "
      >

      </div>

      {/* =====================================================
          ANIMATION KEYFRAMES
      ====================================================== */}

      <style>{`

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

      `}</style>

    </section>
  );
}
