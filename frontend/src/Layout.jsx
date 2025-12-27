import React from "react";
import { Outlet } from "react-router-dom";
// Import your existing Sidebar/Navbar here
// import Sidebar from "./components/Sidebar"; 

const Layout = () => {
  return (
    <div className="flex h-screen w-full bg-[#F3F4F6] overflow-hidden">
      {/* Sidebar remains fixed on the left */}
      {/* <Sidebar /> */}
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar could go here */}
        
        <main className="flex-1 overflow-y-auto">
          {/* This is where DashBoard, EquipmentList, etc., will be rendered */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;