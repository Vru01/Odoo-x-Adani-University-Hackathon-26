import React, { useState } from "react";
import axios from "axios";
import { FiTool, FiCheck, FiLoader, FiAlertCircle, FiChevronDown } from "react-icons/fi";

const CreateEquipment = () => {
  // 1. FORM STATE
  const [formData, setFormData] = useState({
    name: "Samsung Monitor 15\"",
    category: "Monitors",
    company: "My Company (San Francisco)",
    usedBy: "Employee",
    maintenanceTeam: "Internal Maintenance",
    assignedDate: "2025-12-24",
    technician: "Mitchell Admin",
    employee: "Abigail Peterson",
    scrapDate: "",
    location: "",
    workCenter: "",
    description: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // 2. HANDLE INPUT CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. SUBMIT TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      // Simulating API POST Request
      // In production: await axios.post('/api/equipment', formData);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Fake delay
      
      setStatus({ type: "success", message: "Equipment successfully synchronized with registry." });
      console.log("Payload Sent:", formData);
    } catch (error) {
      setStatus({ type: "error", message: "Network error: Unable to save equipment data." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-[#F8F9FC] overflow-hidden font-sans">
      {/* GLOW EFFECTS */}
      <div className="absolute top-[20%] right-[5%] w-[500px] h-[500px] bg-[#702963]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[5%] left-[5%] w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-[100px]" />

      <form 
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-5xl backdrop-blur-2xl bg-white/70 border border-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(112,41,99,0.1)] overflow-hidden"
      >
        
        {/* HEADER BAR */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/40">
          <div className="flex items-center gap-4">
            <div className="px-6 py-1.5 bg-gradient-to-r from-[#702963] to-[#9d3a8a] rounded-xl text-white text-xs font-black uppercase tracking-widest shadow-md">
              New
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-800">Equipment Registry</span>
          </div>

          <div className="flex items-center gap-4">
            {/* STATUS NOTIFICATION */}
            {status.message && (
              <div className={`flex items-center gap-2 text-[10px] font-black uppercase px-4 py-2 rounded-lg ${
                status.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              }`}>
                {status.type === "success" ? <FiCheck /> : <FiAlertCircle />}
                {status.message}
              </div>
            )}

            <div className="flex items-center gap-3 bg-white border border-gray-100 px-4 py-2 rounded-xl shadow-sm">
              <FiTool className="text-[#702963] text-lg" />
              <div className="text-left leading-none">
                <p className="text-[9px] text-gray-400 font-black uppercase mb-1">Active Tasks</p>
                <p className="text-sm font-black text-gray-800">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* FORM BODY */}
        <div className="p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
            
            {/* LEFT COLUMN */}
            <div className="space-y-10">
              {[
                { label: "Name?", name: "name", type: "text" },
                { label: "Category?", name: "category", type: "text" },
                { label: "Company?", name: "company", type: "text" },
                { label: "Used By?", name: "usedBy", type: "select", options: ["Employee", "Other"] },
                { label: "Maintenance Team?", name: "maintenanceTeam", type: "text" },
                { label: "Assigned Date?", name: "assignedDate", type: "date" }
              ].map((field) => (
                <div key={field.name} className="flex items-end gap-4 border-b border-gray-200 pb-2 focus-within:border-[#702963] transition-colors">
                  <label className="text-[11px] font-black text-gray-400 w-44 uppercase tracking-tighter">{field.label}</label>
                  
                  {field.type === "select" ? (
                    <div className="flex-1 relative">
                      <select 
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full bg-transparent outline-none appearance-none text-sm font-bold text-gray-800 cursor-pointer"
                      >
                        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <FiChevronDown className="absolute right-0 bottom-1 text-gray-300 pointer-events-none" />
                    </div>
                  ) : (
                    <input 
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="bg-transparent outline-none flex-1 text-sm font-bold text-gray-800" 
                    />
                  )}
                </div>
              ))}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-10">
              {[
                { label: "Technician?", name: "technician" },
                { label: "Employee?", name: "employee" },
                { label: "Scrap Date?", name: "scrapDate" },
                { label: "Used in location?", name: "location" },
                { label: "Work Center?", name: "workCenter" }
              ].map((field) => (
                <div key={field.name} className="flex items-end gap-4 border-b border-gray-200 pb-2 focus-within:border-[#702963] transition-colors">
                  <label className="text-[11px] font-black text-gray-400 w-44 uppercase tracking-tighter">{field.label}</label>
                  <input 
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="bg-transparent outline-none flex-1 text-sm font-bold text-gray-800" 
                  />
                </div>
              ))}
            </div>

            {/* DESCRIPTION ROW */}
            <div className="md:col-span-2 flex items-start gap-4 mt-6">
              <label className="text-[11px] font-black text-gray-400 w-32 pt-1 uppercase tracking-tighter">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter technical specifications or notes..."
                className="flex-1 bg-transparent border-b border-gray-200 outline-none text-sm h-12 resize-none text-gray-700 placeholder:text-gray-300 focus:border-[#702963] transition-colors" 
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="mt-12 flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-3 px-10 py-4 bg-[#702963] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-purple-900/20 hover:bg-[#5a2150] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin" /> Processing...
                </>
              ) : (
                "Save Equipment"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEquipment;