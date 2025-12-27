import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google"; // The button component
import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/service";

const Login = () => {
  const { login, setLoading, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 1. STANDARD EMAIL LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(form);
      const { user, accessToken, refreshToken } = response.data;
      
      login(user, accessToken, refreshToken);
      setSuccess("Login successful!");
      
      // Redirect based on role
      setTimeout(() => {
        if(user.role === 'admin') {
          navigate("/admin/dashboard", { replace: true });
        } else {
          // If you don't have a user dashboard yet, send them to admin or equipment
          navigate("/equipment", { replace: true });
        }
      }, 1000); 

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // 2. GOOGLE LOGIN HANDLER
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");
      
      // Send the Google Token to YOUR Backend
      const response = await authService.googleLogin(credentialResponse.credential);
      const { user, accessToken, refreshToken } = response.data;
      
      login(user, accessToken, refreshToken);
      setSuccess("Google Login successful!");

      setTimeout(() => {
        if(user.role === 'admin') {
           navigate("/admin/dashboard", { replace: true });
        } else {
           navigate("/equipment", { replace: true });
        }
      }, 1000);
      
    } catch (err) {
      console.error("Google Login Backend Error:", err);
      setError("Google Login failed on server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-3xl px-8 py-10 shadow-xl border border-gray-200">
        
        <h2 className="text-3xl font-bold text-center text-[#702963]">Welcome Back</h2>
        <p className="text-sm text-center text-gray-500 mb-8 mt-2">Please login to your account</p>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex gap-2">
             <span>⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex gap-2">
             <span>✅</span> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-black focus:border-[#702963] focus:ring-2 focus:ring-[#702963]/20 outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-black focus:border-[#702963] focus:ring-2 focus:ring-[#702963]/20 outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          <button disabled={loading} className="w-full py-3.5 rounded-xl bg-[#702963] text-white font-bold hover:bg-[#5a2150] transition-all shadow-lg shadow-[#702963]/30 disabled:opacity-60">
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
        </div>

        {/* GOOGLE BUTTON */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Sign-in failed")}
            theme="outline"
            shape="circle"
            width="300px"
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? <Link to="/register" className="text-[#702963] font-bold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;