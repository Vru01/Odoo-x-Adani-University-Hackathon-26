const { Company, Department, WorkCenter, EquipmentCategory } = require('../models');

// --- 1. GET ALL (Dropdowns) ---
exports.getAllResources = async (req, res) => {
    try {
        const { type } = req.params; // url: /api/resources/:type
        let data;

        switch (type) {
            case 'companies': data = await Company.findAll(); break;
            case 'departments': data = await Department.findAll(); break;
            case 'work-centers': data = await WorkCenter.findAll(); break;
            case 'categories': data = await EquipmentCategory.findAll(); break;
            default: return res.status(400).json({ message: "Invalid resource type" });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- 2. CREATE COMPANY (Needed for Work Centers) ---
exports.createCompany = async (req, res) => {
    try {
        const item = await Company.create(req.body);
        res.status(201).json(item);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// --- 3. CREATE DEPARTMENT ---
exports.createDepartment = async (req, res) => {
    try {
        // Body: { name: "Logistics", manager_id: 1 }
        const item = await Department.create(req.body);
        res.status(201).json(item);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// --- 4. CREATE WORK CENTER (Location) ---
exports.createWorkCenter = async (req, res) => {
    try {
        // Body: { name: "Zone A", location: "Building 1", company_id: 1 }
        const item = await WorkCenter.create(req.body);
        res.status(201).json(item);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// --- 5. CREATE CATEGORY (For Equipment) ---
exports.createCategory = async (req, res) => {
    try {
        // Body: { name: "HVAC", maintenance_interval_days: 180 }
        const item = await EquipmentCategory.create(req.body);
        res.status(201).json(item);
    } catch (err) { res.status(500).json({ message: err.message }); }
};