import React, { useState } from "react";
import { 
  FiMenu, FiX, FiCheck, FiTool, FiChevronDown, FiPlus, FiSave, FiTrash2 
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { MdDashboard, MdLightbulb, MdWorkspaces } from "react-icons/md";

const RequestForm = () => {
  const [maintenanceType, setMaintenanceType] = useState("Corrective");
  const [priority, setPriority] = useState(2); // 1 to 3 diamonds
  const [currentStatus, setCurrentStatus] = useState("New Request");

  const statuses = ["New Request", "In Progress", "Repaired", "Scrap"];

  return (
    <div className="flex h-screen w-full bg-[#F3F4F6] text-[#111827] overflow-hidden font-sans antialiased">
      
      {/* SIDEBAR (Preserving Theme Pattern) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#702963] flex items-center justify-center text-white">
            <HiSparkles size={20} />
          </div>
          <p className="font-extrabold text-xl tracking-tight">HackFlow</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"><MdDashboard /> Dashboard</div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-[#702963] text-white shadow-lg"><FiTool /> Requests</div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB] h-full overflow-hidden">
        
        {/* HEADER */}
        <header className="px-8 py-4 bg-white border-b border-gray-100 flex-shrink-0 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="bg-[#702963] text-white px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest">New</button>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Maintenance Requests</p>
              <h1 className="text-xl font-black text-[#111827]">Test activity</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 shadow-sm">
                <FiTool className="text-[#702963]" /> Worksheet
             </button>
             {/* PIPELINE STATUS */}
             <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-2 py-1 ml-4">
                {statuses.map((status, index) => (
                  <div key={status} className="flex items-center">
                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter cursor-pointer rounded-lg transition-all ${currentStatus === status ? "bg-[#702963] text-white shadow-md" : "text-gray-400"}`} onClick={() => setCurrentStatus(status)}>
                      {status}
                    </span>
                    {index !== statuses.length - 1 && <span className="text-gray-300 mx-1">/</span>}
                  </div>
                ))}
             </div>
          </div>
        </header>

        {/* FORM CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
          <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-[2rem] shadow-sm p-10">
            
            {/* SUBJECT TITLE */}
            <div className="mb-10">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Subject?</label>
              <h2 className="text-4xl font-black text-[#111827] border-b-2 border-gray-50 pb-2">Test activity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8">
              
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                <div className="group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Created By</label>
                  <p className="text-sm font-bold text-gray-800 border-b border-gray-100 py-2">Mitchell Admin</p>
                </div>

                <div className="group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Equipment</label>
                  <div className="flex items-center justify-between border-b border-gray-100 py-2 cursor-pointer hover:border-[#702963] transition-colors">
                    <span className="text-sm font-bold text-[#702963]">Acer Laptop/LP/203/19281928</span>
                    <FiChevronDown className="text-gray-400" />
                  </div>
                </div>

                <div className="group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Category</label>
                  <p className="text-sm font-bold text-gray-800 border-b border-gray-100 py-2">Computers</p>
                </div>

                <div className="group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Request Date?</label>
                  <p className="text-sm font-bold text-gray-800 border-b border-gray-100 py-2">12/18/2025</p>
                </div>

                <div className="pt-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Maintenance Type</label>
                  <div className="flex gap-6">
                    {["Corrective", "Preventive"].map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="radio" 
                            name="m_type" 
                            className="appearance-none w-5 h-5 border-2 border-gray-200 rounded-full checked:border-[#702963] transition-all" 
                            checked={maintenanceType === type}
                            onChange={() => setMaintenanceType(type)}
                          />
                          {maintenanceType === type && <div className="absolute w-2.5 h-2.5 bg-[#702963] rounded-full" />}
                        </div>
                        <span className={`text-sm font-bold ${maintenanceType === type ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"}`}>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Team</label>
                  <p className="text-sm font-bold text-gray-800 border-b border-gray-100 py-2">Internal Maintenance</p>
                </div>

                <div className="group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Technician</label>
                  <p className="text-sm font-bold text-gray-800 border-b border-gray-100 py-2">Aka Foster</p>
                </div>

                <div className="group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Scheduled Date?</label>
                  <p className="text-sm font-bold text-gray-800 border-b border-gray-100 py-2">12/28/2025 14:30:00</p>
                </div>

                <div className="group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Duration</label>
                  <p className="text-sm font-bold text-gray-800 border-b border-gray-100 py-2">00:00 hours</p>
                </div>

                <div className="pt-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Priority</label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((star) => (
                      <div 
                        key={star} 
                        onClick={() => setPriority(star)}
                        className={`w-6 h-6 rotate-45 border-2 cursor-pointer transition-all ${priority >= star ? "bg-[#702963] border-[#702963]" : "bg-transparent border-gray-200"}`} 
                      />
                    ))}
                  </div>
                </div>

                <div className="group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Company</label>
                  <p className="text-sm font-bold text-[#702963] border-b border-gray-100 py-2 uppercase tracking-tighter">My Company (San Francisco)</p>
                </div>
              </div>
            </div>

            {/* TAB SECTION */}
            <div className="mt-16 border-t border-gray-100 pt-8">
              <div className="flex gap-4">
                <button className="bg-[#702963] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-900/10">Notes</button>
                <button className="bg-white text-gray-400 border border-gray-100 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">Instructions</button>
              </div>
              <div className="mt-6 h-32 w-full bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 text-xs font-bold italic">
                Add maintenance notes or attachments here...
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default RequestForm;