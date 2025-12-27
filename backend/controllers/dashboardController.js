const { MaintenanceRequest, User, Equipment, Team, sequelize } = require('../models');

exports.getAdminDashboard = async (req, res) => {
    try {
        // --- LIST 1: PENDING USER SIGNUPS ---
        const pendingSignups = await User.findAll({
            where: { account_status: 'pending' },
            attributes: ['user_id', 'full_name', 'email', 'role', 'created_at'],
            // User table HAS timestamps, so 'created_at' works here
            order: [['created_at', 'ASC']] 
        });

        // --- LIST 2: ALL MAINTENANCE REQUESTS ---
        const allMaintenanceRequests = await MaintenanceRequest.findAll({
            attributes: [
                'request_id', 'subject', 'priority', 'stage', 'scheduled_date', 'request_date'
            ],
            include: [
                { model: User, as: 'creator', attributes: ['full_name'] },
                { model: User, as: 'technician', attributes: ['full_name'] },
                { model: Team, attributes: ['name'] }
            ],
            // 👇 FIX: Changed 'created_at' to 'request_date'
            order: [['request_date', 'DESC']] 
        });

        // --- STATS ---
        const pendingCount = await User.count({ where: { account_status: 'pending' } });
        const openJobsCount = await MaintenanceRequest.count({ where: { stage: ['New', 'In Progress'] } });

        res.json({
            stats: {
                pending_users_count: pendingCount,
                open_maintenance_requests: openJobsCount
            },
            signup_requests: pendingSignups,
            maintenance_requests: allMaintenanceRequests
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Server Error fetching dashboard" });
    }
};