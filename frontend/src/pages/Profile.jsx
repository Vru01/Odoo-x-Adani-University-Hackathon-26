import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaEnvelope, FaUser, FaBriefcase, FaIdCard, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center text-[#702963]">
      <div className="animate-pulse font-semibold">Loading Profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to={user.role === 'admin' ? "/admin/dashboard" : "/equipment"} className="inline-flex items-center gap-2 text-gray-500 hover:text-[#702963] mb-6 transition-colors">
            <FaArrowLeft /> Back to Dashboard
        </Link>

        <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-200">
            {/* Header Banner - Primary Purple */}
            <div className="bg-[#702963] h-40 relative">
            <div className="absolute -bottom-16 left-8 w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gray-100">
                {/* Dynamic Avatar */}
                <img
                src={`https://ui-avatars.com/api/?name=${user.full_name || 'User'}&background=702963&color=fff&size=128`}
                alt="User Avatar"
                className="w-full h-full object-cover"
                />
            </div>
            </div>

            {/* User Headings */}
            <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                <h2 className="text-3xl font-bold text-gray-800">{user.full_name || "Admin User"}</h2>
                <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                    ${user.role === 'admin' ? 'bg-purple-100 text-[#702963]' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role || "User"}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                    ${user.account_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {user.account_status || "Active"}
                    </span>
                </div>
                </div>
            </div>
            
            <hr className="my-8 border-gray-100" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Personal Info Card */}
                <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-bold text-[#702963] mb-4 flex items-center gap-2">
                    <FaUser /> Personal Details
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                    <FaEnvelope className="text-gray-400" />
                    <span className="font-medium text-gray-800">{user.email || "No Email Provided"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                    <FaIdCard className="text-gray-400" />
                    <span>User ID: <span className="font-mono text-gray-800">#{user.user_id || user.id || "000"}</span></span>
                    </div>
                </div>
                </div>

                {/* Work Info Card */}
                <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-bold text-[#702963] mb-4 flex items-center gap-2">
                    <FaBriefcase /> System Role
                </h3>
                <div className="space-y-3">
                    <p className="text-gray-600 text-sm">
                    Current Authorization Level:
                    </p>
                    <div className="font-medium text-gray-800 text-lg">
                    {(user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Staff")}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                    *Permissions are managed by the System Administrator.
                    </p>
                </div>
                </div>

            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;