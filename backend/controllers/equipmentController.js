const { Equipment, EquipmentCategory, WorkCenter, Department, MaintenanceRequest } = require('../models');

// 1. ADD NEW MACHINE
exports.createEquipment = async (req, res) => {
    try {
        // req.body contains: { name, serial_number, category_id, work_center_id, etc. }
        const equipment = await Equipment.create({
            ...req.body,
            status: 'active' // Default status
        });
        res.status(201).json({ message: "Equipment Added", equipment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. LIST ALL MACHINES (With Filters)
exports.getAllEquipment = async (req, res) => {
    try {
        const { status, category_id, work_center_id } = req.query;
        let whereClause = {};

        if (status) whereClause.status = status;
        if (category_id) whereClause.category_id = category_id;
        if (work_center_id) whereClause.work_center_id = work_center_id;

        const equipmentList = await Equipment.findAll({
            where: whereClause,
            include: [
                { model: EquipmentCategory, attributes: ['name'] },
                { model: WorkCenter, attributes: ['name'] },
                { model: Department, as: 'usedByDepartment', attributes: ['name'] }
            ]
        });
        res.json(equipmentList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. GET SINGLE MACHINE DETAILS + HISTORY
exports.getEquipmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const equipment = await Equipment.findByPk(id, {
            include: [
                { model: EquipmentCategory }, // Get maintenance interval info
                { 
                    model: MaintenanceRequest, // Get History
                    limit: 5,
                    order: [['created_at', 'DESC']],
                    attributes: ['title', 'status', 'created_at'] 
                }
            ]
        });

        if (!equipment) return res.status(404).json({ message: "Equipment not found" });
        res.json(equipment);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. UPDATE STATUS (Quick Action)
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // e.g., 'maintenance', 'retired'

        const equipment = await Equipment.findByPk(id);
        if (!equipment) return res.status(404).json({ message: "Not found" });

        equipment.status = status;
        await equipment.save();

        res.json({ message: "Status Updated", status: equipment.status });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};