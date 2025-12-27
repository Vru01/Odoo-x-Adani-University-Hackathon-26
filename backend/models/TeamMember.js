const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Team = require('./Team');
const User = require('./User');

const TeamMember = sequelize.define('TeamMember', {
    member_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Team,
            key: 'team_id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    }
}, {
    timestamps: false
});

module.exports = TeamMember;