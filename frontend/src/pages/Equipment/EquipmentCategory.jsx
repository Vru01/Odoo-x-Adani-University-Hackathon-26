import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  FiPlus, FiSearch, FiMoreHorizontal, FiChevronRight, FiBox, FiLoader, FiAlertCircle, FiTrash2, FiEdit3 
} from "react-icons/fi";

const EquipmentCategory = () => {
  // 1. Initial State with your original names
  const [categories, setCategories] = useState([
    { id: 1, name: "Computers", responsible: "OdooBot", company: "My Company (San Francisco)" },
    { id: 2, name: "Software", responsible: "OdooBot", company: "My Company (San Francisco)" },
    { id: 3, name: "Monitors", responsible: "Mitchell Admin", company: "My Company (San Francisco)" },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 2. FETCH DATA (Simulated Backend Refresh)
  const fetchCategories = useCallback(async (query = "") => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulating an API delay
      await new Promise(resolve => setTimeout(resolve, 600));

      // In a real backend, you would use:
      // const response = await axios.get(`/api/categories?search=${query}`);
      // setCategories(response.data);

      // Filtering the local state to simulate backend search
      if (query) {
        setCategories(prev => prev.filter(c => 
          c.name.toLowerCase().includes(query.toLowerCase())
        ));
      }
    } catch (err) {
      setError("Failed to synchronize with the equipment server.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. TRIGGER REFRESH ON SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) fetchCategories(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchCategories]);

  return (
    <div className="flex-1 min-h-screen bg-[#F9FAFB] p-6 md:p-12 font-sans text-[#1A1A1A]">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-[10px] font-black text-[#702963] uppercase tracking-widest mb-3">
            <span>Inventory</span>
            <FiChevronRight className="opacity-50" />
            <span className="opacity-50">Configuration</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">Equipment Categories</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative group">
                <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${loading ? 'text-[#702963]' : 'text-gray-400'}`} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter categories..." 
                  className="bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#702963]/10 focus:border-[#702963] w-64 transition-all"
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#702963] text-white text-sm font-bold rounded-xl hover:bg-[#5a2150] transition-all shadow-lg shadow-purple-900/10">
                <FiPlus /> New
              </button>
            </div>
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
            <FiAlertCircle /> {error}
          </div>
        )}

        {/* CATEGORY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          
          {/* LOADER OVERLAY */}
          {loading && (
            <div className="absolute inset-0 bg-[#F9FAFB]/50 z-10 flex justify-center pt-20 backdrop-blur-[1px]">
               <FiLoader className="animate-spin text-[#702963]" size={32} />
            </div>
          )}

          {categories.map((cat) => (
            <div key={cat.id} className="group bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer relative">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-[#702963] group-hover:bg-[#702963] group-hover:text-white transition-all duration-300">
                  <FiBox size={24} />
                </div>
                
                {/* ACTIONS DROPDOWN */}
                <div className="relative group/menu">
                  <button className="text-gray-300 hover:text-gray-600 p-1">
                    <FiMoreHorizontal size={20} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden">
                    <button className="w-full px-4 py-2 text-left text-[10px] font-black uppercase text-gray-500 hover:bg-gray-50 flex items-center gap-2">
                      <FiEdit3 /> Edit
                    </button>
                    <button className="w-full px-4 py-2 text-left text-[10px] font-black uppercase text-red-500 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50">
                      <FiTrash2 /> Archive
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1 mb-8">
                <h3 className="text-lg font-bold text-[#111827]">{cat.name}</h3>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Responsible: {cat.responsible}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Company</span>
                  <span className="text-xs font-bold text-[#702963] truncate max-w-[130px]">{cat.company}</span>
                </div>
                
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                  Active
                </span>
              </div>
            </div>
          ))}

          {/* ADD NEW PLACEHOLDER */}
          <button className="border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center p-8 text-gray-400 hover:border-[#702963] hover:text-[#702963] transition-all group min-h-[250px]">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center mb-4 group-hover:border-[#702963]">
              <FiPlus size={24} />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">Create New</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCategory;