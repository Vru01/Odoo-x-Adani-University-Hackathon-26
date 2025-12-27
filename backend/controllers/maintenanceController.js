const { MaintenanceRequest, Equipment, WorkCenter, User, Team, EquipmentCategory, Company } = require('../models');

// 1. CREATE REQUEST
exports.createRequest = async (req, res) => {
    try {
        const { 
            subject, title,      // Handle both inputs
            description, 
            maintenance_scope, 
            selected_id, 
            category_id, 
            maintenance_type, 
            team_id, 
            technician_id, 
            scheduled_date, 
            duration_hours, 
            priority, 
            company_id 
        } = req.body;

        // 1. Priority Mapping: Convert words to DB Enums ('0','1','2','3')
        const priorityMap = { 'low': '0', 'medium': '1', 'high': '2', 'critical': '3' };
        const dbPriority = priorityMap[priority] || priority || '0';

        // 2. Defaulting Scope & Type
        const scope = maintenance_scope || 'Equipment';
        const type = maintenance_type || 'Corrective';

        const newRequest = await MaintenanceRequest.create({
            // 👇 SAFETY FIX: If frontend sends 'title', we use it as 'subject'
            subject: subject || title, 
            description,
            
            maintenance_scope: scope,
            // Logic to link ID based on scope
            equipment_id: scope === 'Equipment' ? selected_id : null,
            work_center_id: scope === 'Work Center' ? selected_id : null,
            
            category_id,
            maintenance_type: type,
            
            // Workflow assignments
            created_by_id: req.user.user_id || req.user.id, 
            team_id, 
            technician_id, 
            company_id,

            // Dates & Stats
            request_date: new Date(),
            scheduled_date: scheduled_date ? new Date(scheduled_date) : null,
            duration_hours: duration_hours || 0.00,
            priority: dbPriority,
            stage: 'New',
            close_date: null // Explicitly null on creation
        });

        res.status(201).json({ message: "Request Created Successfully", request: newRequest });
    } catch (error) {
        console.error("Create Request Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// 2. GET ALL REQUESTS
exports.getAllRequests = async (req, res) => {
    try {
        let whereClause = {};
        const userId = req.user.user_id || req.user.id;

        // Role-Based Filtering
        if (req.user.role === 'technician') {
            whereClause.technician_id = userId;
        } else if (req.user.role === 'user') {
            whereClause.created_by_id = userId;
        }

        const requests = await MaintenanceRequest.findAll({
            where: whereClause,
            include: [
                { model: User, as: 'creator', attributes: ['full_name'] },
                { model: User, as: 'technician', attributes: ['full_name'] },
                { model: Team, attributes: ['name'] },
                { model: Equipment, attributes: ['name', 'serial_number'] },
                { model: WorkCenter, attributes: ['name'] },
                { model: EquipmentCategory, attributes: ['name'] }
            ],
            order: [['request_date', 'DESC']]
        });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. GET SINGLE REQUEST
exports.getRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await MaintenanceRequest.findByPk(id, {
            include: [
                { model: User, as: 'creator', attributes: ['full_name'] },
                { model: User, as: 'technician', attributes: ['full_name'] },
                { model: Team },
                { model: Equipment },
                { model: WorkCenter },
                { model: Company }
            ]
        });

        if (!request) return res.status(404).json({ message: "Request not found" });
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. UPDATE REQUEST
exports.updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const request = await MaintenanceRequest.findByPk(id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        // Logic for Users (Limited access)
        if (req.user.role === 'user') {
             const allowedUpdates = ['subject', 'title', 'description'];
             Object.keys(updateData).forEach(key => {
                 if(allowedUpdates.includes(key)) {
                    if (key === 'title') request.subject = updateData[key]; // Handle title mapping
                    else request[key] = updateData[key];
                 }
             });
        } else {
            // Logic for Admins/Techs
            
            // 1. Stage Mapping
            if (updateData.status || updateData.stage) {
                const statusMap = { 
                    'pending': 'New', 
                    'in_progress': 'In Progress', 
                    'repaired': 'Repaired', 
                    'scrap': 'Scrap' 
                };
                const newStage = statusMap[updateData.status] || updateData.stage || updateData.status;
                
                request.stage = newStage;

                // 👇 SMART FIX: If stage is 'Repaired' or 'Scrap', set close_date automatically
                if (['Repaired', 'Scrap'].includes(newStage)) {
                    request.close_date = new Date();
                }
            }
            
            // 2. Other Fields
            if (updateData.technician_id) request.technician_id = updateData.technician_id;
            if (updateData.team_id) request.team_id = updateData.team_id;
            if (updateData.scheduled_date) request.scheduled_date = new Date(updateData.scheduled_date);
            if (updateData.duration_hours) request.duration_hours = updateData.duration_hours;
            
            // Priority Mapping
            if (updateData.priority) {
                const priorityMap = { 'low': '0', 'medium': '1', 'high': '2', 'critical': '3' };
                request.priority = priorityMap[updateData.priority] || updateData.priority;
            }
        }

        await request.save();
        res.json({ message: "Request Updated", request });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. DELETE REQUEST
exports.deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await MaintenanceRequest.findByPk(id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        await request.destroy();
        res.json({ message: "Request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};