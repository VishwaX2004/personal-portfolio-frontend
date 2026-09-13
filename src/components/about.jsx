import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Code2,
  Layers3,
  Sparkles,
  Terminal,
} from "lucide-react";

export default function About() {
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

          // Run animation only once
          observer.unobserve(section);
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="
        relative
        overflow-hidden
        bg-[#080808]
        text-white
        py-20
        sm:py-15
        lg:py-17
        mb-[20px]
      "
    >
      {/* =====================================================
          SIMPLE BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 pointer-events-none">

        {/* Blue glow */}

        <div
          className="
            absolute
            -top-40
            -left-40
            w-[350px]
            h-[350px]
            rounded-full
            bg-blue-600/[0.06]
            blur-[120px]
          "
        />

        {/* Purple glow */}

        <div
          className="
            absolute
            -bottom-40
            -right-40
            w-[350px]
            h-[350px]
            rounded-full
            bg-purple-600/[0.04]
            blur-[120px]
          "
        />

        {/* Subtle grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
            bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)]
            bg-[size:60px_60px]
          "
        />

      </div>


      {/* =====================================================
          MAIN CONTAINER
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
            SECTION LABEL
        ==================================================== */}

        <div
          className={`
            flex
            items-center
            gap-3
            mb-10
            transition-all
            duration-700
            ease-out
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }
          `}
        >

          <span className="w-8 h-px bg-blue-500" />

          <div className="flex items-center gap-2">

            <Sparkles
              size={14}
              className="text-blue-500"
            />

            <p
              className="
                text-xs
                sm:text-sm
                font-semibold
                tracking-[0.22em]
                uppercase
                text-blue-500
              "
            >
              About Me
            </p>

          </div>

        </div>


        {/* ===================================================
            MAIN GRID
        ==================================================== */}

        <div
          className="
            grid
            lg:grid-cols-[0.85fr_1.15fr]
            gap-10
            lg:gap-16
            items-center
          "
        >

          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <div
            className={`
              transition-all
              duration-1000
              ease-out
              ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }
            `}
          >

            {/* Small badge */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-1.5
                rounded-full
                border
                border-white/10
                bg-white/[0.025]
                mb-5
              "
            >

              <span
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-blue-500
                  shadow-[0_0_10px_rgba(59,130,246,0.8)]
                "
              />

              <span
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  text-gray-500
                "
              >
                Developer Profile
              </span>

            </div>


            {/* Heading */}

            <h2
              className="
                text-4xl
                sm:text-5xl
                lg:text-[3.7rem]
                font-bold
                tracking-[-0.04em]
                leading-[1.02]
              "
            >

              Developer.

              <br />

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
                Problem Solver.
              </span>

              <br />

              Creator.

            </h2>


            {/* Description */}

            <p
              className="
                mt-6
                max-w-md
                text-gray-500
                text-base
                sm:text-lg
                leading-relaxed
              "
            >
              Turning ideas into meaningful digital
              experiences through clean code, thoughtful
              design and modern web technologies.
            </p>


            {/* =================================================
                MINI CARDS
            ================================================== */}

            <div
              className="
                grid
                grid-cols-2
                gap-3
                mt-7
                max-w-md
              "
            >

              {/* MERN CARD */}

              <div
                className={`
                  group
                  p-4
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.025]
                  hover:bg-blue-500/[0.04]
                  hover:border-blue-500/30
                  hover:-translate-y-1
                  transition-all
                  duration-300
                  ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  }
                `}
                style={{
                  transitionDelay: "350ms",
                }}
              >

                <div
                  className="
                    w-9
                    h-9
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    bg-blue-500/10
                    border
                    border-blue-500/10
                    text-blue-500
                    mb-3
                    group-hover:scale-110
                    transition-transform
                    duration-300
                  "
                >

                  <Code2 size={17} />

                </div>

                <p className="text-sm font-semibold">
                  MERN Stack
                </p>

                <p
                  className="
                    text-[10px]
                    text-gray-600
                    mt-1
                    uppercase
                    tracking-wider
                  "
                >
                  Full-Stack Development
                </p>

              </div>


              {/* UI CARD */}

              <div
                className={`
                  group
                  p-4
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.025]
                  hover:bg-blue-500/[0.04]
                  hover:border-blue-500/30
                  hover:-translate-y-1
                  transition-all
                  duration-300
                  ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  }
                `}
                style={{
                  transitionDelay: "450ms",
                }}
              >

                <div
                  className="
                    w-9
                    h-9
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    bg-blue-500/10
                    border
                    border-blue-500/10
                    text-blue-500
                    mb-3
                    group-hover:scale-110
                    transition-transform
                    duration-300
                  "
                >

                  <Layers3 size={17} />

                </div>

                <p className="text-sm font-semibold">
                  Modern UI
                </p>

                <p
                  className="
                    text-[10px]
                    text-gray-600
                    mt-1
                    uppercase
                    tracking-wider
                  "
                >
                  User-Focused Design
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <div
            className={`
              transition-all
              duration-1000
              ease-out
              ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }
            `}
            style={{
              transitionDelay: "150ms",
            }}
          >

            {/* =================================================
                ABOUT CARD
            ================================================== */}

            <div
              className="
                relative
                rounded-2xl
                border
                border-white/10
                bg-white/[0.025]
                backdrop-blur-xl
                p-6
                sm:p-7
                lg:p-8
                overflow-hidden
                hover:border-white/15
                transition-colors
                duration-500
              "
            >

              {/* Subtle top line */}

              <div
                className="
                  absolute
                  top-0
                  left-8
                  right-8
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  via-blue-500/50
                  to-transparent
                "
              />


              {/* =================================================
                  CARD HEADER
              ================================================== */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  pb-5
                  mb-5
                  border-b
                  border-white/10
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-9
                      h-9
                      rounded-xl
                      bg-blue-500/10
                      border
                      border-blue-500/15
                      flex
                      items-center
                      justify-center
                      text-blue-500
                    "
                  >

                    <Terminal size={17} />

                  </div>

                  <div>

                    <p className="text-sm font-medium text-white">
                      A little about me
                    </p>

                    <p
                      className="
                        text-[10px]
                        text-gray-600
                        font-mono
                        mt-0.5
                      "
                    >
                      /vishwa/about
                    </p>

                  </div>

                </div>


                {/* Terminal dots */}

                <div className="flex items-center gap-1.5">

                  <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />

                  <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />

                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />

                </div>

              </div>


              {/* =================================================
                  CONTENT
              ================================================== */}

              <div className="space-y-5">

                <p
                  className="
                    text-gray-400
                    text-sm
                    sm:text-base
                    leading-7
                  "
                >
                  I'm a passionate full-stack developer who
                  enjoys turning ideas into real-world digital
                  products.
                </p>


                <p
                  className="
                    text-gray-400
                    text-sm
                    sm:text-base
                    leading-7
                  "
                >
                  My main focus is developing clean, scalable
                  and responsive applications using technologies
                  such as{" "}
                  <span className="text-white font-medium">
                    React
                  </span>
                  ,{" "}
                  <span className="text-white font-medium">
                    Node.js
                  </span>
                  ,{" "}
                  <span className="text-white font-medium">
                    Express
                  </span>
                  {" "}and{" "}
                  <span className="text-white font-medium">
                    MongoDB
                  </span>
                  .
                </p>


                <p
                  className="
                    text-gray-400
                    text-sm
                    sm:text-base
                    leading-7
                  "
                >
                  I continuously learn new technologies and
                  improve my problem-solving skills through
                  practical projects.
                </p>

              </div>


              {/* =================================================
                  CARD FOOTER
              ================================================== */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mt-7
                  pt-5
                  border-t
                  border-white/10
                "
              >

                <div className="flex items-center gap-2">

                  <span
                    className="
                      w-1.5
                      h-1.5
                      rounded-full
                      bg-blue-500
                      shadow-[0_0_10px_rgba(59,130,246,0.8)]
                      animate-pulse
                    "
                  />

                  <span
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      text-gray-600
                    "
                  >
                    Always learning
                  </span>

                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-gray-600
                    hover:text-blue-400
                    transition-colors
                  "
                >

                  <span
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.15em]
                    "
                  >
                    Keep building
                  </span>

                  <ArrowUpRight
                    size={13}
                    className="
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                      transition-transform
                    "
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                TECH STRIP
            ================================================== */}

            <div
              className={`
                flex
                flex-wrap
                gap-2
                mt-3
                transition-all
                duration-700
                ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }
              `}
              style={{
                transitionDelay: "650ms",
              }}
            >

              {[
                "Clean Code",
                "Responsive",
                "Scalable",
                "User Focused",
              ].map((item) => (

                <span
                  key={item}
                  className="
                    px-3
                    py-1.5
                    rounded-lg
                    border
                    border-white/10
                    bg-white/[0.02]
                    text-[10px]
                    uppercase
                    tracking-[0.1em]
                    text-gray-600
                    hover:text-blue-400
                    hover:border-blue-500/20
                    transition-all
                    duration-300
                  "
                >
                  {item}
                </span>

              ))}

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          BOTTOM LINE
      ====================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-1/2
          -translate-x-1/2
          w-2/3
          h-px
          bg-gradient-to-r
          from-transparent
          via-blue-500/30
          to-transparent
        "
      />

    </section>
  );
}