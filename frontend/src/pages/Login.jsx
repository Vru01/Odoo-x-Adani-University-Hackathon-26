import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginService, googleLoginService } from "../services/service";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { login, loading, setLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔐 Normal Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginService(form);
      login(data.user, data.accessToken);

      setSuccess("Login successful!");
      // Wait 3 seconds before redirect
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000); // 3 seconds
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      const data = await googleLoginService(credentialResponse.credential);

      login(data.user, data.accessToken);
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000); // 3 seconds    } catch (err) {
      setError("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-200 to-white">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-2xl rounded-3xl px-8 py-10 shadow-lg">
        <h2 className="text-2xl font-semibold text-center">Welcome back</h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Login to get started
        </p>

        {/* Error Alert */}
        {error && (
          <div
            className="mb-4 flex items-start gap-3 rounded-xl
    bg-red-100/70 border border-red-300 text-red-700
    px-4 py-3 text-sm shadow-md animate-fadeIn"
          >
            <span className="text-lg">⚠️</span>
            <p className="mt-[0.3rem]">{error}</p>
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
        {/* Normal Login */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 ml-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 ml-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-full border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-3 text-center text-gray-500">OR</div>

        {/* Google Login */}
        <div className="flex justify-center rounded">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Sign-in failed")}
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-3">Not a member yet?</p>
          <Link to="/register">
            <button className="px-8 py-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
