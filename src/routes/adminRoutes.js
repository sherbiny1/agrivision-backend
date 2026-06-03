const express = require('express');
const router = express.Router();
const { 
    getUsers, 
    deleteUser, 
    getSystemStats 
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

// All routes require authentication and 'Admin' role
router.use(protect);
router.use(authorizeRole('Admin'));

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/system-stats', getSystemStats);

module.exports = router;
