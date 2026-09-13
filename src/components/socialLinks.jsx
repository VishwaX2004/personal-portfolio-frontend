import {
  Github,
  Linkedin,
  Mail,
  Facebook,
  Instagram,
} from "lucide-react";

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/",
    icon: Github,
  },

  {
    name: "LinkedIn",
    url: "https://linkedin.com/",
    icon: Linkedin,
  },

  {
    name: "Email",
    url: "mailto:your@email.com",
    icon: Mail,
  },

  {
    name: "Facebook",
    url: "https://facebook.com/",
    icon: Facebook,
  },

  {
    name: "Instagram",
    url: "https://instagram.com/",
    icon: Instagram,
  },
];

export default function SocialLinks({
  showLabels = false,
}) {
  return (
    <div className="flex items-center gap-3">

      {socialLinks.map((social) => {

        const Icon = social.icon;

        return (
          <a
            key={social.name}
            href={social.url}
            target={
              social.url.startsWith("mailto:")
                ? undefined
                : "_blank"
            }
            rel={
              social.url.startsWith("mailto:")
                ? undefined
                : "noreferrer"
            }
            aria-label={social.name}
            className={`group flex items-center gap-2 ${
              showLabels
                ? "px-4 py-2.5"
                : "w-10 h-10 justify-center"
            } rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300`}
          >

            <Icon
              size={18}
              className="group-hover:text-blue-500 transition"
            />

            {showLabels && (
              <span className="text-sm">
                {social.name}
              </span>
            )}

          </a>
        );
      })}

    </div>
  );
}