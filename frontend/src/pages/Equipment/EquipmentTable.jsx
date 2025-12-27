import React, { useState } from "react";
import { Link } from "react-router-dom";

const EquipmentList = () => {
  const [search, setSearch] = useState("");

  // 🔹 Mock data (replace with API later)
  const equipments = [
    {
      id: 1,
      name: "CNC Machine",
      serialNumber: "SN-001",
      category: "Mechanical",
      team: "Mechanics",
      location: "Plant Floor",
      status: "Active",
    },
    {
      id: 2,
      name: "Office Printer",
      serialNumber: "SN-002",
      category: "IT",
      team: "IT Support",
      location: "Office",
      status: "Active",
    },
    {
      id: 3,
      name: "Generator",
      serialNumber: "SN-003",
      category: "Electrical",
      team: "Electricians",
      location: "Basement",
      status: "Scrap",
    },
  ];

  const filteredEquipments = equipments.filter(
    (eq) =>
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow border">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Equipment List
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track all company assets
            </p>
          </div>

          <Link
            to="/equipment/create"
            className="btn btn-primary mt-4 md:mt-0"
          >
            + Add Equipment
          </Link>
        </div>

        {/* SEARCH */}
        <div className="p-6">
          <input
            type="text"
            placeholder="Search by name or serial number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full max-w-md"
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Serial No</th>
                <th>Category</th>
                <th>Team</th>
                <th>Location</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEquipments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No equipment found
                  </td>
                </tr>
              ) : (
                filteredEquipments.map((eq, index) => (
                  <tr key={eq.id} className="hover">
                    <td>{index + 1}</td>
                    <td className="font-medium">{eq.name}</td>
                    <td>{eq.serialNumber}</td>
                    <td>{eq.category}</td>
                    <td>{eq.team}</td>
                    <td>{eq.location}</td>
                    <td>
                      <span
                        className={`badge ${
                          eq.status === "Active"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {eq.status}
                      </span>
                    </td>
                    <td className="text-right space-x-2">
                      <Link
                        to={`/equipment/${eq.id}`}
                        className="btn btn-xs btn-outline"
                      >
                        View
                      </Link>
                      <Link
                        to={`/equipment/edit`}
                        className="btn btn-xs btn-outline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EquipmentList;
