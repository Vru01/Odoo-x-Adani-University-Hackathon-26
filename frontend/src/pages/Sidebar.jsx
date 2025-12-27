import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiLogOut,
  FiChevronRight,
  FiX
} from "react-icons/fi";
import { MdDashboard, MdLightbulb, MdWorkspaces } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [openSubMenus, setOpenSubMenus] = React.useState({});

  const toggleSubMenu = (name) => {
    setOpenSubMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const navItems = [
    { name: "Home", path: "/", icon: <MdDashboard /> },

    {
      name: "Equipment",
      icon: <MdLightbulb />,
      subMenu: [
        { name: "Equipment Registry", path: "/equipment" },
        { name: "Add Equipment", path: "/equipment/create" },
        { name: "Equipment Categories", path: "/equipment/categories" }
      ]
    },

    {
      name: "Teams",
      icon: <RiTeamFill />,
      subMenu: [
        { name: "Team Management", path: "/teams" },
        { name: "Work Center", path: "/work-center" }
      ]
    },

    { name: "Requests", path: "/requests", icon: <MdWorkspaces /> },
    { name: "Admin", path: "/admin", icon: <MdWorkspaces /> },
  ];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-[110] w-64 bg-white border-r border-gray-200
        flex flex-col transition-transform duration-300
        md:relative md:translate-x-0
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}
    >
      {/* LOGO */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#702963] text-white flex items-center justify-center">
            <HiSparkles size={20} />
          </div>
          <p className="font-extrabold text-xl">HackFlow</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="md:hidden">
          <FiX size={22} />
        </button>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
          Operations
        </p>

        {navItems.map(item => (
          <div key={item.name}>
            {item.subMenu ? (
              <>
                <button
                  onClick={() => toggleSubMenu(item.name)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    {item.name}
                  </div>
                  <FiChevronRight
                    className={`transition-transform ${openSubMenus[item.name] ? "rotate-90 text-[#702963]" : ""}`}
                  />
                </button>

                {openSubMenus[item.name] && (
                  <div className="ml-9 border-l-2 border-gray-100">
                    {item.subMenu.map(sub => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        onClick={() => setIsOpen(false)}
                        className="block px-6 py-2 text-xs font-bold text-gray-400 hover:text-[#702963]"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${
                  location.pathname === item.path
                    ? "bg-[#702963] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* USER */}
      <div className="p-6 border-t">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#702963] text-white flex items-center justify-center font-black">
            M
          </div>
          <div className="flex-1">
            <p className="text-xs font-black">Mitchell Admin</p>
            <p className="text-[10px] text-gray-400 uppercase">System Lead</p>
          </div>
          <FiLogOut className="text-gray-300 hover:text-red-500 cursor-pointer" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
