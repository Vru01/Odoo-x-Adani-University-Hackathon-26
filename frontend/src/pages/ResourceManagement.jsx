import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { resourceService } from "../services/service";
import { FiPlus, FiBriefcase, FiLayers, FiBox, FiLoader, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const ResourceManagement = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("categories"); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "" }); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/admin/dashboard');
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
        const res = await resourceService.getAll(activeTab);
        setData(res.data || []);
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        await resourceService.create(activeTab, formData); // Ensure backend supports generic POST /resources/:type
        setFormData({ name: "" });
        fetchData(); 
    } catch (e) { alert("Failed to create item"); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Delete this item?")) return;
      try {
          await resourceService.delete(activeTab, id); // Ensure backend supports generic DELETE /resources/:type/:id
          setData(prev => prev.filter(item => (item.id || item._id) !== id));
      } catch(e) { alert("Delete failed"); }
  };

  if (user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-[#702963] mb-6"><FiArrowLeft /> Back to Dashboard</Link>
        <h1 className="text-3xl font-black text-[#111827] mb-8">Master Data Configuration</h1>

        <div className="flex gap-4 mb-8">
            {[ { id: 'categories', label: 'Categories', icon: <FiBox /> }, { id: 'departments', label: 'Departments', icon: <FiLayers /> }, { id: 'companies', label: 'Companies', icon: <FiBriefcase /> } ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? "bg-[#702963] text-white shadow-lg" : "bg-white text-gray-500 hover:bg-gray-100"}`}>
                    {tab.icon} {tab.label}
                </button>
            ))}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
            <h3 className="text-sm font-black uppercase text-gray-400 mb-4 tracking-widest">Add New {activeTab.slice(0, -1)}</h3>
            <form onSubmit={handleCreate} className="flex gap-4">
                <input type="text" placeholder={`New ${activeTab.slice(0, -1)} name`} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-[#702963] outline-none" required />
                <button disabled={isSubmitting} className="bg-[#702963] text-white px-6 rounded-lg font-bold disabled:opacity-50">{isSubmitting ? <FiLoader className="animate-spin" /> : <FiPlus />}</button>
            </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? <div className="p-8 text-center text-gray-400"><FiLoader className="animate-spin mx-auto mb-2"/> Loading data...</div> : (
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100"><tr><th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Name</th><th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-right">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map((item, i) => (
                            <tr key={item.id || i} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-bold text-gray-800">{item.name}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(item.id || item._id)} className="text-red-400 hover:text-red-600"><FiTrash2 /></button>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && <tr><td colSpan="2" className="p-8 text-center text-gray-400">No records found.</td></tr>}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    </div>
  );
};

export default ResourceManagement;