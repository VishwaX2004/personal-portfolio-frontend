import { useState } from "react";
import { Mail, Send } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";

export default function Contact() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      await API.post("/messages", form);

      toast.success(
        "Message sent successfully!"
      );

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to send message"
      );

    } finally {

      setLoading(false);

    }

  };


  return (
    <section
      id="contact"
      className="py-24"
    >

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16">

          <div>

            <p className="text-blue-500 font-semibold">
              GET IN TOUCH
            </p>

            <h2 className="text-4xl md:text-6xl font-bold mt-4">
              Let's build something
              <span className="text-gray-500">
                {" "}great.
              </span>
            </h2>

            <p className="text-gray-400 mt-6 text-lg">
              Have a project idea, collaboration,
              or just want to say hello?
              Send me a message.
            </p>


            <div className="flex items-center gap-4 mt-10">

              <div className="p-4 rounded-xl bg-blue-500/10 text-blue-500">
                <Mail />
              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p>
                  your@email.com
                </p>

              </div>

            </div>

          </div>


          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500"
            />


            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your email"
              required
              className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500"
            />


            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500"
            />


            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your message"
              rows="6"
              required
              className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 resize-none"
            />


            <button
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl flex justify-center items-center gap-2 transition"
            >

              {loading
                ? "Sending..."
                : "Send Message"
              }

              <Send size={18} />

            </button>

          </form>

        </div>

      </div>

    </section>
  );
}