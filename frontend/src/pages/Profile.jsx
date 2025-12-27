import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { FaEnvelope, FaUser, FaCalendarAlt, FaEdit } from "react-icons/fa";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User not logged in",
      });
      return;
    }
    setProfileData(user);
  }, [user]);

  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-400 to-indigo-300 h-32 relative">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
            <img
              src={`https://ui-avatars.com/api/?name=${profileData.username}&background=60a5fa&color=fff&size=128`}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="pt-20 pb-10 px-8 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-800">
            {profileData.username}
          </h2>
          <p className="text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-2">
            <FaEnvelope /> {profileData.email}
          </p>
          <p className="text-gray-500 mt-2 flex items-center justify-center md:justify-start gap-2">
            <FaCalendarAlt /> Member since:{" "}
            {new Date(profileData.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Profile Details Cards */}
        <div className="px-8 pb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-2xl shadow hover:shadow-lg transition bg-white">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FaUser /> Account Info
            </h3>
            <p>
              <span className="font-semibold">Username:</span>{" "}
              {profileData.username}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {profileData.email}
            </p>
          </div>

          <div className="p-6 border rounded-2xl shadow hover:shadow-lg transition bg-white">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              Recent Activity
            </h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Logged in today</li>
              <li>Updated profile picture</li>
              <li>Changed password</li>
            </ul>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="px-8 pb-10 flex justify-center md:justify-end">
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md transition">
            <FaEdit /> Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
