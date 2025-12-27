const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { 
    createEquipment, getAllEquipment, getEquipmentById, updateStatus 
} = require('../controllers/equipmentController');

router.use(authMiddleware);

// Read
router.get('/', getAllEquipment);
router.get('/:id', getEquipmentById);

// Write (Admin Only for creation)
router.post('/', roleMiddleware(['admin']), createEquipment);

// Update (Technicians can mark machine as 'maintenance', Admins can do all)
router.put('/:id/status', roleMiddleware(['admin', 'technician']), updateStatus);

module.exports = router;