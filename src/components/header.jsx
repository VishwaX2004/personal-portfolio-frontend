import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => {
    setOpen(false);
  };

  // =========================================================
  // SOCIAL LINKS
  // =========================================================

  const githubUrl =
    import.meta.env.VITE_GITHUB_URL ||
    "https://github.com/VishwaX2004";

  const linkedinUrl =
    import.meta.env.VITE_LLINKEDIN_URL ||
    "https://www.linkedin.com/in/vishwa-pramuditha-071b5331a";

  // =========================================================
  // SMOOTH SECTION NAVIGATION
  // =========================================================

  const goToSection = (sectionId) => {
    closeMenu();

    // If already on Home page
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);

      if (element) {
        const headerHeight = 80;

        const elementPosition =
          element.getBoundingClientRect().top +
          window.scrollY -
          headerHeight;

        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });

        // Update URL hash without reloading
        window.history.replaceState(
          null,
          "",
          `/#${sectionId}`
        );
      }

      return;
    }

    // If on another page, go to Home first
    navigate(`/#${sectionId}`);
  };

  // =========================================================
  // HOME NAVIGATION
  // =========================================================

  const goHome = () => {
    closeMenu();

    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      window.history.replaceState(null, "", "/");

      return;
    }

    navigate("/");
  };

  return (
    <header
      className="
        fixed
        top-0
        left-0
        w-full
        z-50

        bg-black/70
        backdrop-blur-2xl

        border-b
        border-white/[0.08]

        shadow-[0_10px_40px_rgba(0,0,0,0.25)]

        transition-all
        duration-500
      "
    >
      {/* =====================================================
          TOP LIGHT EFFECT
      ====================================================== */}

      <div
        className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2

          w-1/3
          h-px

          bg-gradient-to-r
          from-transparent
          via-blue-500/60
          to-transparent

          opacity-70

          pointer-events-none
        "
      />

      {/* =====================================================
          HEADER CONTAINER
      ====================================================== */}

      <div
        className="
          relative

          max-w-7xl
          mx-auto

          px-6
          py-4

          flex
          items-center
          justify-between
        "
      >
        {/* =====================================================
            LOGO
        ====================================================== */}

        <button
          type="button"
          onClick={goHome}
          className="
            group

            relative

            text-2xl
            font-bold
            tracking-tight
            text-white

            cursor-pointer

            transition-all
            duration-300

            hover:scale-[1.03]
          "
        >
          <span className="relative z-10">
            VISH
            <span
              className="
                text-blue-500

                transition-all
                duration-300

                group-hover:text-blue-400

                group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]
              "
            >
              .
            </span>
          </span>

          {/* Logo glow */}
          <span
            className="
              absolute
              -inset-2

              rounded-xl

              bg-blue-500/0

              blur-xl

              transition-all
              duration-500

              group-hover:bg-blue-500/10

              pointer-events-none
            "
          />
        </button>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <nav className="hidden md:flex items-center gap-2">
          {/* Home */}

          <button
            type="button"
            onClick={goHome}
            className="
              group

              relative

              px-4
              py-2.5

              text-base
              font-medium
              text-gray-200

              rounded-xl

              hover:text-white
              hover:bg-white/[0.04]

              transition-all
              duration-300

              cursor-pointer
            "
          >
            <span className="relative z-10">
              Home
            </span>

            <span
              className="
                absolute
                left-1/2
                bottom-1

                w-0
                h-px

                bg-blue-500

                -translate-x-1/2

                group-hover:w-5

                transition-all
                duration-300
              "
            />
          </button>

          {/* About */}

          <button
            type="button"
            onClick={() => goToSection("about")}
            className="
              group

              relative

              px-4
              py-2.5

              text-base
              font-medium
              text-gray-200

              rounded-xl

              hover:text-white
              hover:bg-white/[0.04]

              transition-all
              duration-300

              cursor-pointer
            "
          >
            <span className="relative z-10">
              About
            </span>

            <span
              className="
                absolute
                left-1/2
                bottom-1

                w-0
                h-px

                bg-blue-500

                -translate-x-1/2

                group-hover:w-5

                transition-all
                duration-300
              "
            />
          </button>

          {/* Skills */}

          <button
            type="button"
            onClick={() => goToSection("skills")}
            className="
              group

              relative

              px-4
              py-2.5

              text-base
              font-medium
              text-gray-200

              rounded-xl

              hover:text-white
              hover:bg-white/[0.04]

              transition-all
              duration-300

              cursor-pointer
            "
          >
            <span className="relative z-10">
              Skills
            </span>

            <span
              className="
                absolute
                left-1/2
                bottom-1

                w-0
                h-px

                bg-blue-500

                -translate-x-1/2

                group-hover:w-5

                transition-all
                duration-300
              "
            />
          </button>

          {/* Experience */}

          <button
            type="button"
            onClick={() => goToSection("experience")}
            className="
              group

              relative

              px-4
              py-2.5

              text-base
              font-medium
              text-gray-200

              rounded-xl

              hover:text-white
              hover:bg-white/[0.04]

              transition-all
              duration-300

              cursor-pointer
            "
          >
            <span className="relative z-10">
              Experience
            </span>

            <span
              className="
                absolute
                left-1/2
                bottom-1

                w-0
                h-px

                bg-blue-500

                -translate-x-1/2

                group-hover:w-5

                transition-all
                duration-300
              "
            />
          </button>

          {/* Projects */}

          <button
            type="button"
            onClick={() => goToSection("projects")}
            className="
              group

              relative

              px-4
              py-2.5

              text-base
              font-medium
              text-gray-200

              rounded-xl

              hover:text-white
              hover:bg-white/[0.04]

              transition-all
              duration-300

              cursor-pointer
            "
          >
            <span className="relative z-10">
              Projects
            </span>

            <span
              className="
                absolute
                left-1/2
                bottom-1

                w-0
                h-px

                bg-blue-500

                -translate-x-1/2

                group-hover:w-5

                transition-all
                duration-300
              "
            />
          </button>

          {/* Contact */}

          <button
            type="button"
            onClick={() => goToSection("contact")}
            className="
              group

              relative

              px-4
              py-2.5

              text-base
              font-medium
              text-gray-200

              rounded-xl

              hover:text-white
              hover:bg-white/[0.04]

              transition-all
              duration-300

              cursor-pointer
            "
          >
            <span className="relative z-10">
              Contact
            </span>

            <span
              className="
                absolute
                left-1/2
                bottom-1

                w-0
                h-px

                bg-blue-500

                -translate-x-1/2

                group-hover:w-5

                transition-all
                duration-300
              "
            />
          </button>
        </nav>

        {/* =====================================================
            DESKTOP SOCIAL LINKS
        ====================================================== */}

        <div className="hidden md:flex items-center gap-3">
          {/* GitHub */}

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="
              group

              relative

              w-10
              h-10

              flex
              items-center
              justify-center

              rounded-xl

              border
              border-white/10

              bg-white/[0.02]

              text-gray-400

              overflow-hidden

              hover:text-white
              hover:border-blue-500/40
              hover:bg-blue-500/10

              hover:-translate-y-1

              transition-all
              duration-300
            "
          >
            <span
              className="
                absolute
                inset-0

                bg-blue-500/0

                blur-xl

                transition-all
                duration-500

                group-hover:bg-blue-500/20
              "
            />

            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="
                relative
                z-10

                transition-transform
                duration-300

                group-hover:scale-110
              "
            >
              <path
                d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.621.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.944 0-1.091.39-1.984 1.029-2.682.103-.253.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682 0 3.844-2.339 4.688-4.566 4.936.359.309.678.92.678 1.855 0 1.338-.012 2.417-.012 2.746 0 .267.18.579.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z"
              />
            </svg>
          </a>

          {/* LinkedIn */}

          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="
              group

              relative

              w-10
              h-10

              flex
              items-center
              justify-center

              rounded-xl

              border
              border-white/10

              bg-white/[0.02]

              text-gray-400

              overflow-hidden

              hover:text-white
              hover:border-blue-500/40
              hover:bg-blue-500/10

              hover:-translate-y-1

              transition-all
              duration-300
            "
          >
            <span
              className="
                absolute
                inset-0

                bg-blue-500/0

                blur-xl

                transition-all
                duration-500

                group-hover:bg-blue-500/20
              "
            />

            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="
                relative
                z-10

                transition-transform
                duration-300

                group-hover:scale-110
              "
            >
              <path
                d="M20.447 20.452h-3.554v-5.569c0-1.328-.026-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.999h3.414v1.561h.046c.476-.9 1.637-1.85 3.37-1.85 3.605 0 4.273 2.372 4.273 5.456v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0-4.124zM7.119 20.452H3.555V8.999h3.564v11.453zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.205 24 24 23.227 24 22.271V1.729C24 .774 23.205 0 22.225 0z"
              />
            </svg>
          </a>
        </div>

        {/* =====================================================
            MOBILE MENU BUTTON
        ====================================================== */}

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="
            md:hidden

            group

            relative

            w-10
            h-10

            flex
            items-center
            justify-center

            rounded-xl

            border
            border-white/10

            bg-white/[0.02]

            text-gray-300

            hover:text-white
            hover:border-blue-500/40
            hover:bg-blue-500/10

            transition-all
            duration-300

            active:scale-95
          "
        >
          {open ? (
            <X
              size={22}
              className="
                transition-transform
                duration-300
                rotate-0
              "
            />
          ) : (
            <Menu
              size={22}
              className="
                transition-transform
                duration-300
                group-hover:scale-110
              "
            />
          )}
        </button>
      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      <div
        className={`
          md:hidden

          overflow-hidden

          transition-all
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]

          ${
            open
              ? "max-h-[600px] opacity-100"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <div
          className="
            bg-black/90
            backdrop-blur-2xl

            border-t
            border-white/[0.08]

            shadow-[0_20px_50px_rgba(0,0,0,0.4)]
          "
        >
          <nav className="flex flex-col px-6 py-6 gap-1">
            {/* Home */}

            <button
              type="button"
              onClick={goHome}
              className="
                group

                text-left

                px-4
                py-3

                rounded-xl

                text-base
                font-medium
                text-gray-200

                hover:text-white
                hover:bg-white/[0.05]

                transition-all
                duration-300

                active:scale-[0.98]
              "
            >
              <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                Home
              </span>
            </button>

            {/* About */}

            <button
              type="button"
              onClick={() => goToSection("about")}
              className="
                group

                text-left

                px-4
                py-3

                rounded-xl

                text-base
                font-medium
                text-gray-200

                hover:text-white
                hover:bg-white/[0.05]

                transition-all
                duration-300

                active:scale-[0.98]
              "
            >
              <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                About
              </span>
            </button>

            {/* Skills */}

            <button
              type="button"
              onClick={() => goToSection("skills")}
              className="
                group

                text-left

                px-4
                py-3

                rounded-xl

                text-base
                font-medium
                text-gray-200

                hover:text-white
                hover:bg-white/[0.05]

                transition-all
                duration-300

                active:scale-[0.98]
              "
            >
              <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                Skills
              </span>
            </button>

            {/* Experience */}

            <button
              type="button"
              onClick={() => goToSection("experience")}
              className="
                group

                text-left

                px-4
                py-3

                rounded-xl

                text-base
                font-medium
                text-gray-200

                hover:text-white
                hover:bg-white/[0.05]

                transition-all
                duration-300

                active:scale-[0.98]
              "
            >
              <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                Experience
              </span>
            </button>

            {/* Projects */}

            <button
              type="button"
              onClick={() => goToSection("projects")}
              className="
                group

                text-left

                px-4
                py-3

                rounded-xl

                text-base
                font-medium
                text-gray-200

                hover:text-white
                hover:bg-white/[0.05]

                transition-all
                duration-300

                active:scale-[0.98]
              "
            >
              <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                Projects
              </span>
            </button>

            {/* Contact */}

            <button
              type="button"
              onClick={() => goToSection("contact")}
              className="
                group

                text-left

                px-4
                py-3

                rounded-xl

                text-base
                font-medium
                text-gray-200

                hover:text-white
                hover:bg-white/[0.05]

                transition-all
                duration-300

                active:scale-[0.98]
              "
            >
              <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                Contact
              </span>
            </button>

            {/* =================================================
                MOBILE SOCIAL LINKS
            ================================================== */}

            <div
              className="
                flex
                items-center
                gap-3

                px-4
                pt-5
                mt-3

                border-t
                border-white/10
              "
            >
              {/* GitHub */}

              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="
                  group

                  relative

                  w-10
                  h-10

                  flex
                  items-center
                  justify-center

                  rounded-xl

                  border
                  border-white/10

                  bg-white/[0.02]

                  text-gray-400

                  overflow-hidden

                  hover:text-white
                  hover:border-blue-500/40
                  hover:bg-blue-500/10

                  hover:-translate-y-1

                  transition-all
                  duration-300
                "
              >
                <span
                  className="
                    absolute
                    inset-0

                    bg-blue-500/0

                    blur-xl

                    transition-all
                    duration-500

                    group-hover:bg-blue-500/20
                  "
                />

                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="
                    relative
                    z-10

                    transition-transform
                    duration-300

                    group-hover:scale-110
                  "
                >
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.621.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.944 0-1.091.39-1.984 1.029-2.682.103-.253.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682 0 3.844-2.339 4.688-4.566 4.936.359.309.678.92.678 1.855 0 1.338-.012 2.417-.012 2.746 0 .267.18.579.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z"
                  />
                </svg>
              </a>

              {/* LinkedIn */}

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="
                  group

                  relative

                  w-10
                  h-10

                  flex
                  items-center
                  justify-center

                  rounded-xl

                  border
                  border-white/10

                  bg-white/[0.02]

                  text-gray-400

                  overflow-hidden

                  hover:text-white
                  hover:border-blue-500/40
                  hover:bg-blue-500/10

                  hover:-translate-y-1

                  transition-all
                  duration-300
                "
              >
                <span
                  className="
                    absolute
                    inset-0

                    bg-blue-500/0

                    blur-xl

                    transition-all
                    duration-500

                    group-hover:bg-blue-500/20
                  "
                />

                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="
                    relative
                    z-10

                    transition-transform
                    duration-300

                    group-hover:scale-110
                  "
                >
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.026-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.999h3.414v1.561h.046c.476-.9 1.637-1.85 3.37-1.85 3.605 0 4.273 2.372 4.273 5.456v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0-4.124zM7.119 20.452H3.555V8.999h3.564v11.453zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227 24 24 24 22.271V1.729C24 .774 23.205 0 22.225 0z"
                  />
                </svg>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}