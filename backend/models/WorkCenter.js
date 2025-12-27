const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Company = require('./Company');

const WorkCenter = sequelize.define('WorkCenter', {
    work_center_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(50)
    },
    working_hours_per_week: {
        type: DataTypes.DECIMAL(5, 2)
    },
    company_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'company_id'
        }
    }
}, {
    timestamps: false
});

module.exports = WorkCenter;