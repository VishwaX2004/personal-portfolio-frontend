import { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import API from "../services/api";

export default function Contact() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await API.post("/messages", form);

      toast.success("Message sent successfully! We'll get back to you soon.");
      
      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Reset submitted state after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      id="contact"
      className="py-24 bg-gradient-to-b from-[#080808] to-[#1a1a2e]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-16"
        >
          {/* Left Side - Contact Info */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-[#6c63ff] font-bold uppercase tracking-widest text-sm"
              >
                GET IN TOUCH
              </motion.p>

              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold mt-4 bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent"
              >
                Let's build something
                <span className="text-gray-500"> great together.</span>
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-300 mt-6 text-lg leading-relaxed"
              >
                Have a project idea, collaboration opportunity, or just want to say hello? Send me a message and I'll get back to you as soon as possible.
              </motion.p>
            </div>

            {/* Contact Details */}
            <motion.div 
              variants={itemVariants}
              className="space-y-4 mt-10"
            >
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#6c63ff]/10 to-[#5a52d5]/5 border border-[#6c63ff]/20 hover:border-[#6c63ff]/50 transition-all duration-300">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#5a52d5] text-white">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Email Address</p>
                  <a 
                    href="mailto:dev.vishwapramuditha@gmail.com"
                    className="text-white font-semibold hover:text-[#6c63ff] transition-colors"
                  >
                    dev.vishwapramuditha@gmail.com
                  </a>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20"
              >
                <p className="text-sm text-emerald-300 flex items-center gap-2">
                  <CheckCircle size={16} />
                  Typically responds within 24 hours
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            variants={itemVariants}
            className="space-y-5"
          >
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center gap-3"
              >
                <CheckCircle size={20} className="text-emerald-400" />
                <span className="text-emerald-300 font-medium">Message sent successfully!</span>
              </motion.div>
            )}

            {/* Name Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#6c63ff] focus:bg-white/10 transition-all duration-300 text-white placeholder-gray-500"
              />
            </motion.div>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#6c63ff] focus:bg-white/10 transition-all duration-300 text-white placeholder-gray-500"
              />
            </motion.div>

            {/* Subject Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                required
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#6c63ff] focus:bg-white/10 transition-all duration-300 text-white placeholder-gray-500"
              />
            </motion.div>

            {/* Message Textarea */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project or idea..."
                rows="6"
                required
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#6c63ff] focus:bg-white/10 transition-all duration-300 text-white placeholder-gray-500 resize-none"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full py-4 bg-gradient-to-r from-[#6c63ff] via-[#7d76ff] to-[#5a52d5] hover:from-[#7d76ff] hover:to-[#6d61e8] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex justify-center items-center gap-2 transition-all duration-300 font-bold text-white shadow-lg shadow-[#6c63ff]/30 hover:shadow-[#6c63ff]/50 border border-white/20"
            >
              {loading ? (
                <>
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    ⚡
                  </motion.span>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-xs text-gray-400 text-center"
            >
              I respect your privacy. Your message will only be used to respond to your inquiry.
            </motion.p>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}