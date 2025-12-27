const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { 
    createRequest, 
    getAllRequests, 
    getRequestById, 
    updateRequest, 
    deleteRequest 
} = require('../controllers/maintenanceController');

router.use(authMiddleware);

// CRUD Routes
router.post('/requests', createRequest);        // Create
router.get('/requests', getAllRequests);        // List All
router.get('/requests/:id', getRequestById);    // Read One

// Update (Admin/Tech can assign/schedule, User can edit description)
router.put('/requests/:id', updateRequest); 

// Delete (Admin Only)
router.delete('/requests/:id', roleMiddleware(['admin']), deleteRequest);

module.exports = router;