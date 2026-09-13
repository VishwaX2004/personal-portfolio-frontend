import { useEffect, useRef, useState } from "react";

import {
  Sparkles,
  ArrowUpRight,
  Code2,
} from "lucide-react";

import SkillCard from "./skillCard";


// =========================================================
// SKILLS DATA
// =========================================================

const skills = [

  {
    name: "React.js",
    category: "Frontend",
    level: "Advanced",
  },

  {
    name: "JavaScript",
    category: "Language",
    level: "Advanced",
  },

  {
    name: "Node.js",
    category: "Backend",
    level: "Intermediate",
  },

  {
    name: "Express.js",
    category: "Backend",
    level: "Intermediate",
  },

  {
    name: "MongoDB",
    category: "Database",
    level: "Intermediate",
  },

  {
    name: "Tailwind CSS",
    category: "Frontend",
    level: "Advanced",
  },

  {
    name: "Git & GitHub",
    category: "Tools",
    level: "Intermediate",
  },

  {
    name: "REST APIs",
    category: "Backend",
    level: "Intermediate",
  },

];


// =========================================================
// SKILLS SECTION
// =========================================================

export default function Skills() {

  const sectionRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);


  // =========================================================
  // SCROLL REVEAL
  // =========================================================

  useEffect(() => {

    const section = sectionRef.current;

    if (!section) return;


    const observer = new IntersectionObserver(

      ([entry]) => {

        if (entry.isIntersecting) {

          setIsVisible(true);

          // Stop observing after the first reveal
          observer.unobserve(section);

        }

      },

      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
      }

    );


    observer.observe(section);


    return () => {

      observer.disconnect();

    };

  }, []);


  return (

    <section
      ref={sectionRef}
      id="skills"
      className="
        relative
        py-24
        sm:py-28
        lg:py-15
        overflow-hidden
        bg-black
        text-white
      "
    >

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 pointer-events-none">

        {/* Blue glow */}

        <div
          className="
            absolute
            top-20
            left-[-180px]
            w-[420px]
            h-[420px]
            rounded-full
            bg-blue-600/[0.08]
            blur-[130px]
            animate-pulse
          "
        />


        {/* Purple glow */}

        <div
          className="
            absolute
            bottom-0
            right-[-180px]
            w-[420px]
            h-[420px]
            rounded-full
            bg-purple-600/[0.06]
            blur-[130px]
            animate-pulse
          "
          style={{
            animationDelay: "1.5s",
          }}
        />


        {/* Grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)]
            bg-[size:55px_55px]
          "
        />


        {/* Radial fade */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_50%_20%,transparent_0%,#000_75%)]
          "
        />

      </div>


      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          px-6
          sm:px-8
          lg:px-12
        "
      >

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div
          className={`
            max-w-3xl
            mb-14
            transition-all
            duration-1000
            ease-out
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }
          `}
        >

          {/* Small label */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-full
              border
              border-blue-500/20
              bg-blue-500/[0.05]
              mb-5
            "
          >

            <Sparkles
              size={13}
              className="text-blue-500"
            />

            <span
              className="
                text-[10px]
                sm:text-xs
                uppercase
                tracking-[0.2em]
                text-blue-400
                font-medium
              "
            >
              My Toolkit
            </span>

          </div>


          {/* Heading */}

          <h2
            className="
              text-4xl
              sm:text-5xl
              lg:text-6xl
              font-bold
              tracking-[-0.04em]
              leading-tight
            "
          >

            Skills &{" "}

            <span
              className="
                bg-gradient-to-r
                from-white
                via-gray-300
                to-gray-600
                bg-clip-text
                text-transparent
              "
            >
              Technologies
            </span>

          </h2>

        </div>


        {/* ===================================================
            SKILL GRID
        ==================================================== */}

        <div
          className="
            grid
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
            lg:gap-5
          "
        >

          {skills.map((skill, index) => (

            <div
              key={skill.name}
              className={`
                transition-all
                duration-700
                ease-out
                ${
                  isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-10 scale-[0.96]"
                }
              `}
              style={{
                transitionDelay: isVisible
                  ? `${index * 90}ms`
                  : "0ms",
              }}
            >

              <SkillCard
                skill={skill}
              />

            </div>

          ))}

        </div>


        {/* ===================================================
            BOTTOM TOOLKIT BAR
        ==================================================== */}

        <div
          className={`
            relative
            mt-12
            p-5
            sm:p-6
            rounded-2xl
            border
            border-white/10
            bg-white/[0.02]
            backdrop-blur-xl
            overflow-hidden
            group
            transition-all
            duration-1000
            ease-out
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }
          `}
          style={{
            transitionDelay: isVisible
              ? "750ms"
              : "0ms",
          }}
        >

          {/* Hover glow */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-blue-500/[0.04]
              via-transparent
              to-purple-500/[0.04]
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-500
            "
          />


          <div
            className="
              relative
              flex
              flex-col
              sm:flex-row
              sm:items-center
              justify-between
              gap-5
            "
          >

            {/* Left */}

            <div className="flex items-center gap-4">

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  border
                  border-blue-500/20
                  bg-blue-500/10
                  flex
                  items-center
                  justify-center
                  text-blue-500
                  group-hover:scale-110
                  transition-transform
                  duration-300
                "
              >

                <Code2 size={20} />

              </div>


              <div>

                <p className="text-sm font-medium text-white">
                  Always learning. Always building.
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  Exploring new technologies and better ways
                  to build for the web.
                </p>

              </div>

            </div>


            {/* Right */}

            <div
              className="
                flex
                items-center
                gap-2
                text-gray-500
                group-hover:text-blue-400
                transition-colors
                duration-300
              "
            >

              <span
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                "
              >
                Keep exploring
              </span>

              <ArrowUpRight
                size={15}
                className="
                  group-hover:translate-x-1
                  group-hover:-translate-y-1
                  transition-transform
                  duration-300
                "
              />

            </div>

          </div>

        </div>

      </div>


      
    </section>

  );

}