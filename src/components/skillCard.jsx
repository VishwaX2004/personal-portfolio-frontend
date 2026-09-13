import {
  SiReact,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiGithub,
  SiGit,
} from "react-icons/si";

import { Globe2, Database, Code2, Layers3 } from "lucide-react";

export default function SkillCard({ skill }) {
  // =========================================================
  // TECHNOLOGY ICONS
  // =========================================================

  const icons = {
    "React.js": SiReact,
    JavaScript: SiJavascript,
    "Node.js": SiNodedotjs,
    "Express.js": SiExpress,
    MongoDB: SiMongodb,
    "Tailwind CSS": SiTailwindcss,
    "Git & GitHub": SiGithub,
    "REST APIs": Globe2,
  };

  const Icon = icons[skill.name] || Code2;

  // =========================================================
  // CATEGORY ICONS
  // =========================================================

  const categoryIcons = {
    Frontend: Layers3,
    Backend: Code2,
    Database: Database,
    Language: Code2,
    Tools: SiGit,
  };

  const CategoryIcon =
    categoryIcons[skill.category] || Code2;

  // =========================================================
  // LEVEL WIDTH
  // =========================================================

  const levelWidth = {
    Advanced: "w-[90%]",
    Intermediate: "w-[65%]",
    Beginner: "w-[40%]",
  };

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        p-3
        sm:p-6
        rounded-2xl
        border
        border-white/10
        bg-white/[0.025]
        backdrop-blur-xl
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-blue-500/40
        hover:bg-blue-500/[0.035]
        hover:shadow-[0_20px_60px_rgba(37,99,235,0.10)]
      "
    >

      {/* =====================================================
          HOVER GLOW
      ====================================================== */}

      <div
        className="
          absolute
          -top-20
          -right-20
          w-40
          h-40
          rounded-full
          bg-blue-500/10
          blur-[70px]
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-500
          pointer-events-none
        "
      />

      {/* =====================================================
          TOP SHINE
      ====================================================== */}

      <div
        className="
          absolute
          inset-x-0
          top-0
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

      {/* =====================================================
          ICON
      ====================================================== */}

      <div className="flex items-start justify-between">

        <div
          className="
            relative
            w-14
            h-14
            rounded-2xl
            flex
            items-center
            justify-center
            border
            border-white/10
            bg-white/[0.04]
            text-blue-500
            transition-all
            duration-500
            group-hover:scale-110
            group-hover:rotate-3
            group-hover:border-blue-500/30
            group-hover:bg-blue-500/10
            group-hover:shadow-[0_0_30px_rgba(37,99,235,0.18)]
          "
        >

          {/* Icon glow */}

          <div
            className="
              absolute
              inset-0
              rounded-2xl
              bg-blue-500/10
              blur-xl
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-500
            "
          />

          <Icon
            size={27}
            className="
              relative
              z-10
              transition-transform
              duration-500
              group-hover:scale-110
            "
          />

        </div>


        {/* Number */}

        <span
          className="
            text-[10px]
            font-mono
            text-gray-700
            group-hover:text-blue-500/60
            transition-colors
            duration-300
          "
        >
          // DEV
        </span>

      </div>


      {/* =====================================================
          CATEGORY
      ====================================================== */}

      <div className="flex items-center gap-2 mt-6">

        <CategoryIcon
          size={13}
          className="
            text-blue-500/70
            transition-transform
            duration-300
            group-hover:scale-110
          "
        />

        <p
          className="
            text-blue-500
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.18em]
          "
        >
          {skill.category}
        </p>

      </div>


      {/* =====================================================
          SKILL NAME
      ====================================================== */}

      <h3
        className="
          text-xl
          font-semibold
          mt-2
          text-white
          tracking-tight
          transition-all
          duration-300
          group-hover:text-blue-400
        "
      >
        {skill.name}
      </h3>

    </div>
  );
}