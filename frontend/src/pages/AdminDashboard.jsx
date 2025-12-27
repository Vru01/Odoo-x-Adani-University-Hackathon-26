import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 
import { 
  FiLogOut, FiCheckCircle, FiMenu, FiX, FiChevronRight, 
  FiFilter, FiSearch, FiLoader, FiAlertTriangle, FiActivity, FiUser, FiRefreshCw, FiSettings 
} from "react-icons/fi";
import { MdDashboard, MdLightbulb, MdWorkspaces } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi";
import { adminService, maintenanceService, authService } from "../services/service";

const SidebarItem = ({ item, isOpen, toggleSubMenu, currentPath }) => {
  const isActive = currentPath === item.path || currentPath.startsWith(item.path + "/");
  return (
    <div className="mb-1">
      {item.subMenu ? (
        <>
          <button onClick={() => toggleSubMenu(item.name)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? "text-[#702963] bg-purple-50" : "text-gray-600 hover:bg-gray-50"}`}>
            <div className="flex items-center gap-3"><span className="text-xl opacity-70">{item.icon}</span>{item.name}</div>
            <FiChevronRight className={`transition-transform duration-200 ${isOpen ? 'rotate-90 text-[#702963]' : 'text-gray-400'}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">
              {item.subMenu.map(sub => (<Link key={sub.name} to={sub.path} className={`block px-4 py-2 text-xs font-bold rounded-lg transition-colors ${currentPath === sub.path ? "text-[#702963] bg-white shadow-sm" : "text-gray-400 hover:text-[#702963]"}`}>{sub.name}</Link>))}
            </div>
          </div>
        </>
      ) : (
        <Link to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? "bg-[#702963] text-white shadow-lg shadow-purple-900/20" : "text-gray-600 hover:bg-gray-50"}`}>
          <span className="text-xl">{item.icon}</span> {item.name}
        </Link>
      )}
    </div>
  );
};

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, borderClass, loading }) => (
  <div className={`bg-white border-2 ${borderClass} p-6 rounded-3xl shadow-sm flex flex-col items-center text-center group hover:scale-[1.02] transition-transform duration-200`}>
    <p className={`${colorClass} text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2`}><Icon size={16} /> {title}</p>
    {loading ? <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-md mb-2"></div> : <h3 className="text-3xl font-black text-gray-900 mb-1">{value}</h3>}
    <p className={`${colorClass.replace('text-', 'bg-').replace('500', '50').replace('600', '50')} ${colorClass} bg-opacity-10 px-3 py-1 rounded-full text-[10px] font-bold`}>{subtext}</p>
  </div>
);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [stats, setStats] = useState({ critical: 0, load: 0, pending: 0 });
  const [allActivities, setAllActivities] = useState([]);
  const [displayActivities, setDisplayActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const dataFetchedRef = useRef(false);

  // SIDEBAR CONFIGURATION
  const navItems = [
    { name: "Home", path: "/admin/dashboard", icon: <MdDashboard /> },
    { name: "Equipment", path: "/equipment", icon: <MdLightbulb />, subMenu: [{ name: "Add New", path: "/equipment/create" }, { name: "View All", path: "/eq/all" }] },
    { name: "Teams", path: "/teams", icon: <RiTeamFill /> },
    { name: "Work Centers", path: "/work-centers", icon: <MdWorkspaces /> },
    { name: "Requests", path: "/requests", icon: <FiCheckCircle /> },
  ];

  // ADMIN ONLY SECTION
  if (user?.role === 'admin') {
    navItems.push({ 
        name: "Configuration", 
        path: "/admin/configuration", 
        icon: <FiSettings />,
        subMenu: [
            { name: "Master Data", path: "/admin/configuration" }, // Companies, Depts, Categories
            { name: "User Management", path: "/teams" } 
        ]
    });
  }

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const [statsRes, requestsRes] = await Promise.all([
        adminService.getDashboardStats(),
        maintenanceService.getAll()
      ]);
      setStats({
        critical: statsRes.data.critical || 0,
        load: statsRes.data.load || 0,
        pending: statsRes.data.pending || 0
      });
      const rawList = Array.isArray(requestsRes.data) ? requestsRes.data : (requestsRes.data.requests || []);
      const mappedData = rawList.map(item => ({
        id: item._id || item.id,
        subject: item.subject || "No Subject",
        employee: typeof item.created_by === 'object' ? item.created_by?.name : (item.created_by || "Unknown"), 
        technician: typeof item.technician === 'object' ? item.technician?.name : (item.technician || "Unassigned"),
        stage: item.status || "Pending",
        company: item.company || "Main Branch"
      }));
      setAllActivities(mappedData);
      setDisplayActivities(mappedData);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 429) setTimeout(() => { dataFetchedRef.current = false; fetchDashboardData(); }, 2000);
      else setErrorMsg("Could not load dashboard data.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!searchQuery) { setDisplayActivities(allActivities); return; }
    const lowerQuery = searchQuery.toLowerCase();
    setDisplayActivities(allActivities.filter(item => item.subject.toLowerCase().includes(lowerQuery) || item.employee.toLowerCase().includes(lowerQuery)));
  }, [searchQuery, allActivities]);

  const handleLogout = async () => {
    try { await authService.logout(localStorage.getItem('refreshToken')); } 
    finally { localStorage.clear(); navigate('/login'); }
  };

  const toggleSubMenu = (name) => setOpenSubMenus(prev => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="flex h-screen w-full bg-[#F3F4F6] text-[#111827] font-sans overflow-hidden">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/20 z-[100] md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-[110] w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-out shadow-2xl md:shadow-none md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#702963] flex items-center justify-center text-white shadow-lg shadow-purple-900/20"><HiSparkles size={20} /></div><p className="font-extrabold text-xl tracking-tight text-gray-900">HackFlow</p></div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
        </div>
        <nav className="flex-1 px-4 overflow-y-auto scrollbar-hide space-y-2">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 mt-2">Menu</p>
            {navItems.map((item) => (<SidebarItem key={item.name} item={item} isOpen={openSubMenus[item.name]} toggleSubMenu={toggleSubMenu} currentPath={location.pathname} />))}
        </nav>
        <div className="p-6 border-t border-gray-100"><div onClick={() => navigate('/profile')} className="w-full bg-gray-50 rounded-2xl p-3 flex items-center gap-3 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors group"><div className="w-10 h-10 rounded-xl bg-[#702963] flex items-center justify-center text-white font-black text-sm">{user?.full_name?.charAt(0) || "U"}</div><div className="flex-1 min-w-0 text-left"><p className="text-sm font-bold text-gray-900 truncate">{user?.full_name || "User"}</p><p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{user?.role || "Member"}</p></div><button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><FiLogOut /></button></div></div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB] h-full overflow-hidden relative">
        <header className="px-6 py-4 md:px-8 md:py-6 bg-white/80 backdrop-blur-md border-b border-gray-200 flex-shrink-0 sticky top-0 z-40">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-4"><button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"><FiMenu size={24} /></button><div><nav className="hidden sm:block text-[10px] font-black text-[#702963] uppercase tracking-widest mb-1">Overview</nav><h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1></div></div>
            <div className="flex items-center gap-3">
               <div className="relative hidden md:block group">{loading ? <FiLoader className="absolute left-3 top-1/2 -translate-y-1/2 text-[#702963] animate-spin" /> : <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}<input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="bg-gray-50 border border-transparent focus:bg-white focus:border-[#702963] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#702963]/10 w-64 transition-all" /></div>
               <Link to="/equipment/create" className="bg-[#111827] hover:bg-[#702963] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-gray-200 active:scale-95 transition-all flex items-center gap-2"><span className="text-lg">+</span> <span className="hidden sm:inline">New Action</span></Link>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
            {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between"><div className="flex items-center gap-2"><FiAlertTriangle /> <span className="text-sm font-bold">{errorMsg}</span></div><button onClick={() => { dataFetchedRef.current = false; fetchDashboardData(); }} className="text-xs bg-white border border-red-200 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"><FiRefreshCw /> Retry</button></div>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Critical Equipment" value={`${stats.critical} Units`} subtext="Health < 30%" icon={FiAlertTriangle} colorClass="text-red-500" borderClass="border-red-100 hover:border-red-200" loading={loading} />
              <StatCard title="Technician Load" value={`${stats.load}% Utilized`} subtext="Real-time Metrics" icon={FiActivity} colorClass="text-blue-500" borderClass="border-blue-100 hover:border-blue-200" loading={loading} />
              <StatCard title="Open Requests" value={`${stats.pending} Pending`} subtext="Action Required" icon={FiCheckCircle} colorClass="text-emerald-600" borderClass="border-emerald-100 hover:border-emerald-200" loading={loading} />
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
              <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white"><div><h2 className="text-lg font-bold text-gray-900">Live Feed</h2><p className="text-xs text-gray-400 mt-1">Maintenance Requests</p></div><button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#702963] bg-gray-50 hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors"><FiFilter /> Filter</button></div>
              <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="bg-gray-50/50 border-b border-gray-100"><th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Subject</th><th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Personnel</th><th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th><th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Location</th></tr></thead><tbody className="divide-y divide-gray-50">{loading ? [1,2].map(n=><tr key={n} className="animate-pulse"><td colSpan="4" className="px-8 py-6"><div className="h-4 bg-gray-100 w-1/2 rounded"></div></td></tr>) : displayActivities.map(row=>(<tr key={row.id} className="hover:bg-gray-50"><td className="px-8 py-5"><p className="text-sm font-bold">{row.subject}</p></td><td className="px-8 py-5"><span className="text-sm">{row.employee}</span></td><td className="px-8 py-5"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{row.stage}</span></td><td className="px-8 py-5 text-sm">{row.company}</td></tr>))}</tbody></table></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default AdminDashboard;