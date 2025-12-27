const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

// Controllers
const { 
    createTeam, 
    getAllTeams, 
    addTeamMember, 
    updateTeam,   // 👈 New
    deleteTeam    // 👈 New
} = require('../controllers/teamController');

const { 
    getAllUsers, 
    updateUserStatus, 
    deleteUser    // 👈 New
} = require('../controllers/userController');

const { getAdminDashboard } = require('../controllers/dashboardController');

// Global Guard: Admin Only
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// --- DASHBOARD ---
router.get('/dashboard', getAdminDashboard);

// --- USER MANAGEMENT ---
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserStatus);
router.delete('/users/:id', deleteUser); 

// --- TEAM MANAGEMENT ---
router.get('/teams', getAllTeams);
router.post('/teams', createTeam);
router.put('/teams/:id', updateTeam);    
router.delete('/teams/:id', deleteTeam); 
router.post('/teams/:teamId/members', addTeamMember);

module.exports = router;