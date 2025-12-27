import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FiPlus, FiUsers, FiGlobe, FiMoreVertical, FiSearch, FiLoader, FiAlertCircle } from "react-icons/fi";

// Dummy API Base URL
const API_BASE = "https://jsonplaceholder.typicode.com";

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. FETCH TEAMS FROM BACKEND
  const fetchTeams = useCallback(async (query = "") => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulating a backend search endpoint
      // In a real app: axios.get(`/api/teams?search=${query}`)
      const response = await axios.get(`${API_BASE}/users`);
      
      // Mapping API data to our UI structure
      const formattedTeams = response.data.map((user, index) => ({
        id: user.id,
        name: user.company.name, // Using company name as Team Name
        members: [user.name, "Mitchell Admin"], // Mocking members
        company: "My Company (San Francisco)",
        color: index % 2 === 0 ? "bg-[#702963]" : "bg-[#8E3A80]"
      }));

      // Client-side filter to simulate server-side search logic
      const filtered = query 
        ? formattedTeams.filter(t => t.name.toLowerCase().includes(query.toLowerCase()))
        : formattedTeams;

      setTeams(filtered);
    } catch (err) {
      setError("Failed to synchronize teams with the server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. INITIAL LOAD
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // 3. DEBOUNCED SEARCH LOGIC
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTeams(searchTerm);
    }, 500); // Wait 500ms after user stops typing to call API

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchTeams]);

  return (
    <div className="flex-1 min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-sans antialiased text-[#374151]">
      
      {/* HEADER */}
      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[1.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-[#702963] rounded-2xl shadow-lg shadow-purple-100 text-white">
            <FiUsers size={28} />
          </div>
          <div>
            <nav className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Organization</nav>
            <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">Team Management</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search teams..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F3F4F6] border-2 border-transparent rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-[#702963] focus:bg-white transition-all font-medium"
            />
          </div>
          <button className="flex items-center gap-2 bg-[#702963] hover:bg-[#5a2150] text-white px-7 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-900/10">
            <FiPlus /> New Team
          </button>
        </div>
      </header>

      {/* ERROR STATE */}
      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 font-bold text-sm">
          <FiAlertCircle /> {error}
        </div>
      )}

      {/* TEAMS CONTENT */}
      <div className="max-w-6xl mx-auto bg-white rounded-[1.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden relative min-h-[400px]">
        
        {loading ? (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-[#702963]">
            <FiLoader className="animate-spin mb-3" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest">Updating Database...</p>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="px-10 py-5 text-[11px] font-black text-gray-500 uppercase tracking-widest">Team Identity</th>
                <th className="px-10 py-5 text-[11px] font-black text-gray-500 uppercase tracking-widest">Team Members</th>
                <th className="px-10 py-5 text-[11px] font-black text-gray-500 uppercase tracking-widest">Company / Entity</th>
                <th className="px-6 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {teams.length > 0 ? teams.map((team) => (
                <tr key={team.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${team.color} flex items-center justify-center text-white font-black text-lg shadow-md`}>
                        {team.name.charAt(0)}
                      </div>
                      <span className="font-extrabold text-[#111827] text-lg tracking-tight">{team.name}</span>
                    </div>
                  </td>

                  <td className="px-10 py-8">
                    <div className="flex -space-x-2 overflow-hidden mb-2">
                      {team.members.map((member, i) => (
                        <div 
                          key={i} 
                          title={member}
                          className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-[#702963] border border-gray-200"
                        >
                          {member.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tighter">
                      {team.members.length} Active {team.members.length === 1 ? 'User' : 'Users'}
                    </p>
                  </td>

                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2 text-gray-600 font-bold text-sm">
                      <FiGlobe className="text-[#702963]" />
                      {team.company}
                    </div>
                  </td>

                  <td className="px-6 py-8 text-right">
                    <button className="p-2 text-gray-300 hover:text-[#702963] transition-colors">
                      <FiMoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              )) : !loading && (
                <tr>
                  <td colSpan="4" className="px-10 py-20 text-center text-gray-400 font-bold italic">
                    No teams found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <div className="bg-[#702963] p-8 rounded-[1.5rem] text-white shadow-xl shadow-purple-900/20">
          <p className="text-[10px] font-black text-purple-200 uppercase tracking-widest mb-1">Total Workforce</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black italic">{loading ? "..." : teams.length * 2}</span>
            <span className="text-sm font-bold opacity-70 tracking-tight">Verified Members</span>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[1.5rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Departments</p>
          <p className="text-4xl font-black text-[#111827]">{loading ? "..." : "0" + teams.length}</p>
        </div>

        <div className="bg-white p-8 rounded-[1.5rem] border border-gray-100 shadow-sm text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Entities</p>
          <p className="text-4xl font-black text-[#702963]">02</p>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;