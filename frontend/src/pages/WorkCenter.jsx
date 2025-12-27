import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  FiPlus, FiFilter, FiMoreVertical, FiLoader, FiAlertCircle,
  FiActivity, FiClock, FiDollarSign, FiTarget, FiSearch 
} from "react-icons/fi";

const WorkCenter = () => {
  const [workCenters, setWorkCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterQuery, setFilterQuery] = useState("");

  // 1. FETCH WORK CENTERS FROM BACKEND
  const fetchWorkCenters = useCallback(async (search = "") => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulating an API call to a manufacturing ERP backend
      // In production: const response = await axios.get(`/api/v1/work-centers?search=${search}`);
      const response = await axios.get("https://jsonplaceholder.typicode.com/posts?_limit=5");
      
      // Mapping dummy data to Work Center structure
      const formattedData = response.data.map((item, idx) => ({
        id: item.id,
        name: `Work Center ${String.fromCharCode(65 + idx)}`, // A, B, C...
        code: `WC-0${item.id}`,
        tag: idx % 2 === 0 ? "MANUFACTURING" : "FABRICATION",
        alternatives: "Backup-Unit-" + (idx + 1),
        costPerHour: 45.0 + (idx * 5),
        capacity: 1.0,
        timeEfficiency: 95.0 + idx,
        oeeTarget: 60.0 + (idx * 4),
      }));

      // Simulate server-side filtering
      const filtered = search 
        ? formattedData.filter(wc => wc.name.toLowerCase().includes(search.toLowerCase()) || wc.code.toLowerCase().includes(search.toLowerCase()))
        : formattedData;

      setWorkCenters(filtered);
    } catch (err) {
      setError("Unable to connect to the manufacturing server. Please check your connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. INITIAL LOAD & DEBOUNCE SEARCH
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchWorkCenters(filterQuery);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [filterQuery, fetchWorkCenters]);

  return (
    <div className="flex-1 min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-sans antialiased text-[#374151]">
      
      {/* HEADER SECTION */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[1.5rem] border border-gray-100 shadow-sm">
        <div>
          <nav className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
            Manufacturing / Planning
          </nav>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-3">
            Work Centers 
            <span className="text-xs bg-[#702963] text-white px-3 py-1 rounded-full font-black shadow-lg shadow-purple-200">
              {loading ? "..." : `0${workCenters.length}`}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter centers..." 
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-[#F3F4F6] border-2 border-transparent rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:border-[#702963] focus:bg-white transition-all font-medium"
            />
          </div>
          <button className="flex items-center gap-2 bg-[#702963] hover:bg-[#5a2150] text-white px-7 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-900/10 transition-all active:scale-95">
            <FiPlus /> Create Center
          </button>
        </div>
      </header>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm animate-bounce">
          <FiAlertCircle /> {error}
        </div>
      )}

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden relative min-h-[300px]">
        
        {/* API LOADING OVERLAY */}
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
            <FiLoader className="animate-spin text-[#702963] mb-2" size={32} />
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Syncing Data</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="px-8 py-5 text-[11px] font-black text-gray-500 uppercase tracking-widest">Work Center</th>
                <th className="px-8 py-5 text-[11px] font-black text-gray-500 uppercase tracking-widest">Code</th>
                <th className="px-8 py-5 text-[11px] font-black text-gray-500 uppercase tracking-widest text-right">Cost/Hr</th>
                <th className="px-8 py-5 text-[11px] font-black text-gray-500 uppercase tracking-widest text-right">Efficiency</th>
                <th className="px-8 py-5 text-[11px] font-black text-gray-500 uppercase tracking-widest text-right">OEE Target</th>
                <th className="px-6 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {workCenters.length > 0 ? (
                workCenters.map((wc) => (
                  <tr key={wc.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#702963] flex items-center justify-center text-white font-black text-lg shadow-md">
                          {wc.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#111827] text-base">{wc.name}</p>
                          <span className="text-[9px] font-black text-[#702963] uppercase tracking-widest">{wc.tag}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-mono font-bold bg-gray-100 px-2.5 py-1 rounded text-gray-600 border border-gray-200">
                        {wc.code}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-sm text-[#059669]">
                      <div className="flex items-center justify-end gap-1">
                        <FiDollarSign size={14} /> {wc.costPerHour.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="inline-flex items-center justify-end gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 text-blue-600">
                        <FiClock size={14} />
                        <span className="font-black text-xs">{wc.timeEfficiency}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 text-[#702963] mb-1.5">
                          <FiTarget size={14} />
                          <span className="font-black text-sm">{wc.oeeTarget}%</span>
                        </div>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#702963] to-[#8E3A80]" 
                            style={{ width: `${wc.oeeTarget}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button className="text-gray-300 hover:text-[#702963]">
                        <FiMoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                !loading && (
                  <tr>
                    <td colSpan="6" className="py-20 text-center text-gray-400 font-bold italic">
                      No Work Centers found matching your criteria.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {[
          { label: "Avg. Efficiency", val: loading ? "..." : "98.2%", icon: <FiClock />, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Center Capacity", val: loading ? "..." : workCenters.length.toFixed(2), icon: <FiActivity />, color: "text-[#702963]", bg: "bg-purple-50" },
          { label: "Fleet OEE Status", val: loading ? "..." : "74.5%", icon: <FiTarget />, color: "text-emerald-600", bg: "bg-emerald-50" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center justify-between group">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-4xl font-black ${stat.color}`}>{stat.val}</p>
            </div>
            <div className={`p-5 rounded-2xl ${stat.bg} ${stat.color} group-hover:rotate-12 transition-transform`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkCenter;