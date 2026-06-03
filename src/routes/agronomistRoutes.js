const express = require('express');
const router = express.Router();
const { 
    getPendingDiagnoses, 
    validateDiagnosis 
} = require('../controllers/agronomistController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

// All routes require authentication and 'Agronomist' role
router.use(protect);
router.use(authorizeRole('Agronomist'));

router.get('/diagnoses/pending', getPendingDiagnoses);
router.put('/diagnoses/:id/validate', validateDiagnosis);

module.exports = router;
