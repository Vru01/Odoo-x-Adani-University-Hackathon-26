import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { adminService } from "../services/service";
import { FiCheck, FiX, FiLoader, FiUser, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') navigate('/admin/dashboard');
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
        const res = await adminService.getAllUsers();
        setUsers(res.data || []);
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
        await adminService.updateUserStatus(id, { account_status: status });
        fetchUsers(); // Refresh UI
    } catch (e) { alert("Action failed"); }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 font-sans">
       <header className="mb-10 flex items-center gap-4 bg-white p-6 rounded-[1.5rem] shadow-sm">
          <div className="p-3 bg-[#702963] text-white rounded-xl"><FiShield size={24}/></div>
          <div><h1 className="text-2xl font-black text-[#111827]">User Management</h1><p className="text-xs text-gray-400 font-bold uppercase">Approve Signups & Roles</p></div>
       </header>

       <div className="bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                    <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase">User</th>
                    <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase">Email</th>
                    <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase">Role</th>
                    <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase">Status</th>
                    <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {loading ? <tr><td colSpan="5" className="p-10 text-center"><FiLoader className="animate-spin mx-auto"/></td></tr> : users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-8 py-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#702963] font-bold">{u.full_name?.charAt(0)}</div>
                            <span className="font-bold text-black">{u.full_name}</span>
                        </td>
                        <td className="px-8 py-4 text-sm font-medium text-black">{u.email}</td>
                        <td className="px-8 py-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">{u.role}</span></td>
                        <td className="px-8 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.account_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {u.account_status}
                            </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                            {u.account_status === 'pending' && (
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => handleStatusChange(u.id, 'active')} className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600" title="Approve"><FiCheck/></button>
                                    <button onClick={() => handleStatusChange(u.id, 'rejected')} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600" title="Reject"><FiX/></button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
       </div>
    </div>
  );
};
export default UserManagement;