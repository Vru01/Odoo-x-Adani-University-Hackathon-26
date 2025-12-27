import React, { StrictMode, useContext } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Layout from "./Layout.jsx";

import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import App from "./App.jsx";

/* 🔐 Protected Route */
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" replace />;
};

/* 🌐 Public Route */
const PublicRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? <Navigate to="/" replace /> : children;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>

            {/* 🔐 PROTECTED AREA */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<App />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* 🌐 PUBLIC ROUTES */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
