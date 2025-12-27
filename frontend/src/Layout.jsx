import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./pages/Sidebar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 overflow-hidden">
        <Outlet context={{ setIsSidebarOpen }} />
      </main>
    </div>
  );
};

export default Layout;
