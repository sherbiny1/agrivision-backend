const Diagnosis = require('../models/Diagnosis');

// @desc    Get all pending diagnoses
// @route   GET /api/agronomist/diagnoses/pending
// @access  Private (Agronomist only)
const getPendingDiagnoses = async (req, res) => {
    try {
        const diagnoses = await Diagnosis.find({ status: 'Pending' })
            .populate('farmerId', 'name email')
            .sort({ createdAt: -1 });
            
        res.json(diagnoses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Validate diagnosis and provide treatment
// @route   PUT /api/agronomist/diagnoses/:id/validate
// @access  Private (Agronomist only)
const validateDiagnosis = async (req, res) => {
    try {
        const { treatmentAdvice } = req.body;
        
        if (!treatmentAdvice) {
            return res.status(400).json({ message: 'Please provide treatment advice' });
        }

        const diagnosis = await Diagnosis.findById(req.params.id);

        if (!diagnosis) {
            return res.status(404).json({ message: 'Diagnosis not found' });
        }

        diagnosis.status = 'Validated';
        diagnosis.agronomistNotes = treatmentAdvice;
        diagnosis.agronomistId = req.user._id;

        const updatedDiagnosis = await diagnosis.save();

        res.json(updatedDiagnosis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPendingDiagnoses,
    validateDiagnosis
};
