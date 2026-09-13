import SkillCard from "./skillCard";

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

export default function Skills() {

  return (
    <section
      id="skills"
      className="py-24"
    >

      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-14">

          <p className="text-blue-500 font-semibold">
            MY TOOLKIT
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-3">
            Skills & Technologies
          </h2>

        </div>


        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {skills.map((skill) => (

            <SkillCard
              key={skill.name}
              skill={skill}
            />

          ))}

        </div>

      </div>

    </section>
  );
}