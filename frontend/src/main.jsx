import React, { StrictMode, useContext } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Layout from "./Layout.jsx";

// Dashboard & Pages
import DashBoard from "./pages/DashBoard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import WorkCenter from "./pages/WorkCenter.jsx";
import RequestForm from "./pages/RequestForm.jsx";

// Equipment Pages
import EquipmentTable from "./pages/Equipment/EquipmentTable.jsx";
import CreateEquipment from "./pages/Equipment/CreateEquipment.jsx";
import EditEquipment from "./pages/Equipment/EditEquipment.jsx";
import EquipmentCategory from "./pages/Equipment/EquipmentCategory.jsx";

import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";

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

            {/* 🔐 PROTECTED ROUTES */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard */}
              <Route path="/" element={<DashBoard />} />

              {/* Equipment */}
              <Route path="/equipment" element={<EquipmentTable />} />
              <Route path="/equipment/create" element={<CreateEquipment />} />
              <Route path="/equipment/edit/:id" element={<EditEquipment />} />
              <Route path="/equipment/categories" element={<EquipmentCategory />} />

              {/* Teams & Work */}
              <Route path="/teams" element={<TeamPage />} />
              <Route path="/work-center" element={<WorkCenter />} />

              {/* Requests */}
              <Route path="/requests" element={<RequestForm />} />

              {/* Profile */}
              <Route path="/profile" element={<Profile />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminDashboard />} />
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
