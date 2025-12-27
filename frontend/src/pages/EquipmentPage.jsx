import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { equipmentService } from "../services/service";
import { FiPlus, FiSearch, FiEdit3, FiTrash2, FiLoader, FiFilter, FiCheck, FiArrowLeft, FiTool } from "react-icons/fi";

const EquipmentPage = () => {
  const { user } = useContext(AuthContext);
  const [view, setView] = useState("list"); // 'list', 'form'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Form State
  const [editId, setEditId] = useState(null); // null = create, id = edit
  const [formData, setFormData] = useState({ name: "", category: "", serialNumber: "", location: "", maintenanceTeam: "" });
  const [submitting, setSubmitting] = useState(false);

  // --- FETCH DATA ---
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
        const res = await equipmentService.getAll({ search });
        setItems(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { 
    if(view === 'list') fetchItems(); 
  }, [view, fetchItems]);

  // --- HANDLERS ---
  const handleEdit = (item) => {
    setEditId(item.id || item._id);
    setFormData({
        name: item.name || "",
        category: item.category || "",
        serialNumber: item.serialNumber || "",
        location: item.location || "",
        maintenanceTeam: item.maintenanceTeam || ""
    });
    setView("form");
  };

  const handleCreate = () => {
    setEditId(null);
    setFormData({ name: "", category: "", serialNumber: "", location: "", maintenanceTeam: "" });
    setView("form");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
        if (editId) {
             // Logic for update if you have an update endpoint
             // await equipmentService.update(editId, formData);
             alert("Update Simulated (Backend endpoint needed)");
        } else {
             await equipmentService.create(formData);
        }
        setView("list");
    } catch (e) { alert("Operation failed"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete asset?")) return;
    // await equipmentService.delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  // --- RENDER FORM ---
  if (view === "form") {
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6">
            <form onSubmit={handleSubmit} className="bg-white w-full max-w-3xl p-10 rounded-[2rem] shadow-xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-[#702963]">{editId ? "Edit Equipment" : "New Equipment"}</h2>
                    <button type="button" onClick={() => setView("list")} className="flex items-center gap-2 text-gray-500 hover:text-[#702963] font-bold"><FiArrowLeft/> Back</button>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                    {[
                        { label: "Asset Name", name: "name" },
                        { label: "Serial Number", name: "serialNumber" },
                        { label: "Category", name: "category" },
                        { label: "Location", name: "location" },
                        { label: "Maintenance Team", name: "maintenanceTeam" }
                    ].map(f => (
                        <div key={f.name}>
                            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">{f.label}</label>
                            <input 
                                name={f.name}
                                value={formData[f.name]}
                                onChange={e => setFormData({...formData, [e.target.name]: e.target.value})}
                                className="w-full border-b border-gray-200 py-2 outline-none font-bold text-black focus:border-[#702963]"
                                required={f.name === 'name'}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end">
                    <button disabled={submitting} className="bg-[#702963] text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-[#5a2150] disabled:opacity-50">
                        {submitting ? <FiLoader className="animate-spin"/> : "Save Record"}
                    </button>
                </div>
            </form>
        </div>
    );
  }

  // --- RENDER LIST ---
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 font-sans">
       <div className="max-w-[1400px] mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black text-[#111827]">Equipment Inventory</h1>
            {user?.role === 'admin' && (
                <button onClick={handleCreate} className="flex items-center gap-2 bg-[#702963] text-white px-6 py-3 rounded-xl font-bold shadow-lg">
                    <FiPlus /> New Asset
                </button>
            )}
          </div>

          <div className="bg-white border border-gray-200 p-2 rounded-2xl flex gap-2">
             <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-3 text-gray-400"/>
                <input 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    placeholder="Search equipment..." 
                    className="w-full pl-12 py-2 bg-transparent outline-none text-black font-medium"
                />
             </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase">Asset Name</th>
                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase">Serial</th>
                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase">Category</th>
                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase">Location</th>
                        <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? <tr><td colSpan="5" className="p-10 text-center"><FiLoader className="animate-spin mx-auto"/></td></tr> : items.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-8 py-6 font-bold text-black">{item.name}</td>
                            <td className="px-6 py-6 font-mono text-xs text-[#702963] bg-purple-50 px-2 rounded w-fit">{item.serialNumber}</td>
                            <td className="px-6 py-6 text-sm font-bold text-black">{item.category}</td>
                            <td className="px-6 py-6 text-sm text-gray-600">{item.location}</td>
                            <td className="px-8 py-6 text-right">
                                {user?.role === 'admin' && (
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(item)} className="p-2 text-[#702963] hover:bg-purple-50 rounded"><FiEdit3/></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><FiTrash2/></button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    {!loading && items.length === 0 && <tr><td colSpan="5" className="p-10 text-center text-gray-400">No assets found.</td></tr>}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};
export default EquipmentPage;