import React from "react";
import { Outlet } from "react-router-dom"; // ✅ import Outlet
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at the top */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 mt-20">
        <Outlet /> {/* ✅ This is where nested routes render */}
      </main>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default Layout;
