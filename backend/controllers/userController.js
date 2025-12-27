const { User } = require('../models');

// 1. List All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['user_id', 'full_name', 'email', 'role', 'account_status', 'created_at']
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. Update User (Approve/Promote)
exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, account_status } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (role) user.role = role;
        if (account_status) user.account_status = account_status;

        await user.save();
        res.json({ message: "User updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. DELETE USER (New - Admin Only)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        
        if (!user) return res.status(404).json({ message: "User not found" });

        // Prevent Admin from deleting themselves
        if (user.role === 'admin' && user.user_id === req.user.user_id) {
            return res.status(400).json({ message: "You cannot delete your own admin account" });
        }

        await user.destroy();
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};