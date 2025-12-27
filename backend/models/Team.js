const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Company = require('./Company');

const Team = sequelize.define('Team', {
    team_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    specialization: {
        type: DataTypes.STRING(100),
        allowNull: true
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

module.exports = Team;