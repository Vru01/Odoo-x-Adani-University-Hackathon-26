import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  FiPlus, FiFilter, FiSearch, FiChevronLeft, 
  FiChevronRight, FiEdit3, FiTrash2, FiLoader, FiAlertCircle 
} from "react-icons/fi";

const EquipmentTable = () => {
  // 1. BACKEND STATES
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // 2. FETCH DATA FROM API
  const fetchEquipment = useCallback(async (query = "", pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Simulating API Call to Equipment Controller
      // In production: const response = await axios.get(`/api/equipment?search=${query}&page=${pageNum}`);
      
      // Using placeholder data to simulate a 1-second network latency
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockBackendData = [
        { id: 1, name: "Samsung Monitor 15\"", employee: "Tejas Modi", department: "Admin", serial: "MT/125/22778837", technician: "Mitchell Admin", category: "Monitors", company: "My Company (SF)" },
        { id: 2, name: "Acer Laptop", employee: "Bhaumik P", department: "Technician", serial: "MT/122/11112222", technician: "Marc Demo", category: "Computers", company: "My Company (SF)" },
        { id: 3, name: "Logitech Keyboard", employee: "Abigail Peterson", department: "Design", serial: "MT/99/00223344", technician: "Mitchell Admin", category: "Peripherals", company: "My Company (SF)" },
      ];

      // Simulate server-side filtering logic
      const filtered = query 
        ? mockBackendData.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) || 
            item.serial.toLowerCase().includes(query.toLowerCase())
          )
        : mockBackendData;

      setEquipmentData(filtered);
    } catch (err) {
      setError("Failed to fetch equipment records from the central database.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. SEARCH DEBOUNCE EFFECT
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEquipment(searchQuery, page);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, page, fetchEquipment]);

  // 4. OPTIMISTIC DELETE ACTION
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this asset?")) return;
    
    // Remove from UI immediately
    const originalData = [...equipmentData];
    setEquipmentData(prev => prev.filter(item => item.id !== id));

    try {
      // In production: await axios.delete(`/api/equipment/${id}`);
      console.log(`Asset ${id} deleted on server`);
    } catch (err) {
      setEquipmentData(originalData); // Rollback if server fails
      alert("Server error: Could not delete asset.");
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#F8F9FA] p-6 md:p-10 font-sans text-[#1A1A1A]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Equipment Inventory</h1>
            <p className="text-gray-400 text-xs font-medium mt-1">Real-time asset synchronization active</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              {loading ? (
                <FiLoader className="absolute left-3 top-1/2 -translate-y-1/2 text-[#702963] animate-spin" />
              ) : (
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#702963]" />
              )}
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or serial..." 
                className="bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#702963] w-64 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#702963] text-white text-sm font-semibold rounded-lg hover:bg-[#5a2150] transition-all shadow-sm active:scale-95">
              <FiPlus /> New Asset
            </button>
          </div>
        </div>

        {/* ERROR HANDLER */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 font-bold text-sm">
            <FiAlertCircle /> {error}
          </div>
        )}

        {/* DATA TABLE CONTAINER */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden relative">
          
          {/* SYNC OVERLAY */}
          {loading && equipmentData.length > 0 && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10" />
          )}

          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex gap-4 text-xs font-black uppercase tracking-widest text-gray-400">
              Active Registry
            </div>
            <button className="text-gray-400 hover:text-[#702963]">
              <FiFilter size={18} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white">
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Equipment Name</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Serial Number</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {equipmentData.length > 0 ? (
                  equipmentData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">{item.name}</p>
                        <p className="text-[10px] text-gray-400">{item.company}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-700 font-medium">{item.employee}</span>
                          <span className="text-[10px] text-gray-400 uppercase font-black">{item.department}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] font-mono font-bold text-[#702963] bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                          {item.serial}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 hover:text-[#702963] hover:bg-purple-50 rounded-lg">
                            <FiEdit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  !loading && (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic">
                        No assets found in registry.
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER PAGINATION */}
          <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs font-black text-gray-300 uppercase tracking-widest">
              {loading ? "Syncing..." : `Registry: ${equipmentData.length} Assets`}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 disabled:opacity-30" 
                disabled={page === 1 || loading}
              >
                <FiChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                disabled={loading}
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentTable;