import React, { useState } from "react";
import { authService } from "../services/service";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.signup(form);
      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-3xl px-8 py-10 shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#702963]">Get Started</h2>
        <p className="text-sm text-center text-gray-500 mb-8 mt-2">
          Create your GearGuard account
        </p>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
        {success && <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-black focus:border-[#702963] focus:ring-2 focus:ring-[#702963]/20 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-black focus:border-[#702963] focus:ring-2 focus:ring-[#702963]/20 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="name@company.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-black focus:border-[#702963] focus:ring-2 focus:ring-[#702963]/20 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#702963] text-white font-bold tracking-wide hover:bg-[#5a2150] transition-all shadow-lg shadow-[#702963]/30 mt-2 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-[#702963] font-bold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;