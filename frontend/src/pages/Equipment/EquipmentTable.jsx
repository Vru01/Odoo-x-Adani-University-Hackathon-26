import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEdit3,
  FiTrash2,
  FiLoader,
  FiAlertCircle,
  FiFilter,
} from "react-icons/fi";

const EquipmentTable = () => {
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const fetchEquipment = useCallback(async (query = "") => {
    try {
      setLoading(true);
      setError(null);

      // simulate API delay
      await new Promise((r) => setTimeout(r, 800));

      const data = [
        {
          id: 1,
          name: 'Samsung Monitor 15"',
          employee: "Tejas Modi",
          department: "Admin",
          serial: "MT/125/22778837",
          category: "Monitors",
          company: "My Company (SF)",
        },
        {
          id: 2,
          name: "Acer Laptop",
          employee: "Bhaumik P",
          department: "Technician",
          serial: "MT/122/11112222",
          category: "Computers",
          company: "My Company (SF)",
        },
        {
          id: 3,
          name: "Logitech Keyboard",
          employee: "Abigail Peterson",
          department: "Design",
          serial: "MT/99/00223344",
          category: "Peripherals",
          company: "My Company (SF)",
        },
      ];

      const filtered = query
        ? data.filter(
            (i) =>
              i.name.toLowerCase().includes(query.toLowerCase()) ||
              i.serial.toLowerCase().includes(query.toLowerCase())
          )
        : data;

      setEquipmentData(filtered);
    } catch {
      setError("Failed to sync with asset registry");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchEquipment(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchEquipment]);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to decommission this asset?")) return;
    setEquipmentData((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10 font-sans antialiased">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* TOP HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <nav className="text-[10px] font-black text-[#702963] uppercase tracking-[0.2em] mb-1">Resource Management</nav>
            <h1 className="text-3xl font-black text-[#111827] tracking-tight">Equipment Inventory</h1>
          </div>

          <Link 
            to="/equipment/create"
            className="flex items-center gap-2 bg-[#702963] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-purple-900/10 hover:bg-[#5a2150] transition-all active:scale-95"
          >
            <FiPlus strokeWidth={3} /> New Asset
          </Link>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, serial, or employee..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#702963]/20 focus:outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-gray-50 text-gray-600 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">
            <FiFilter /> Filter
          </button>
        </div>

        {/* DATA TABLE CONTAINER */}
        <div className="bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Details</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned To</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Serial Number</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <FiLoader className="animate-spin text-[#702963]" size={32} />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Synchronizing Registry...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  equipmentData.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-[#111827]">{e.name}</p>
                        <p className="text-[10px] text-[#702963] font-bold uppercase tracking-tight">{e.company}</p>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-700">{e.employee}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">{e.department}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="bg-purple-50 text-[#702963] px-3 py-1 rounded-lg font-mono text-xs font-bold border border-purple-100">
                          {e.serial}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
                          {e.category}
                        </span>
                      </td>
                      {/* ALWAYS VISIBLE ACTION SECTION */}
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          <Link 
                            to={`/equipment/edit/${e.id}`}
                            className="p-2.5 bg-gray-50 text-[#702963] hover:bg-purple-100 rounded-xl transition-all border border-gray-100"
                            title="Edit Asset"
                          >
                            <FiEdit3 size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(e.id)}
                            className="p-2.5 bg-gray-50 text-red-500 hover:bg-red-100 rounded-xl transition-all border border-gray-100"
                            title="Delete Asset"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER / PAGINATION */}
          <div className="px-8 py-6 bg-gray-50/50 flex justify-between items-center border-t border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Showing Page <span className="text-[#702963]">{page}</span> of Analytics
            </p>
            <div className="flex gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="p-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all shadow-sm"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentTable;