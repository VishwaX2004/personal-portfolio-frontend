import { Link } from "react-router-dom";
import {
  ArrowRight,
  Download,
  Sparkles,
  Code2,
  Braces,
  Database,
  Server,
  Terminal,
  Cpu,
} from "lucide-react";

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
          DECORATIVE TOP RIGHT
      ====================================================== */}

      <div
        className="
          absolute
          top-24
          right-6
          lg:right-12
          hidden
          md:flex
          items-center
          gap-2
          text-gray-700
          text-[10px]
          tracking-[0.3em]
          uppercase
          animate-pulse
          z-20
        "
      >

        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />

        Portfolio 2026

      </div>


      {/* =====================================================
          RIGHT SIDE ANIMATED DEVELOPER VECTOR
      ====================================================== */}

      <div
        className="
          absolute
          right-[4%]
          lg:right-[6%]
          xl:right-[8%]
          top-1/2
          -translate-y-1/2
          hidden
          lg:flex
          w-[390px]
          h-[390px]
          xl:w-[440px]
          xl:h-[440px]
          items-center
          justify-center
          pointer-events-none
          z-[5]
        "
      >

        {/* =================================================
            OUTER GLOW
        ================================================== */}

        <div
          className="
            absolute
            w-[310px]
            h-[310px]
            xl:w-[350px]
            xl:h-[350px]
            rounded-full
            bg-blue-500/[0.035]
            blur-[50px]
            animate-pulse
          "
        />


        {/* =================================================
            OUTER ORBIT
        ================================================== */}

        <div
          className="
            absolute
            w-[350px]
            h-[350px]
            xl:w-[400px]
            xl:h-[400px]
            rounded-full
            border
            border-blue-500/[0.12]
            animate-[spin_24s_linear_infinite]
          "
        >

          {/* Orbit particle */}

          <div
            className="
              absolute
              top-1/2
              -left-1
              w-2
              h-2
              rounded-full
              bg-blue-500
              shadow-[0_0_18px_rgba(59,130,246,0.9)]
            "
          />

        </div>


        {/* =================================================
            SECOND ORBIT
        ================================================== */}

        <div
          className="
            absolute
            w-[280px]
            h-[280px]
            xl:w-[320px]
            xl:h-[320px]
            rounded-full
            border
            border-white/[0.07]
            animate-[spin_18s_linear_infinite_reverse]
          "
        >

          <div
            className="
              absolute
              top-[12%]
              right-[8%]
              w-1.5
              h-1.5
              rounded-full
              bg-purple-500
              shadow-[0_0_15px_rgba(168,85,247,0.9)]
            "
          />

        </div>


        {/* =================================================
            THIRD ORBIT
        ================================================== */}

        <div
          className="
            absolute
            w-[215px]
            h-[215px]
            xl:w-[245px]
            xl:h-[245px]
            rounded-full
            border
            border-blue-400/[0.08]
            rotate-45
            animate-[spin_15s_linear_infinite]
          "
        >

          <div
            className="
              absolute
              bottom-[5%]
              left-[12%]
              w-1.5
              h-1.5
              rounded-full
              bg-blue-400
              shadow-[0_0_14px_rgba(96,165,250,0.9)]
            "
          />

        </div>


        {/* =================================================
            CENTRAL GLOW
        ================================================== */}

        <div
          className="
            absolute
            w-[190px]
            h-[190px]
            rounded-full
            bg-blue-600/[0.07]
            blur-[45px]
            animate-pulse
          "
        />


        {/* =================================================
            CENTRAL GLASS CARD
        ================================================== */}

        <div
          className="
            relative
            w-[165px]
            h-[165px]
            xl:w-[180px]
            xl:h-[180px]
            rounded-[32px]
            border
            border-white/[0.12]
            bg-white/[0.025]
            backdrop-blur-xl
            shadow-[0_0_80px_rgba(37,99,235,0.12)]
            flex
            items-center
            justify-center
            animate-[float_5s_ease-in-out_infinite]
          "
        >

          {/* Inner border */}

          <div
            className="
              absolute
              inset-3
              rounded-[25px]
              border
              border-blue-500/[0.12]
            "
          />

          {/* Code icon */}

          <div className="relative flex flex-col items-center">

            <div
              className="
                flex
                items-center
                justify-center
                w-20
                h-20
                rounded-2xl
                bg-blue-500/[0.08]
                border
                border-blue-500/[0.15]
                shadow-[0_0_35px_rgba(37,99,235,0.15)]
              "
            >

              <Code2
                size={42}
                strokeWidth={1.5}
                className="
                  text-blue-400
                  animate-pulse
                "
              />

            </div>


            <div
              className="
                mt-4
                text-[10px]
                tracking-[0.3em]
                text-gray-500
                uppercase
              "
            >
              Build • Create
            </div>

          </div>


          {/* Corner dots */}

          <span
            className="
              absolute
              top-5
              left-5
              w-1.5
              h-1.5
              rounded-full
              bg-blue-500
            "
          />

          <span
            className="
              absolute
              top-5
              right-5
              w-1.5
              h-1.5
              rounded-full
              bg-purple-500
            "
          />

          <span
            className="
              absolute
              bottom-5
              left-5
              w-1.5
              h-1.5
              rounded-full
              bg-gray-600
            "
          />

          <span
            className="
              absolute
              bottom-5
              right-5
              w-1.5
              h-1.5
              rounded-full
              bg-blue-400
            "
          />

        </div>


        {/* =================================================
            FLOATING MONGODB
        ================================================== */}

        <div
          className="
            absolute
            top-[5%]
            left-[5%]
            w-12
            h-12
            rounded-2xl
            border
            border-white/10
            bg-white/[0.035]
            backdrop-blur-xl
            flex
            items-center
            justify-center
            text-green-400
            shadow-[0_0_25px_rgba(34,197,94,0.08)]
            animate-[float_4s_ease-in-out_infinite]
          "
        >

          <Database size={20} />

        </div>


        {/* =================================================
            FLOATING REACT
        ================================================== */}

        <div
          className="
            absolute
            top-[13%]
            right-[2%]
            w-12
            h-12
            rounded-2xl
            border
            border-white/10
            bg-white/[0.035]
            backdrop-blur-xl
            flex
            items-center
            justify-center
            text-cyan-400
            shadow-[0_0_25px_rgba(34,211,238,0.08)]
            animate-[float_5s_ease-in-out_infinite]
          "
          style={{
            animationDelay: "1s",
          }}
        >

          <Braces size={20} />

        </div>


        {/* =================================================
            FLOATING NODE
        ================================================== */}

        <div
          className="
            absolute
            bottom-[12%]
            right-[4%]
            w-12
            h-12
            rounded-2xl
            border
            border-white/10
            bg-white/[0.035]
            backdrop-blur-xl
            flex
            items-center
            justify-center
            text-green-400
            shadow-[0_0_25px_rgba(34,197,94,0.08)]
            animate-[float_4.5s_ease-in-out_infinite]
          "
          style={{
            animationDelay: "0.5s",
          }}
        >

          <Server size={19} />

        </div>


        {/* =================================================
            FLOATING TERMINAL
        ================================================== */}

        <div
          className="
            absolute
            bottom-[5%]
            left-[7%]
            w-12
            h-12
            rounded-2xl
            border
            border-white/10
            bg-white/[0.035]
            backdrop-blur-xl
            flex
            items-center
            justify-center
            text-blue-400
            shadow-[0_0_25px_rgba(59,130,246,0.1)]
            animate-[float_5.5s_ease-in-out_infinite]
          "
          style={{
            animationDelay: "1.2s",
          }}
        >

          <Terminal size={19} />

        </div>


        {/* =================================================
            FLOATING CPU
        ================================================== */}

        <div
          className="
            absolute
            top-1/2
            -right-[2%]
            w-9
            h-9
            rounded-xl
            border
            border-white/10
            bg-white/[0.03]
            backdrop-blur-xl
            flex
            items-center
            justify-center
            text-purple-400
            animate-[float_4s_ease-in-out_infinite]
          "
          style={{
            animationDelay: "2s",
          }}
        >

          <Cpu size={16} />

        </div>


        {/* =================================================
            SMALL PARTICLES
        ================================================== */}

        <span
          className="
            absolute
            top-[28%]
            left-[18%]
            w-1
            h-1
            rounded-full
            bg-blue-400
            shadow-[0_0_10px_rgba(96,165,250,0.9)]
            animate-ping
          "
        />

        <span
          className="
            absolute
            bottom-[28%]
            right-[20%]
            w-1
            h-1
            rounded-full
            bg-purple-400
            shadow-[0_0_10px_rgba(192,132,252,0.9)]
            animate-ping
          "
          style={{
            animationDelay: "1s",
          }}
        />

        <span
          className="
            absolute
            top-[22%]
            right-[30%]
            w-1
            h-1
            rounded-full
            bg-white/40
            animate-pulse
          "
        />

        <span
          className="
            absolute
            bottom-[20%]
            left-[28%]
            w-1
            h-1
            rounded-full
            bg-white/30
            animate-pulse
          "
          style={{
            animationDelay: "1.5s",
          }}
        />

      </div>


      {/* =====================================================
          MAIN CONTENT
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
          py-10
          sm:py-12
          lg:py-14
        "
      >

        <div className="max-w-5xl">

          {/* =================================================
              STATUS BADGE
          ================================================== */}

         


          {/* =================================================
              DEVELOPER LABEL
          ================================================== */}

          <div
            className="
              flex
              items-center
              gap-3
              mb-4
              animate-[fadeIn_0.8s_ease-out_0.15s_both]
            "
          >

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


          {/* =================================================
              NAME
          ================================================== */}

          <h1
            className="
              text-[3.2rem]
              leading-[0.95]
              sm:text-6xl
              md:text-7xl
              lg:text-[5.5rem]
              xl:text-[6.2rem]
              font-bold
              tracking-[-0.045em]
              animate-[fadeIn_1s_ease-out_0.25s_both]
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


          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <p
            className="
              mt-6
              text-gray-400
              text-base
              sm:text-lg
              md:text-xl
              leading-relaxed
              max-w-2xl
              animate-[fadeIn_0.9s_ease-out_0.4s_both]
            "
          >
            I build modern, scalable and user-focused web
            applications using the{" "}
            <span className="text-white font-medium">
              MERN stack
            </span>
            {" "}— turning ideas into clean digital experiences.
          </p>


          {/* =================================================
              TECHNOLOGIES
          ================================================== */}

          <div
            className="
              flex
              flex-wrap
              gap-2
              mt-6
              animate-[fadeIn_0.9s_ease-out_0.5s_both]
            "
          >

            {technologies.map((technology, index) => (

              <div
                key={technology}
                className="
                  group
                  flex
                  items-center
                  gap-2
                  px-3
                  py-1.5
                  rounded-lg
                  border
                  border-white/10
                  bg-white/[0.025]
                  text-xs
                  sm:text-sm
                  text-gray-400
                  hover:text-white
                  hover:border-blue-500/40
                  hover:bg-blue-500/[0.06]
                  hover:-translate-y-0.5
                  transition-all
                  duration-300
                "
                style={{
                  animationDelay: `${0.55 + index * 0.08}s`,
                }}
              >

                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-blue-500/60
                    group-hover:bg-blue-400
                    transition
                  "
                />

                {technology}

              </div>

            ))}

          </div>


          {/* =================================================
              BUTTONS
          ================================================== */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
              mt-8
              animate-[fadeIn_0.9s_ease-out_0.65s_both]
            "
          >

            {/* View Projects */}

            <Link
              to="/projects"
              className="
                group
                relative
                overflow-hidden
                inline-flex
                items-center
                gap-2.5
                px-5
                sm:px-6
                py-3
                rounded-xl
                bg-blue-600
                hover:bg-blue-500
                text-white
                text-sm
                sm:text-base
                font-medium
                shadow-[0_0_25px_rgba(37,99,235,0.18)]
                hover:shadow-[0_0_35px_rgba(37,99,235,0.35)]
                hover:-translate-y-0.5
                transition-all
                duration-300
              "
            >

              {/* Shine */}

              <span
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  group-hover:translate-x-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/20
                  to-transparent
                  transition-transform
                  duration-700
                "
              />

              <span className="relative">
                View My Work
              </span>

              <ArrowRight
                size={17}
                className="
                  relative
                  group-hover:translate-x-1
                  transition-transform
                  duration-300
                "
              />

            </Link>


            {/* Download CV */}

            <a
              href="/resume.pdf"
              download
              className="
                group
                inline-flex
                items-center
                gap-2.5
                px-5
                sm:px-6
                py-3
                rounded-xl
                border
                border-white/10
                bg-white/[0.025]
                hover:bg-white/[0.07]
                hover:border-white/20
                text-gray-300
                hover:text-white
                text-sm
                sm:text-base
                font-medium
                backdrop-blur-xl
                hover:-translate-y-0.5
                transition-all
                duration-300
              "
            >

              <Download
                size={17}
                className="
                  group-hover:translate-y-0.5
                  transition-transform
                  duration-300
                "
              />

              Download CV

            </a>

          </div>


          {/* =================================================
              BOTTOM INFORMATION
          ================================================== */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-7
              gap-y-4
              mt-10
              pt-5
              border-t
              border-white/10
              max-w-3xl
              animate-[fadeIn_1s_ease-out_0.8s_both]
            "
          >

            {/* MERN */}

            <div className="group">

              <div className="flex items-center gap-2">

                <Code2
                  size={15}
                  className="text-blue-500"
                />

                <p className="text-lg sm:text-xl font-semibold">
                  MERN
                </p>

              </div>

              <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-[0.15em]">
                Full-Stack
              </p>

            </div>


            <div className="hidden sm:block h-8 w-px bg-white/10" />


            {/* Modern */}

            <div>

              <p className="text-lg sm:text-xl font-semibold">
                Modern
              </p>

              <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-[0.15em]">
                Web Experiences
              </p>

            </div>


            <div className="hidden sm:block h-8 w-px bg-white/10" />


            {/* Scalable */}

            <div>

              <p className="text-lg sm:text-xl font-semibold">
                Scalable
              </p>

              <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-[0.15em]">
                Applications
              </p>

            </div>


            <div className="hidden lg:block h-8 w-px bg-white/10" />


            {/* Decorative */}

            <div className="hidden lg:flex items-center gap-2 text-gray-600">

              <Sparkles
                size={14}
                className="text-blue-500/70"
              />

              <span className="text-[10px] tracking-[0.18em] uppercase">
                Building with purpose
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          RIGHT SIDE SCROLL INDICATOR
      ====================================================== */}

      <div
        className="
          absolute
          right-6
          xl:right-10
          top-1/2
          -translate-y-1/2
          hidden
          xl:flex
          flex-col
          items-center
          gap-4
          text-gray-700
          pointer-events-none
          z-20
        "
      >

        <div
          className="
            w-10
            h-10
            rounded-full
            border
            border-white/10
            flex
            items-center
            justify-center
            animate-pulse
          "
        >

          <div className="w-2 h-2 rounded-full bg-blue-500" />

        </div>

        <div className="w-px h-24 bg-gradient-to-b from-white/20 to-transparent" />

        <span
          className="
            text-[9px]
            tracking-[0.35em]
            [writing-mode:vertical-rl]
            uppercase
          "
        >
          Scroll to explore
        </span>

      </div>


      {/* =====================================================
          BOTTOM BORDER GLOW
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


      {/* =====================================================
          ANIMATION KEYFRAMES
      ====================================================== */}

      <style>{`

        @keyframes fadeIn {

          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

        @keyframes float {

          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-12px);
          }

        }

      `}</style>

    </section>
  );
}