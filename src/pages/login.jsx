import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, ArrowLeft, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const response = await API.post("/auth/login", form);

      const user = response.data;

      // Make sure only admin can access dashboard
      if (!user.isAdmin) {
        toast.error("You don't have admin access.");
        return;
      }

      // Store authentication data
      localStorage.setItem("token", user.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        })
      );

      toast.success("Login successful!");

      navigate("/admin");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[120px]" />

        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[120px]" />

      </div>

      <div className="relative w-full max-w-md">

        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition mb-8"
        >
          <ArrowLeft size={18} />
          Back to portfolio
        </Link>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-xl">

          {/* Logo */}
          <div className="mb-8">

            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-5">
              <Lock size={22} />
            </div>

            <p className="text-blue-500 text-sm font-semibold tracking-widest">
              ADMIN PANEL
            </p>

            <h1 className="text-3xl font-bold mt-2">
              Welcome back
            </h1>

            <p className="text-gray-500 mt-2">
              Sign in to manage your portfolio.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label className="block text-sm text-gray-400 mb-2">
                Email address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 transition"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label className="block text-sm text-gray-400 mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 transition"
                />

              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl py-3.5 font-medium flex items-center justify-center gap-2 transition"
            >

              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <LogIn size={18} />
                </>
              )}

            </button>

          </form>

          <p className="text-xs text-gray-600 text-center mt-8">
            Private administration area
          </p>

        </div>

      </div>

    </div>
  );
}