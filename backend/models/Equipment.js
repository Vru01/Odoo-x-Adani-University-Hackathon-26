const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Equipment = sequelize.define('Equipment', {
    equipment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    serial_number: {
        type: DataTypes.STRING(100),
        unique: true
    },
    // Foreign Keys
    category_id: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
    
    // "Used By" Logic
    used_by_type: {
        type: DataTypes.ENUM('employee', 'department'), // Changed to lowercase
        defaultValue: 'employee'
    },
    used_by_employee_id: DataTypes.INTEGER,
    used_by_department_id: DataTypes.INTEGER,
    assigned_employee_id: DataTypes.INTEGER,

    // Maintenance Defaults
    maintenance_team_id: DataTypes.INTEGER,
    technician_id: DataTypes.INTEGER,
    work_center_id: DataTypes.INTEGER,

    // Tracking
    purchase_date: DataTypes.DATEONLY,
    warranty_expiration: DataTypes.DATEONLY,
    
    // Kept this as it is useful for specific spot details (e.g., "Shelf A")
    location: DataTypes.STRING(150), 

    // 👇 FIXED: Renamed to 'status' and lowercase values to match Controller
    status: {
        type: DataTypes.ENUM('active', 'maintenance', 'retired', 'broken'),
        defaultValue: 'active'
    },
    
    description: DataTypes.TEXT
}, {
    timestamps: true, // changed to true so you get createdAt/updatedAt
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Equipment;