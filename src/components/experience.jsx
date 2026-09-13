import { useEffect, useRef, useState } from "react";

import {
  Briefcase,
  GraduationCap,
  Calendar,
  MapPin,
  Sparkles,
  ExternalLink,
  Award,
} from "lucide-react";

// =========================================================
// EXPERIENCE DATA
// =========================================================

const experiences = [
  {
    type: "Education",
    title: "Bachelor's Degree in Information Technology",
    organization: "University of Ruhuna",
    location: "Sri Lanka",
    period: "2023 - Present",
    description:
      "Studying Information Technology with a focus on software development, web technologies, databases, networking, data structures, and software engineering.",
    icon: GraduationCap,
  },

  {
    type: "Project Experience",
    title: "Full-Stack Web Developer",
    organization: "Personal & Academic Projects",
    location: "Sri Lanka",
    period: "2024 - Present",
    description:
      "Developing full-stack web applications using React, Node.js, Express.js, MongoDB and modern frontend technologies. Building real-world projects to strengthen practical development skills.",
    icon: Briefcase,
  },

  {
    type: "Learning",
    title: "MERN Stack Development",
    organization: "SKYREK Digital Solutions",
    location: "Online",
    period: "2024 - Present",
    description:
      "Continuously learning and applying modern JavaScript technologies including React, Express, Node.js, MongoDB, REST APIs, authentication and responsive UI development.",
    icon: Briefcase,

    image: "/experience-certificate.png",

    imageTitle: "MERN Stack Development",

    imageDescription:
      "Certificate of Completion and Declaration of Participation",
  },
];

// =========================================================
// SCROLL REVEAL HOOK
// =========================================================

function useScrollReveal() {
  const [visible, setVisible] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);

          observer.unobserve(element);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

// =========================================================
// EXPERIENCE CARD
// =========================================================

function ExperienceCard({
  experience,
  index,
  isRight,
}) {
  const [ref, visible] =
    useScrollReveal();

  const Icon = experience.icon;

  return (
    <div
      ref={ref}
      className={`
        relative

        transition-all
        duration-700
        ease-[cubic-bezier(0.22,1,0.36,1)]

        ${
          visible
            ? "opacity-100 translate-y-0 translate-x-0 scale-100"
            : `opacity-0 translate-y-10 ${
                isRight
                  ? "md:translate-x-10"
                  : "md:-translate-x-10"
              } scale-[0.97]`
        }
      `}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >

      {/* =================================================
          TIMELINE DOT
      ================================================= */}

      <div
        className={`
          absolute
          left-[20px]
          md:left-1/2
          -translate-x-1/2

          w-10
          h-10

          rounded-full

          bg-[#080808]

          border
          border-blue-500/40

          flex
          items-center
          justify-center

          z-20

          transition-all
          duration-700

          ${
            visible
              ? "scale-100 opacity-100"
              : "scale-50 opacity-0"
          }
        `}
      >

        <div
          className="
            absolute
            inset-1
            rounded-full
            bg-blue-500/10
          "
        />

        <Icon
          size={16}
          className="
            relative
            z-10
            text-blue-500
          "
        />

      </div>


      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className={`
          ml-16
          md:ml-0

          md:w-[calc(50%-40px)]

          ${isRight ? "md:ml-auto" : ""}
        `}
      >

        <div
          className="
            group
            relative
            overflow-hidden

            rounded-2xl

            border
            border-white/10

            bg-white/[0.025]

            backdrop-blur-xl

            p-6
            md:p-7

            transition-all
            duration-500

            hover:-translate-y-2

            hover:border-blue-500/30

            hover:bg-white/[0.04]

            hover:shadow-[0_20px_60px_rgba(37,99,235,0.08)]
          "
        >

          {/* CARD GLOW */}

          <div
            className="
              absolute
              -top-24
              -right-24

              w-48
              h-48

              rounded-full

              bg-blue-500/[0.07]

              blur-[80px]

              opacity-0

              group-hover:opacity-100

              transition-opacity
              duration-700

              pointer-events-none
            "
          />


          {/* TOP BLUE LINE */}

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

              opacity-0

              group-hover:opacity-100

              transition-opacity
              duration-500
            "
          />


          {/* TOP INFORMATION */}

          <div
            className="
              relative
              flex
              flex-wrap
              items-center
              gap-3
            "
          >

            <span
              className="
                inline-flex
                items-center

                px-3
                py-1

                rounded-full

                bg-blue-500/10

                border
                border-blue-500/10

                text-blue-400

                text-[11px]

                font-medium

                uppercase

                tracking-wide
              "
            >
              {experience.type}
            </span>


            <span
              className="
                flex
                items-center
                gap-1.5

                text-xs
                text-gray-600
              "
            >
              <Calendar size={13} />

              {experience.period}
            </span>

          </div>


          {/* TITLE */}

          <h3
            className="
              relative

              text-xl
              md:text-2xl

              font-semibold

              mt-5

              tracking-tight

              text-white

              group-hover:text-blue-400

              transition-colors
              duration-300
            "
          >
            {experience.title}
          </h3>


          {/* ORGANIZATION */}

          <p
            className="
              relative

              text-blue-500

              mt-2

              font-medium
            "
          >
            {experience.organization}
          </p>


          {/* LOCATION */}

          <div
            className="
              relative

              flex
              items-center
              gap-2

              text-gray-600

              text-sm

              mt-3
            "
          >
            <MapPin size={14} />

            {experience.location}
          </div>


          {/* DESCRIPTION */}

          <p
            className="
              relative

              text-gray-400

              leading-relaxed

              mt-5

              text-sm
              md:text-base
            "
          >
            {experience.description}
          </p>


          {/* =================================================
              CERTIFICATE
          ================================================= */}

          {experience.image && (
            <div className="relative mt-7">

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <Award
                    size={15}
                    className="text-blue-500"
                  />

                  <span
                    className="
                      text-xs
                      uppercase
                      tracking-[0.15em]
                      text-gray-500
                    "
                  >
                    Certification
                  </span>

                </div>


                <ExternalLink
                  size={14}
                  className="
                    text-gray-700

                    group-hover:text-blue-500

                    transition-colors
                    duration-300
                  "
                />

              </div>


              {/* IMAGE */}

              <div
                className="
                  relative
                  overflow-hidden

                  rounded-xl

                  border
                  border-white/10

                  bg-black/40

                  group/certificate
                "
              >

                <img
                  src={experience.image}
                  alt={experience.imageTitle}
                  className="
                    w-full
                    h-auto

                    object-cover

                    transition-transform
                    duration-700
                    ease-out

                    group-hover/certificate:scale-[1.025]
                  "
                />

                <div
                  className="
                    absolute
                    inset-0

                    bg-gradient-to-t
                    from-black/40
                    via-transparent
                    to-transparent

                    opacity-0

                    group-hover/certificate:opacity-100

                    transition-opacity
                    duration-500

                    pointer-events-none
                  "
                />

              </div>


              <p
                className="
                  text-[11px]
                  text-gray-600

                  mt-2

                  text-center
                "
              >
                {experience.imageDescription}
              </p>

            </div>
          )}


          {/* BOTTOM INDICATOR */}

          <div
            className="
              relative

              flex
              items-center
              gap-2

              mt-6
              pt-5

              border-t
              border-white/10
            "
          >

            <span
              className="
                w-1.5
                h-1.5

                rounded-full

                bg-blue-500

                shadow-[0_0_10px_rgba(59,130,246,0.7)]
              "
            />

            <span
              className="
                text-[10px]

                uppercase
                tracking-[0.16em]

                text-gray-700

                group-hover:text-blue-500/60

                transition-colors
                duration-300
              "
            >
              {experience.type === "Education"
                ? "Academic Journey"
                : experience.type ===
                  "Project Experience"
                ? "Building & Learning"
                : "Continuous Learning"}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

// =========================================================
// EXPERIENCE SECTION
// =========================================================

export default function Experience() {
  const [headingRef, headingVisible] =
    useScrollReveal();

  return (
    <section
      id="experience"
      className="
        relative

        scroll-mt-20

        py-24
        sm:py-28
        lg:py-5

        overflow-hidden

        bg-[#080808]
      "
    >

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="
          absolute
          inset-0

          pointer-events-none
        "
      >

        {/* BLUE GLOW */}

        <div
          className="
            absolute

            top-20
            -left-40

            w-[400px]
            h-[400px]

            rounded-full

            bg-blue-600/[0.06]

            blur-[120px]

            animate-pulse
          "
        />


        {/* PURPLE GLOW */}

        <div
          className="
            absolute

            bottom-20
            -right-40

            w-[400px]
            h-[400px]

            rounded-full

            bg-purple-600/[0.04]

            blur-[120px]

            animate-pulse
          "
          style={{
            animationDelay: "1.5s",
          }}
        />


        {/* GRID */}

        <div
          className="
            absolute
            inset-0

            opacity-[0.018]

            bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)]

            bg-[size:55px_55px]
          "
        />


        {/* RADIAL FADE */}

        <div
          className="
            absolute
            inset-0

            bg-[radial-gradient(circle_at_50%_20%,transparent_0%,#080808_75%)]
          "
        />

      </div>


      {/* =================================================
          CONTENT
      ================================================= */}

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

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div
          ref={headingRef}
          className={`
            max-w-2xl
            mb-16

            transition-all
            duration-700

            ease-[cubic-bezier(0.22,1,0.36,1)]

            ${
              headingVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }
          `}
        >

          {/* LABEL */}

          <div
            className="
              inline-flex
              items-center
              gap-2

              mb-5

              px-3
              py-1.5

              rounded-full

              border
              border-blue-500/20

              bg-blue-500/[0.05]
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
              My Journey
            </span>

          </div>


          {/* HEADING */}

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
            Experience{" "}

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
              & Education
            </span>
          </h2>


          {/* DESCRIPTION */}

          <p
            className="
              text-gray-500

              mt-5

              text-base
              sm:text-lg

              leading-relaxed

              max-w-xl
            "
          >
            A timeline of my academic journey,
            development experience and continuous
            learning.
          </p>

        </div>


        {/* =================================================
            TIMELINE
        ================================================= */}

        <div className="relative">

          {/* TIMELINE LINE */}

          <div
            className="
              absolute

              left-[20px]

              md:left-1/2

              top-0
              bottom-0

              w-px

              bg-gradient-to-b
              from-blue-500/40
              via-white/10
              to-transparent

              md:-translate-x-1/2
            "
          />


          {/* ITEMS */}

          <div className="space-y-12">

            {experiences.map(
              (experience, index) => (
                <ExperienceCard
                  key={`${experience.title}-${index}`}
                  experience={experience}
                  index={index}
                  isRight={index % 2 !== 0}
                />
              )
            )}

          </div>

        </div>

      </div>


      {/* =================================================
          BOTTOM LINE
      ================================================= */}

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