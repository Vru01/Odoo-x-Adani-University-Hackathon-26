const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { 
    getAllResources, 
    createCompany, 
    createDepartment, 
    createWorkCenter, 
    createCategory 
} = require('../controllers/resourceController');

router.use(authMiddleware);

// Public Read (Authenticated users can see dropdowns)
router.get('/:type', getAllResources); 

// Admin Write Access
router.post('/companies', roleMiddleware(['admin']), createCompany);
router.post('/departments', roleMiddleware(['admin']), createDepartment);
router.post('/work-centers', roleMiddleware(['admin']), createWorkCenter);
router.post('/categories', roleMiddleware(['admin']), createCategory);

module.exports = router;