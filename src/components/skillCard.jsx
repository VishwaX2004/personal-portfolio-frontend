export default function SkillCard({ skill }) {

  return (
    <div className="group p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300">

      <p className="text-blue-500 text-sm">
        {skill.category}
      </p>

      <h3 className="text-xl font-semibold mt-3">
        {skill.name}
      </h3>

      <p className="text-gray-500 text-sm mt-3">
        {skill.level}
      </p>

    </div>
  );
}