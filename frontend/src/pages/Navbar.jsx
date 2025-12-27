import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FiBell,
  FiSearch,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMessageSquare,
  FiCalendar,
  FiChevronDown,
  FiChevronRight,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import {
  MdDashboard,
  MdLightbulb,
  MdWorkspaces,
} from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiSparkles } from "react-icons/hi";
import { FaTrophy } from "react-icons/fa";

const Navbar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [notificationMenu, setNotificationMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Mock notification data
  const notifications = [
    { id: 1, title: "Project Update", message: "Your project 'EcoTracker' has been approved!", time: "5 min ago", read: false, type: "success" },
    { id: 2, title: "Team Invitation", message: "Sarah invited you to join 'Quantum AI' team", time: "1 hour ago", read: false, type: "invitation" },
    { id: 3, title: "Deadline Reminder", message: "Submission deadline in 2 days", time: "3 hours ago", read: true, type: "reminder" },
    { id: 4, title: "New Message", message: "You have 3 unread messages", time: "1 day ago", read: true, type: "message" },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: "Home", path: "/", icon: <MdDashboard /> },
    { 
      name: "Equipment", 
      path: "/equipment", 
      icon: <MdLightbulb />,
      subMenu: [
        { name: "Add Equipment", path: "/equipment/add" },
        { name: "View All Equipment", path: "/equipment/list" },
        { name: "Maintenance Requests", path: "/equipment/requests" },
      ],
    },
    { 
      name: "Teams", 
      path: "/teams", 
      icon: <RiTeamFill />,
      subMenu: [
        { name: "Create Team", path: "/teams/add" },
        { name: "View Teams", path: "/teams/list" },
        { name: "Assign Technicians", path: "/teams/assign" },
      ],
    },
    { 
      name: "Requests", 
      path: "/requests", 
      icon: <FiCheckCircle />,
      subMenu: [
        { name: "New Request", path: "/requests/new" },
        { name: "My Requests", path: "/requests/mine" },
        { name: "Kanban Board", path: "/requests/kanban" },
      ],
    },
    { name: "Calendar", path: "/calendar", icon: <FiCalendar /> },
    { 
      name: "Reports", 
      path: "/reports", 
      icon: <MdWorkspaces />,
      subMenu: [
        { name: "Requests by Team", path: "/reports/team" },
        { name: "Requests by Equipment", path: "/reports/equipment" },
        { name: "Status Reports", path: "/reports/status" },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-lg"
            : "bg-gradient-to-r from-white via-blue-50/30 to-white border-b border-blue-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* LEFT */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenu(true)}
                className="lg:hidden btn btn-ghost btn-circle hover:bg-blue-50 transition-colors"
              >
                <HiMenuAlt3 className="w-6 h-6 text-gray-700" />
              </button>

              <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-md">
                  <HiSparkles className="text-white text-lg" />
                </div>
                <div className="leading-tight">
                  <p className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    HackFlow
                  </p>
                  <span className="text-xs text-gray-500 font-medium">
                    24H Hackathon
                  </span>
                </div>
              </Link>
            </div>

            {/* CENTER (DESKTOP) */}
            <div className="hidden lg:flex items-center gap-1 bg-white/50 rounded-full px-1 py-1 backdrop-blur-sm">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {item.icon} {item.name} {item.subMenu && <FiChevronDown className="w-4 h-4 ml-1" />}
                  </Link>
                  {item.subMenu && (
                    <div className="absolute left-0 mt-1 w-48 bg-white shadow-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-50">
                      {item.subMenu.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">

              {/* SEARCH */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim())
                    navigate(`/search?q=${searchQuery}`);
                }}
                className="hidden md:block"
              >
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search projects, teams..."
                    className="input input-bordered input-sm rounded-full pl-9 w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>

              {/* NOTIFICATION DROPDOWN */}
              {token && (
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => {
                      setNotificationMenu(!notificationMenu);
                      setProfileMenu(false);
                    }}
                    className="btn btn-ghost btn-circle relative hover:bg-blue-50 transition-colors"
                  >
                    <FiBell className="w-5 h-5 text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-blue-100 z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-blue-50 bg-gradient-to-r from-blue-50 to-white">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-gray-800">Notifications</p>
                            <button className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                              Mark all as read
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{unreadCount} unread notifications</p>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-blue-50 hover:bg-blue-50/50 transition-colors cursor-pointer ${
                                !notification.read ? "bg-blue-50/30" : ""
                              }`}
                              onClick={() => setNotificationMenu(false)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`mt-1 w-2 h-2 rounded-full ${notification.read ? "bg-gray-300" : "bg-blue-500"}`} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="font-semibold text-gray-800 text-sm">{notification.title}</p>
                                    <FiChevronRight className="text-gray-400 w-4 h-4" />
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                      <FiClock className="w-3 h-3" /> {notification.time}
                                    </span>
                                    {notification.type === "success" && <FiCheckCircle className="text-green-500 w-4 h-4" />}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 border-t border-blue-50 bg-blue-50/30">
                          <Link
                            to="/notifications"
                            onClick={() => setNotificationMenu(false)}
                            className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View all notifications
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* AUTH */}
              {!token ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="btn btn-outline btn-sm rounded-full border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-sm rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white hover:shadow-md hover:from-blue-600 hover:to-blue-500 transition-all shadow-sm"
                  >
                    Join Now
                  </Link>
                </div>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => {
                      setProfileMenu(!profileMenu);
                      setNotificationMenu(false);
                    }}
                    className="flex items-center gap-2 group"
                  >
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-shadow">
                        {user?.username?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                    </div>
                    <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${profileMenu ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {profileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-blue-100 z-50 overflow-hidden"
                      >
                        {/* USER INFO */}
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-50/50 border-b border-blue-100">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow">
                                {user?.username?.[0]?.toUpperCase() || "U"}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-800 truncate">{user?.username}</p>
                              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                                  Participant
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <FaTrophy className="w-3 h-3" />
                                  <span>120 pts</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* MENU ITEMS */}
                        <div className="py-2">
                          <Link
                            to="/profile"
                            onClick={() => setProfileMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                              <FiUser className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium">My Profile</p>
                              <p className="text-xs text-gray-500">View and edit profile</p>
                            </div>
                          </Link>

                          <Link
                            to="/messages"
                            onClick={() => setProfileMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                              <FiMessageSquare className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium">Messages</p>
                              <p className="text-xs text-gray-500">Chat with teams</p>
                            </div>
                          </Link>

                          <Link
                            to="/settings"
                            onClick={() => setProfileMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                              <FiSettings className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium">Settings</p>
                              <p className="text-xs text-gray-500">Preferences & privacy</p>
                            </div>
                          </Link>
                        </div>

                        {/* LOGOUT */}
                        <div className="border-t border-blue-100 p-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                          >
                            <FiLogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setMobileMenu(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 left-0 w-80 h-full bg-gradient-to-b from-white to-blue-50/30 z-50 shadow-2xl"
            >
              {/* HEADER */}
              <div className="p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
                    <HiSparkles className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                      HackFlow
                    </p>
                    <p className="text-sm text-gray-500">Hackathon Platform</p>
                  </div>
                </div>
                
                {token && user && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center text-white font-bold">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* MENU ITEMS */}
              <div className="p-4 space-y-1">
                {navItems.map((item) => (
                  <div key={item.name} className="mb-1">
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenu(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive(item.path)
                          ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {item.icon} <span className="font-medium">{item.name}</span>
                    </Link>
                    
                    {item.subMenu && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.subMenu.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            onClick={() => setMobileMenu(false)}
                            className="block px-4 py-2 text-gray-600 hover:bg-blue-50 rounded-lg"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* AUTH LINKS FOR MOBILE */}
              {!token && (
                <div className="p-4 border-t border-blue-100">
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenu(false)}
                      className="block text-center py-3 rounded-xl border border-blue-300 text-blue-600 font-medium hover:bg-blue-50 transition"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenu(false)}
                      className="block text-center py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 text-white font-medium shadow hover:shadow-md transition"
                    >
                      Join Now
                    </Link>
                  </div>
                </div>
              )}

              {/* FOOTER */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-100">
                <p className="text-xs text-gray-500 text-center">
                  © 2025 HackFlow. All rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
