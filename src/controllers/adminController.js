const User = require('../models/User');
const Diagnosis = require('../models/Diagnosis');
const FarmData = require('../models/FarmData');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get system stats
// @route   GET /api/admin/system-stats
// @access  Private (Admin only)
const getSystemStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const diagnosisCount = await Diagnosis.countDocuments();
        const farmDataCount = await FarmData.countDocuments();

        const pendingDiagnoses = await Diagnosis.countDocuments({ status: 'Pending' });
        const validatedDiagnoses = await Diagnosis.countDocuments({ status: 'Validated' });

        res.json({
            users: userCount,
            diagnoses: {
                total: diagnosisCount,
                pending: pendingDiagnoses,
                validated: validatedDiagnoses
            },
            farmDataEntries: farmDataCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    deleteUser,
    getSystemStats
};
