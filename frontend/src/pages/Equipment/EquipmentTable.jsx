import React, { useState, useEffect, useCallback } from "react";
import {
  FiPlus, FiFilter, FiSearch, FiChevronLeft,
  FiChevronRight, FiEdit3, FiTrash2, FiLoader, FiAlertCircle
} from "react-icons/fi";

const EquipmentTable = () => {
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(r => setTimeout(r, 800));

      setEquipmentData([
        {
          id: 1,
          name: "Samsung Monitor 15\"",
          employee: "Tejas Modi",
          department: "Admin",
          serial: "MT/125/22778837",
          category: "Monitors",
          company: "My Company (SF)"
        }
      ]);
    } catch {
      setError("Failed to fetch equipment records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Equipment Inventory</h1>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? <p>Loading...</p> : <p>{equipmentData.length} items loaded</p>}
    </div>
  );
};

export default EquipmentTable;
