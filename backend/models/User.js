const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    avatar_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('admin', 'technician', 'user'),
        defaultValue: 'user'
    },
    account_status: {
        type: DataTypes.ENUM('pending', 'active', 'rejected'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    
    // 👇 SECURITY HOOKS
    hooks: {
        // Before creating a user, hash the password
        beforeCreate: async (user) => {
            if (user.password_hash) {
                const salt = await bcrypt.genSalt(10);
                user.password_hash = await bcrypt.hash(user.password_hash, salt);
            }
        },
        // If you ever update the password later
        beforeUpdate: async (user) => {
            if (user.changed('password_hash')) {
                const salt = await bcrypt.genSalt(10);
                user.password_hash = await bcrypt.hash(user.password_hash, salt);
            }
        }
    }
});

// 👇 Instance method to validate password during login
User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password_hash);
};

module.exports = User;