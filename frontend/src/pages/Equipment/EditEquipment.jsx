import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditEquipment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState({
    name: "",
    serialNumber: "",
    category: "",
    maintenanceTeam: "",
    technician: "",
    purchaseDate: "",
    warrantyDate: "",
    location: "",
    status: "Active",
  });

  // 🔹 MOCK FETCH (replace with API)
  useEffect(() => {
    const mockEquipment = {
      name: "CNC Machine",
      serialNumber: "SN-001",
      category: "Mechanical",
      maintenanceTeam: "Mechanics",
      technician: "John Doe",
      purchaseDate: "2023-01-10",
      warrantyDate: "2026-01-10",
      location: "Plant Floor",
      status: "Active",
    };

    setEquipment(mockEquipment);
  }, [id]);

  const handleChange = (e) => {
    setEquipment({ ...equipment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Updated Equipment:", equipment);

    alert("Equipment updated successfully ✅");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border">

        {/* HEADER */}
        <div className="px-6 py-5 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Equipment
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Update equipment information and maintenance settings
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Equipment Name */}
          <div>
            <label className="label">Equipment Name *</label>
            <input
              type="text"
              name="name"
              value={equipment.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Serial Number */}
          <div>
            <label className="label">Serial Number *</label>
            <input
              type="text"
              name="serialNumber"
              value={equipment.serialNumber}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Serial number cannot be changed
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="label">Equipment Category *</label>
            <select
              name="category"
              value={equipment.category}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select category</option>
              <option>Mechanical</option>
              <option>Electrical</option>
              <option>IT</option>
            </select>
          </div>

          {/* Maintenance Team */}
          <div>
            <label className="label">Maintenance Team *</label>
            <select
              name="maintenanceTeam"
              value={equipment.maintenanceTeam}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select team</option>
              <option>Mechanics</option>
              <option>Electricians</option>
              <option>IT Support</option>
            </select>
          </div>

          {/* Default Technician */}
          <div>
            <label className="label">Default Technician</label>
            <input
              type="text"
              name="technician"
              value={equipment.technician}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Location */}
          <div>
            <label className="label">Location</label>
            <input
              type="text"
              name="location"
              value={equipment.location}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Purchase Date */}
          <div>
            <label className="label">Purchase Date</label>
            <input
              type="date"
              name="purchaseDate"
              value={equipment.purchaseDate}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Warranty Date */}
          <div>
            <label className="label">Warranty Expiry</label>
            <input
              type="date"
              name="warrantyDate"
              value={equipment.warrantyDate}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <label className="label">Equipment Status</label>
            <select
              name="status"
              value={equipment.status}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="Active">Active</option>
              <option value="Scrap">Scrap</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-ghost"
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-primary">
              Update Equipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEquipment;
