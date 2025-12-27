const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MaintenanceRequest = sequelize.define('MaintenanceRequest', {
    request_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    subject: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: DataTypes.TEXT,
    
    maintenance_scope: {
        type: DataTypes.ENUM('Equipment', 'Work Center'),
        defaultValue: 'Equipment',
        allowNull: false
    },
    
    // IDs for scope
    equipment_id: DataTypes.INTEGER,
    work_center_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,

    // Workflow
    created_by_id: DataTypes.INTEGER,
    team_id: DataTypes.INTEGER,
    technician_id: DataTypes.INTEGER,

    // Status
    maintenance_type: {
        type: DataTypes.ENUM('Corrective', 'Preventive'),
        allowNull: false
    },
    stage: {
        type: DataTypes.ENUM('New', 'In Progress', 'Repaired', 'Scrap'),
        defaultValue: 'New'
    },

    // Dates & KPIs
    request_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    scheduled_date: DataTypes.DATE,
    close_date: DataTypes.DATE,
    duration_hours: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.00
    },
    priority: {
        type: DataTypes.ENUM('0', '1', '2', '3'),
        defaultValue: '0'
    },
    company_id: DataTypes.INTEGER
}, {
    timestamps: false
});

module.exports = MaintenanceRequest;