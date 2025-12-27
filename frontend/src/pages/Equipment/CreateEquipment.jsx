import React, { useState } from "react";

const CreateEquipment = () => {
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

  const handleChange = (e) => {
    setEquipment({ ...equipment, [e.target.name]: e.target.value });
  };

  const isFormValid =
    equipment.name &&
    equipment.serialNumber &&
    equipment.category &&
    equipment.maintenanceTeam;

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Equipment Created:", equipment);

    alert("Equipment created successfully ✅");

    // Reset form (optional)
    setEquipment({
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
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100">

        {/* HEADER */}
        <div className="px-6 py-5 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Equipment
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Add and manage company assets for maintenance tracking
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
              placeholder="CNC Machine / Printer"
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
              placeholder="SN-001245"
              className="input input-bordered w-full"
              required
            />
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
              placeholder="Assigned by default"
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
              placeholder="Building / Floor / Room"
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
              type="reset"
              className="btn btn-ghost"
              onClick={() =>
                setEquipment({
                  name: "",
                  serialNumber: "",
                  category: "",
                  maintenanceTeam: "",
                  technician: "",
                  purchaseDate: "",
                  warrantyDate: "",
                  location: "",
                  status: "Active",
                })
              }
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`btn ${
                isFormValid
                  ? "btn-primary"
                  : "btn-disabled"
              }`}
            >
              Save Equipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEquipment;
