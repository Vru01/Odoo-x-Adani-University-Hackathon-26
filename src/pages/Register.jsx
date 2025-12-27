import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { registerService } from "../services/service";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { setLoading, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerService(form);
      setSuccess("Account created successfully! Please login.");
      setForm({ username: "", email: "", password: "" });
      // ⏳ Navigate after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      const message =
        err.response?.data?.msg || "Registration failed. Try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4
    bg-gradient-to-br from-blue-400 via-blue-200 to-white"
    >
      {/* Register Card */}
      <div
        className="w-full max-w-md bg-white/30 backdrop-blur-2xl
      rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)]
      px-8 py-10"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-14 h-14 rounded-full bg-blue-500 text-white
          flex items-center justify-center shadow-lg"
          >
            <span className="text-xl">＋</span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Sign up to get started
        </p>

        {/* Error Alert */}
        {error && (
          <div
            className="mb-4 flex items-start gap-3 rounded-xl
    bg-red-100/70 border border-red-300 text-red-700
    px-4 py-3 text-sm shadow-md animate-fadeIn"
          >
            <span className="text-lg">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div
            className="mb-4 flex items-start gap-3 rounded-xl
    bg-green-100/70 border border-green-300 text-green-700
    px-4 py-3 text-sm shadow-md animate-fadeIn"
          >
            <span className="text-lg">✅</span>
            <p>{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 ml-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-full bg-white
            border border-gray-200 placeholder-gray-400 text-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 ml-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-full bg-white
            border border-gray-200 placeholder-gray-400 text-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 ml-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-full bg-white
            border border-gray-200 placeholder-gray-400 text-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full
            bg-gradient-to-r from-blue-500 to-blue-600
            text-white font-medium shadow-lg
            hover:from-blue-600 hover:to-blue-700
            transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-3">Already have an account?</p>
          <Link to="/login">
            <button
              className="px-8 py-2 rounded-full
            border border-blue-500 text-blue-600
            hover:bg-blue-500 hover:text-white transition"
            >
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
