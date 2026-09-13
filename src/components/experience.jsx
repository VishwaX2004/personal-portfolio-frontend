import {
  Briefcase,
  GraduationCap,
  Calendar,
  MapPin,
} from "lucide-react";

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
    organization: "Self Learning",
    location: "Online",
    period: "2024 - Present",
    description:
      "Continuously learning and applying modern JavaScript technologies including React, Express, Node.js, MongoDB, REST APIs, authentication and responsive UI development.",
    icon: Briefcase,
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="py-24 bg-[#080808]"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="max-w-2xl mb-16">

          <p className="text-blue-500 font-semibold tracking-widest text-sm">
            MY JOURNEY
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-3">
            Experience & Education
          </h2>

          <p className="text-gray-500 mt-5 text-lg">
            A timeline of my learning journey, academic
            experience and development work.
          </p>

        </div>


        {/* Timeline */}

        <div className="relative">

          {/* Timeline line */}

          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2" />


          <div className="space-y-12">

            {experiences.map(
              (experience, index) => {

                const Icon =
                  experience.icon;

                const isRight =
                  index % 2 !== 0;

                return (
                  <div
                    key={`${experience.title}-${index}`}
                    className="relative"
                  >

                    {/* Timeline dot */}

                    <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-blue-600 border-4 border-[#080808] flex items-center justify-center z-10">

                      <Icon size={16} />

                    </div>


                    {/* Content */}

                    <div
                      className={`ml-16 md:ml-0 md:w-[calc(50%-40px)] ${
                        isRight
                          ? "md:ml-auto"
                          : ""
                      }`}
                    >

                      <div className="group bg-white/[0.03] border border-white/10 hover:border-blue-500/40 rounded-2xl p-6 md:p-7 transition-all duration-300 hover:-translate-y-1">

                        {/* Top */}

                        <div className="flex flex-wrap items-center gap-3">

                          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium">
                            {experience.type}
                          </span>

                          <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar size={13} />
                            {experience.period}
                          </span>

                        </div>


                        {/* Title */}

                        <h3 className="text-xl md:text-2xl font-semibold mt-5">
                          {experience.title}
                        </h3>


                        {/* Organization */}

                        <p className="text-blue-500 mt-2 font-medium">
                          {experience.organization}
                        </p>


                        {/* Location */}

                        <div className="flex items-center gap-2 text-gray-600 text-sm mt-3">

                          <MapPin size={14} />

                          {experience.location}

                        </div>


                        {/* Description */}

                        <p className="text-gray-400 leading-relaxed mt-5">
                          {experience.description}
                        </p>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </div>
    </section>
  );
}