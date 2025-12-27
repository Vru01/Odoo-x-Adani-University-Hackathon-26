import React from "react";
import { Outlet } from "react-router-dom"; // ✅ import Outlet


const Layout = () => {
  return (
       <>
       {/* Main content */}
      <main className="">
        <Outlet /> {/* ✅ This is where nested routes render */}
      </main>
       </>
  );
};

export default Layout;
