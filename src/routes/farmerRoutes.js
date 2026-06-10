const express = require('express');
const router = express.Router();
const { 
    scanPlant, 
    getDiagnoses, 
    enterFarmData, 
    getRecommendations, 
    getSoilHistory,
    getTestHistory,
    getProfile,
    getHome,
    getNotifications,
    createNotification,
    markNotificationRead,
    getTasks,
    toggleTask,
    getKnowledgeBase,
    updateLanguage
} = require('../controllers/farmerController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes require authentication and 'Farmer' role
router.use(protect);
router.use(authorizeRole('Farmer'));

router.get('/home', getHome);
router.get('/profile', getProfile);
router.post('/scan-plant', upload.single('image'), scanPlant);
router.get('/diagnoses', getDiagnoses);
router.post('/farm-data', enterFarmData);
router.get('/recommendations', getRecommendations);
router.get('/soil-history', getSoilHistory);
router.get('/test-history', getTestHistory);
router.get('/notifications', getNotifications);
router.post('/notifications', createNotification);
router.put('/notifications/:id/read', markNotificationRead);
router.get('/tasks', getTasks);
router.put('/tasks/:id/toggle', toggleTask);
router.get('/knowledge-base', getKnowledgeBase);
router.put('/settings/language', updateLanguage);

module.exports = router;

