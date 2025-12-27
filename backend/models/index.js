const { sequelize } = require('../config/db');

// 1. Import all models
const User = require('./User');
const Company = require('./Company');
const Department = require('./Department');
const Team = require('./Team');
const TeamMember = require('./TeamMember');
const EquipmentCategory = require('./EquipmentCategory');
const WorkCenter = require('./WorkCenter');
const Equipment = require('./Equipment');
const MaintenanceRequest = require('./MaintenanceRequest');
const RefreshToken = require('./RefreshToken'); // Import RefreshToken

// 2. Define Associations (The Links)

// --- User & Auth ---
// Link User to RefreshToken (One-to-One or One-to-Many)
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(RefreshToken, { foreignKey: 'user_id' });

// --- Departments ---
Department.belongsTo(User, { foreignKey: 'manager_id', as: 'manager' });

// --- Teams ---
Team.belongsTo(Company, { foreignKey: 'company_id' });
Team.hasMany(TeamMember, { foreignKey: 'team_id' });
TeamMember.belongsTo(Team, { foreignKey: 'team_id' });
TeamMember.belongsTo(User, { foreignKey: 'user_id' });

// --- Categories ---
EquipmentCategory.belongsTo(User, { foreignKey: 'responsible_id', as: 'responsible' });
EquipmentCategory.belongsTo(Company, { foreignKey: 'company_id' });

// --- Work Centers ---
WorkCenter.belongsTo(Company, { foreignKey: 'company_id' });

// --- Equipment (The Main Asset) ---
Equipment.belongsTo(EquipmentCategory, { foreignKey: 'category_id' });
Equipment.belongsTo(Company, { foreignKey: 'company_id' });
Equipment.belongsTo(User, { foreignKey: 'used_by_employee_id', as: 'usedByEmployee' });
Equipment.belongsTo(Department, { foreignKey: 'used_by_department_id', as: 'usedByDepartment' });
Equipment.belongsTo(User, { foreignKey: 'assigned_employee_id', as: 'assignedEmployee' });
Equipment.belongsTo(Team, { foreignKey: 'maintenance_team_id', as: 'maintenanceTeam' });
Equipment.belongsTo(User, { foreignKey: 'technician_id', as: 'technician' });
Equipment.belongsTo(WorkCenter, { foreignKey: 'work_center_id' });

// --- Maintenance Requests (The Transaction) ---
MaintenanceRequest.belongsTo(Equipment, { foreignKey: 'equipment_id' });
MaintenanceRequest.belongsTo(WorkCenter, { foreignKey: 'work_center_id' });
MaintenanceRequest.belongsTo(EquipmentCategory, { foreignKey: 'category_id' });
MaintenanceRequest.belongsTo(User, { foreignKey: 'created_by_id', as: 'creator' });
MaintenanceRequest.belongsTo(Team, { foreignKey: 'team_id' });
MaintenanceRequest.belongsTo(User, { foreignKey: 'technician_id', as: 'technician' });
MaintenanceRequest.belongsTo(Company, { foreignKey: 'company_id' });

// **Crucial for Smart Buttons:** Allows `await equipment.getMaintenanceRequests()`
Equipment.hasMany(MaintenanceRequest, { foreignKey: 'equipment_id' }); 

User.hasMany(MaintenanceRequest, { foreignKey: 'technician_id', as: 'assigned_requests' });

// 3. Export everything
module.exports = {
    sequelize,
    User,
    Company,
    Department,
    Team,
    TeamMember,
    EquipmentCategory,
    WorkCenter,
    Equipment,
    MaintenanceRequest,
    RefreshToken
};