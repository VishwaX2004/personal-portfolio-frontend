import { Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const SocialIcon = ({ type }) => {
    const icons = {
      github: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.621.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.944 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682 0 3.844-2.339 4.688-4.566 4.936.359.309.678.92.678 1.855 0 1.338-.012 2.417-.012 2.746 0 .267.18.579.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z" />
        </svg>
      ),
      linkedin: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.34V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.1 20.45H3.54V8.99H7.1v11.46ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z" />
        </svg>
      ),
      twitter: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23.953 4.57a10 10 0 002.856-9.753 9.958 9.958 0 01-2.828.856 4.958 4.958 0 00-8.611 4.519A14.102 14.102 0 012.798 3.031a4.822 4.822 0 00-.666 6.479 4.964 4.964 0 002.244 2.582c-.946-.301-1.888-.855-2.368-1.81-.048 1.734.418 3.582 1.659 4.848A4.88 4.88 0 002.5 13.34c1.296.789 2.531 1.12 3.91 1.028-1.506 3.34 3.218 6.614 6.852 5.544 3.634-1.07 5.506-5.16 4.691-8.648.946-.656 1.667-1.479 2-2.783z" />
        </svg>
      ),
    };
    return icons[type] || null;
  };

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/",
      icon: "github",
      color: "group-hover:text-white group-hover:shadow-lg group-hover:shadow-white/20",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/",
      icon: "linkedin",
      color: "group-hover:text-[#0a66c2] group-hover:shadow-lg group-hover:shadow-[#0a66c2]/30",
    },
    {
      name: "Twitter",
      href: "https://twitter.com/",
      icon: "twitter",
      color: "group-hover:text-[#1DA1F2] group-hover:shadow-lg group-hover:shadow-[#1DA1F2]/30",
    },
    {
      name: "Email",
      href: "mailto:dev.vishwapramuditha@gmail.com",
      icon: "mail",
      color: "group-hover:text-[#6c63ff] group-hover:shadow-lg group-hover:shadow-[#6c63ff]/30",
    },
  ];

  const footerLinks = [
    {
      title: "Navigation",
      links: [
        { name: "Home", href: "#home" },
        { name: "About", href: "#about" },
        { name: "Projects", href: "#projects" },
        { name: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "#" },
        { name: "Documentation", href: "#" },
        { name: "Portfolio", href: "#projects" },
        { name: "Resume", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", href: "#" },
        { name: "Terms", href: "#" },
        { name: "Cookies", href: "#" },
        { name: "Contact", href: "#contact" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-black">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6c63ff]/5 to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6c63ff]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6c63ff]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10">
        {/* Top Section - Branding & Newsletter */}
        <motion.div
          className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Branding */}
              <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.h2 className="text-4xl md:text-5xl font-bold" variants={itemVariants}>
                  VISH<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6c63ff] to-[#8e84ff]">.</span>
                </motion.h2>

                <motion.p className="text-gray-300 mt-4 leading-relaxed max-w-sm" variants={itemVariants}>
                  Full-stack developer crafting elegant digital experiences. Let's build something amazing together.
                </motion.p>

                {/* Social Links */}
                <motion.div className="flex gap-3 mt-6" variants={itemVariants}>
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.name}
                      className="group"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={`w-12 h-12 flex items-center justify-center rounded-xl border border-white/20 text-gray-400 transition-all duration-300 ${social.color} backdrop-blur-sm bg-white/5 hover:bg-white/10`}>
                        {social.icon === "mail" ? (
                          <Mail size={20} />
                        ) : (
                          <SocialIcon type={social.icon} />
                        )}
                      </div>
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>

              {/* Newsletter Signup */}
              <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="relative group">
                  {/* Animated gradient border */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#6c63ff] via-[#8e84ff] to-[#6c63ff] rounded-2xl blur opacity-30 group-hover:opacity-50 transition-all duration-300" />

                  <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
                    <p className="text-gray-400 text-sm mb-4">Get notified about new projects and updates.</p>

                    <form onSubmit={handleSubscribe} className="flex gap-2">
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#6c63ff]/50 focus:bg-white/10 transition-all duration-300"
                        required
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-[#6c63ff] to-[#8e84ff] text-white px-4 py-2 rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-[#6c63ff]/50 transition-all duration-300 flex items-center gap-2"
                      >
                        {subscribed ? "✓" : <ArrowRight size={16} />}
                      </motion.button>
                    </form>

                    {subscribed && (
                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[#6c63ff] text-sm mt-3">
                        Thanks for subscribing! 🎉
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Middle Section - Links Grid */}
        <motion.div
          className="border-b border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-3 gap-8">
              {footerLinks.map((section) => (
                <motion.div key={section.title} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{section.title}</h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <motion.li key={link.name} whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-[#6c63ff] transition-all duration-300 flex items-center gap-2 group"
                        >
                          <span className="w-1 h-1 bg-[#6c63ff] rounded-full opacity-0 group-hover:opacity-100 transition-all" />
                          {link.name}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Section - Copyright & Credits */}
        <motion.div
          className="border-t border-white/10 bg-gradient-to-b from-transparent to-white/5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <motion.p className="text-center md:text-left" variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                © {new Date().getFullYear()} Vish. Crafted with passion using React & Vite.
              </motion.p>

              <motion.div className="flex gap-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                <a href="#" className="hover:text-[#6c63ff] transition-colors duration-300">
                  Privacy
                </a>
                <a href="#" className="hover:text-[#6c63ff] transition-colors duration-300">
                  Terms
                </a>
                <a href="#" className="hover:text-[#6c63ff] transition-colors duration-300">
                  Sitemap
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

