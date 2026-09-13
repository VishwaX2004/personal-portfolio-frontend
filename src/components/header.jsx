import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X
} from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* =====================================================
            LOGO
        ====================================================== */}

        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-bold tracking-tight text-white"
        >
          VISH<span className="text-blue-500">.</span>
        </Link>


        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <nav className="hidden md:flex items-center gap-8">

          <a
            href="/#home"
            className="text-gray-300 hover:text-white transition"
          >
            Home
          </a>

          <a
            href="/#about"
            className="text-gray-300 hover:text-white transition"
          >
            About
          </a>

          <a
            href="/#skills"
            className="text-gray-300 hover:text-white transition"
          >
            Skills
          </a>

          <a
            href="/#experience"
            className="text-gray-300 hover:text-white transition"
          >
            Experience
          </a>

          <a
            href="/#projects"
            className="text-gray-300 hover:text-white transition"
          >
            Projects
          </a>

          <a
            href="/#contact"
            className="text-gray-300 hover:text-white transition"
          >
            Contact
          </a>

        </nav>


        {/* =====================================================
            DESKTOP SOCIAL LINKS
        ====================================================== */}

        <div className="hidden md:flex items-center gap-3">

          {/* GitHub */}

          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
          >

            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.621.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.944 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682 0 3.844-2.339 4.688-4.566 4.936.359.309.678.92.678 1.855 0 1.338-.012 2.417-.012 2.746 0 .267.18.579.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z"
              />
            </svg>

          </a>


          {/* LinkedIn */}

          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
          >

            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.34V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.1 20.45H3.54V8.99H7.1v11.46ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z"
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
          aria-label={
            open
              ? "Close menu"
              : "Open menu"
          }
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-blue-500/50 transition"
        >

          {open ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}

        </button>

      </div>


      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      {open && (

        <div className="md:hidden bg-black/95 border-t border-white/10">

          <nav className="flex flex-col px-6 py-6 gap-1">

            <a
              href="/#home"
              onClick={closeMenu}
              className="px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Home
            </a>

            <a
              href="/#about"
              onClick={closeMenu}
              className="px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              About
            </a>

            <a
              href="/#skills"
              onClick={closeMenu}
              className="px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Skills
            </a>

            <a
              href="/#experience"
              onClick={closeMenu}
              className="px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Experience
            </a>

            <a
              href="/#projects"
              onClick={closeMenu}
              className="px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Projects
            </a>

            <a
              href="/#contact"
              onClick={closeMenu}
              className="px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Contact
            </a>


            {/* =================================================
                MOBILE SOCIAL LINKS
            ================================================== */}

            <div className="flex items-center gap-3 px-4 pt-5 mt-3 border-t border-white/10">

              {/* GitHub */}

              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition"
              >

                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.621.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.944 0-1.091.39-1.984 1.029-2.682.103-.253.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682 0 3.844-2.339 4.688-4.566 4.936.359.309.678.92.678 1.855 0 1.338-.012 2.417-.012 2.746 0 .267.18.579.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z"
                  />
                </svg>

              </a>


              {/* LinkedIn */}

              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition"
              >

                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.34V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.1 20.45H3.54V8.99H7.1v11.46ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z"
                  />
                </svg>

              </a>

            </div>

          </nav>

        </div>

      )}

    </header>
  );
}

