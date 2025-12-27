import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  FiLogOut, FiCheckCircle, FiStar,
  FiMenu, FiX, FiChevronRight, FiFilter, FiSearch, FiLoader, FiAlertTriangle
} from "react-icons/fi";
import { MdDashboard, MdLightbulb, MdWorkspaces } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi";

const AdminDashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});
  
  // 1. BACKEND STATES
  const [stats, setStats] = useState({ critical: 0, load: 0, pending: 0 });
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 2. FETCH DASHBOARD DATA
  const fetchDashboardData = useCallback(async (query = "") => {
    try {
      setLoading(true);
      
      // Simulating parallel API calls (Stats + Table)
      // const [statsRes, activityRes] = await Promise.all([
      //   axios.get('/api/v1/dashboard/stats'),
      //   axios.get(`/api/v1/dashboard/activity?search=${query}`)
      // ]);
      
      await new Promise(resolve => setTimeout(resolve, 800)); // Latency Simulation

      // Mock Data Update
      setStats({ critical: 5, load: 85, pending: 12 });
      setActivityData([
        { id: 1, subject: "Test activity", employee: "Mitchell Admin", technician: "Aka Foster", category: "computer", stage: "New Request", company: "My company" },
        { id: 2, subject: "UPS Failure", employee: "Sarah Chen", technician: "Mitchell Admin", category: "Power", stage: "In Progress", company: "Branch Office" }
      ].filter(item => item.subject.toLowerCase().includes(query.toLowerCase())));

    } catch (err) {
      console.error("Dashboard Sync Error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. EFFECT FOR SEARCH DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => fetchDashboardData(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchDashboardData]);

  const toggleSubMenu = (name) => {
    setOpenSubMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const navItems = [
    { name: "Home", path: "/", icon: <MdDashboard /> },
    { 
      name: "Equipment", path: "/equipment", icon: <MdLightbulb />,
      subMenu: [{ name: "Add New", path: "/eq/add" }, { name: "View All", path: "/eq/all" }] 
    },
    { 
      name: "Teams", path: "/teams", icon: <RiTeamFill />,
      subMenu: [{ name: "My Team", path: "/t/my" }, { name: "Manage", path: "/t/man" }]
    },
    { name: "Requests", path: "/requests", icon: <FiCheckCircle /> },
    { name: "Reports", path: "/reports", icon: <MdWorkspaces /> },
  ];

  return (
    <div className="flex h-screen w-full bg-[#F3F4F6] text-[#111827] overflow-hidden font-sans antialiased">
      
      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 
        ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#702963] flex items-center justify-center text-white">
              <HiSparkles size={20} />
            </div>
            <p className="font-extrabold text-xl tracking-tight">HackFlow</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-gray-400">
            <FiX size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
          <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Operations</p>
          {navItems.map((item) => (
            <div key={item.name}>
              {item.subMenu ? (
                <div className="mb-1">
                  <button onClick={() => toggleSubMenu(item.name)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname.startsWith(item.path) ? "text-[#702963] bg-purple-50/50" : "text-gray-600 hover:bg-gray-50"}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl opacity-50">{item.icon}</span> {item.name}
                    </div>
                    <FiChevronRight className={`transition-transform ${openSubMenus[item.name] ? 'rotate-90 text-[#702963]' : ''}`} />
                  </button>
                  {openSubMenus[item.name] && (
                    <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100">
                      {item.subMenu.map(sub => (
                        <Link key={sub.name} to={sub.path} className={`block px-6 py-2 text-xs font-bold ${location.pathname === sub.path ? "text-[#702963]" : "text-gray-400 hover:text-[#702963]"}`}>{sub.name}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to={item.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1 ${location.pathname === item.path ? "bg-[#702963] text-white shadow-lg shadow-purple-900/10" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <span className="text-xl">{item.icon}</span> {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-2 flex items-center gap-3 border border-gray-200">
            <div className="w-10 h-10 rounded-xl bg-[#702963] flex items-center justify-center text-white font-black">M</div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-black text-[#111827] truncate">Mitchell Admin</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">System Lead</p>
            </div>
            <button className="p-2 text-gray-300 hover:text-red-500 transition-colors"><FiLogOut /></button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB] h-full overflow-hidden">
        
        {/* HEADER */}
        <header className="px-6 py-4 md:px-8 md:py-6 bg-white border-b border-gray-100 flex-shrink-0">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <FiMenu size={24} />
              </button>
              <div>
                <nav className="hidden sm:block text-[10px] font-black text-[#702963] uppercase tracking-widest mb-1">Live Analytics</nav>
                <h1 className="text-xl md:text-2xl font-extrabold text-[#111827] tracking-tight">Admin Overview</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative hidden lg:block">
                {loading ? (
                  <FiLoader className="absolute left-3 top-1/2 -translate-y-1/2 text-[#702963] animate-spin" />
                ) : (
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                )}
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activities..." 
                  className="bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#702963] w-64 transition-all" 
                />
              </div>
              <Link to="/eq/add" className="bg-[#702963] text-white px-5 md:px-7 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-purple-900/10 active:scale-95 transition-all">
                New Action
              </Link>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto scrollbar-hide relative">
          
          {/* GLOBAL LOADER FOR DATA SYNC */}
          {loading && activityData.length === 0 && (
            <div className="absolute inset-0 z-50 bg-[#F9FAFB]/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
              <FiLoader className="text-[#702963] animate-spin mb-2" size={32} />
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Synchronizing Dashboard</span>
            </div>
          )}

          <div className="max-w-[1600px] mx-auto space-y-8">
            
            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-red-100 p-6 rounded-3xl shadow-sm flex flex-col items-center text-center group hover:border-red-300 transition-colors">
                <p className="text-red-500 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                  <FiAlertTriangle /> Critical Equipment
                </p>
                <h3 className="text-3xl font-black text-gray-900">{loading ? "..." : `${stats.critical} Units`}</h3>
                <p className="text-red-400 text-[10px] font-bold mt-1">(Health &lt; 30%)</p>
              </div>

              <div className="bg-white border-2 border-blue-100 p-6 rounded-3xl shadow-sm flex flex-col items-center text-center group hover:border-blue-300 transition-colors">
                <p className="text-blue-500 text-xs font-black uppercase tracking-widest mb-2">Technician Load</p>
                <h3 className="text-3xl font-black text-gray-900">{loading ? "..." : `${stats.load}% Utilized`}</h3>
                <p className="text-blue-400 text-[10px] font-bold mt-1">(Real-time Metrics)</p>
              </div>

              <div className="bg-white border-2 border-emerald-100 p-6 rounded-3xl shadow-sm flex flex-col items-center text-center group hover:border-emerald-300 transition-colors">
                <p className="text-emerald-600 text-xs font-black uppercase tracking-widest mb-2">Open Requests</p>
                <h3 className="text-3xl font-black text-gray-900">{loading ? "..." : `${stats.pending} Pending`}</h3>
                <p className="text-emerald-50 text-[10px] font-bold mt-1 bg-emerald-500 px-2 py-0.5 rounded-full">3 Overdue</p>
              </div>
            </div>

            {/* ACTIVITY LIST */}
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden transition-all">
              <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Live Maintenance Feed</h2>
                <button className="text-gray-400 hover:text-[#702963]"><FiFilter /></button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subjects</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stage</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Company</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {activityData.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-[#111827]">{row.subject}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{row.category} • Ref #00{row.id}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-600 font-medium">{row.employee}</span>
                            <span className="text-[9px] text-gray-400 font-black uppercase">Assignee: {row.technician}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="bg-[#702963]/10 text-[#702963] px-3 py-1 rounded-full text-[9px] font-black uppercase ring-1 ring-[#702963]/20">
                            {row.stage}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-400">{row.company}</td>
                      </tr>
                    ))}
                    {activityData.length === 0 && !loading && (
                      <tr>
                        <td colSpan="4" className="px-6 py-20 text-center text-gray-400 italic text-sm">No recent activities matching your criteria.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;