const { Team, TeamMember, User } = require('../models');

// 1. Create Team
exports.createTeam = async (req, res) => {
    try {
        const { name, specialization, company_id } = req.body;
        const team = await Team.create({ name, specialization, company_id });
        res.status(201).json(team);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. Get All Teams
exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.findAll({
            include: [{
                model: TeamMember,
                include: [{ model: User, attributes: ['full_name', 'email'] }]
            }]
        });
        res.json(teams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. Add Member
exports.addTeamMember = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { user_id, role } = req.body;

        const user = await User.findByPk(user_id);
        if (!user || user.role !== 'technician') {
            return res.status(400).json({ message: "User must be a technician" });
        }

        const member = await TeamMember.create({
            team_id: teamId,
            user_id,
            role: role || 'member'
        });

        res.status(201).json({ message: "Member added", member });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. UPDATE TEAM (New)
exports.updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, specialization } = req.body;
        
        const team = await Team.findByPk(id);
        if (!team) return res.status(404).json({ message: "Team not found" });

        if (name) team.name = name;
        if (specialization) team.specialization = specialization;

        await team.save();
        res.json({ message: "Team updated", team });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 5. DELETE TEAM (New)
exports.deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await Team.findByPk(id);
        if (!team) return res.status(404).json({ message: "Team not found" });

        await team.destroy();
        res.json({ message: "Team deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};