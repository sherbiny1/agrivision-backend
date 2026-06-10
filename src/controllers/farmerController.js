const Diagnosis = require('../models/Diagnosis');
const FarmData = require('../models/FarmData');
const Recommendation = require('../models/Recommendation');
const Notification = require('../models/Notification');
const Task = require('../models/Task');
const KnowledgeBase = require('../models/KnowledgeBase');
const User = require('../models/User');

// @desc    Upload plant image for disease scanning (Detailed)
// @route   POST /api/farmer/scan-plant
// @access  Private
const scanPlant = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        // MOCK AI INTEGRATION
        await new Promise(resolve => setTimeout(resolve, 1500));

        const diagnosis = await Diagnosis.create({
            farmerId: req.user._id,
            imageUrl: imageUrl,
            scanScore: 92,
            healthStatus: 'Unhealthy',
            pests: [
                { name: 'Snails and Slugs', percentage: 5 },
                { name: 'Whiteflies', percentage: 10 },
                { name: 'Thrips', percentage: 5 },
                { name: 'Ant', percentage: 5 }
            ],
            diseases: [
                { name: 'Leaf Spots', percentage: 50 },
                { name: 'Mosaic virus', percentage: 10 },
                { name: 'Rot', percentage: 5 }
            ],
            wiltsPercentage: 3,
            leafSpotsPercentage: 70,
            pestTreatment: {
                currentRate: 15,
                futureGrowth: 85,
                recommendations: [
                    'Remove heavily infested leaves',
                    'Wash the plant gently with clean water',
                    'Apply a natural pest treatment'
                ]
            },
            diseaseTreatment: {
                currentRate: 10,
                futureGrowth: 90,
                recommendations: [
                    'Isolate the plant to stop disease spread',
                    'Keep the plant dry and well ventilated',
                    'Apply the recommended disease treatment'
                ]
            }
        });

        res.status(201).json(diagnosis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all diagnoses for the logged-in farmer
// @route   GET /api/farmer/diagnoses
// @access  Private
const getDiagnoses = async (req, res) => {
    try {
        const diagnoses = await Diagnosis.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
        res.json(diagnoses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Enter Farm Data (Detailed Survey)
// @route   POST /api/farmer/farm-data
// @access  Private
const enterFarmData = async (req, res) => {
    try {
        const { soilFeel, soilWetness, soilColor, soilSmell, plantLook, previousCrop } = req.body;

        // Dynamic calculation based on inputs
        let moistureScore = 50;
        let fertilityScore = 50;
        let phLevelCalc = 6.5;

        // Analyze Wetness for Moisture
        const wetness = (soilWetness || '').toLowerCase();
        if (wetness.includes('wet') || wetness.includes('muddy')) moistureScore += 30;
        if (wetness.includes('dry')) moistureScore -= 30;

        // Analyze Color & Smell for Fertility
        const color = (soilColor || '').toLowerCase();
        const smell = (soilSmell || '').toLowerCase();
        if (color.includes('dark')) fertilityScore += 20;
        if (color.includes('light')) fertilityScore -= 10;
        if (smell.includes('earthy') || smell.includes('fresh')) fertilityScore += 15;
        if (smell.includes('sour')) { fertilityScore -= 20; phLevelCalc -= 1.0; }

        // Analyze Plant Look
        const look = (plantLook || '').toLowerCase();
        if (look.includes('yellow') || look.includes('wilting')) fertilityScore -= 15;
        if (look.includes('green') || look.includes('healthy')) fertilityScore += 20;

        // Clamp scores between 0-100
        moistureScore = Math.max(0, Math.min(100, moistureScore));
        fertilityScore = Math.max(0, Math.min(100, fertilityScore));

        const moistureLabel = moistureScore < 40 ? 'Low' : moistureScore > 75 ? 'High' : 'Medium';
        const fertilityLabel = fertilityScore < 40 ? 'Poor' : fertilityScore > 75 ? 'Excellent' : 'Good';

        const farmData = await FarmData.create({
            farmerId: req.user._id,
            soilFeel, soilWetness, soilColor, soilSmell, plantLook, previousCrop,
            soilMoisture: moistureLabel,
            soilMoisturePercentage: moistureScore,
            soilFertility: fertilityLabel,
            soilFertilityPercentage: fertilityScore,
            drainageQuality: Math.max(0, 100 - (moistureScore > 80 ? 40 : 10)),
            nutrientLevel: fertilityLabel,
            phLevel: phLevelCalc
        });

        // Dynamic recommendations based on calculated scores
        const recommendation = await Recommendation.create({
            farmerId: req.user._id,
            moistureTips: {
                current: moistureScore,
                goal: 60,
                tips: moistureScore < 40
                    ? ['Water immediately', 'Add mulch to retain moisture', 'Check irrigation system']
                    : moistureScore > 80
                        ? ['Stop watering', 'Improve soil drainage', 'Check for root rot']
                        : ['Maintain current watering schedule', 'Check soil daily', 'Use mulch or organic matter']
            },
            fertilizationTips: {
                current: fertilityScore,
                recommended: 80,
                tips: fertilityScore < 50
                    ? ['Apply NPK fertilizer', 'Add compost/organic matter', 'Test soil again in 2 weeks']
                    : ['Maintain nutrient balance', 'Apply fertilizer sparingly', 'Fertilize at the right time']
            },
            recommendedCrops: [
                { name: 'Jasmine Flower', icon: 'flower', howToPlant: 'Plant seedling in a sunny spot...' },
                { name: 'Tomato Plant', icon: 'tomato', howToPlant: 'Plant seedling deep, keep soil moist...' },
                { name: 'Potato', icon: 'potato', howToPlant: 'Plant seed potato pieces 10-15 cm deep...' }
            ],
            irrigationDashboard: {
                wateringStatus: moistureLabel === 'High' ? 'Too Wet' : moistureLabel === 'Low' ? 'Dry' : 'Balanced',
                nextWatering: moistureLabel === 'High' ? 'Wait 3 days' : moistureLabel === 'Low' ? 'Today' : 'Tomorrow',
                wateringFrequency: moistureLabel === 'High' ? 'Every 4 days' : 'Every 1-2 days',
                waterAmount: moistureLabel === 'Low' ? '1-2L' : '0.5-1L',
                recommendations: moistureScore < 50
                    ? ['Water plant deeply', 'Check soil moisture tomorrow', 'Adjust based on temperature']
                    : ['Let top soil dry', 'Avoid overwatering', 'Ensure pot has drainage holes']
            },
            dailyTasks: [
                'Check soil moisture and water if dry',
                'Inspect leaves and stems for pests',
                'Remove weeds or debris from soil surface',
                'Add organic matter if needed'
            ]
        });

        // Extract tasks into separate Task documents for the dashboard
        for (let taskStr of recommendation.dailyTasks) {
            await Task.create({ farmerId: req.user._id, title: taskStr });
        }

        // Create notifications for the farmer
        await Notification.create({
            farmerId: req.user._id,
            title: 'Your Daily Tasks',
            body: 'Your plant is waiting for you. Check your daily tasks now.'
        });

        await Notification.create({
            farmerId: req.user._id,
            title: 'Irrigation Reminder',
            body: `Watering Status: ${recommendation.irrigationDashboard.wateringStatus}. Next watering: ${recommendation.irrigationDashboard.nextWatering}.`
        });

        await Notification.create({
            farmerId: req.user._id,
            title: 'Soil Test Complete',
            body: `Your soil is ${recommendation.fertilizationTips.current < 50 ? 'low on nutrients. Apply fertilizer soon.' : 'in good condition. Keep it up!'}`
        });

        res.status(201).json({ farmData, recommendation });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all recommendations for the logged-in farmer
// @route   GET /api/farmer/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
    try {
        const recommendations = await Recommendation.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard stats (Detailed for Home screen)
// @route   GET /api/farmer/home
// @access  Private
const getHome = async (req, res) => {
    try {
        const totalDiagnoses = await Diagnosis.countDocuments({ farmerId: req.user._id });
        const recentDiagnoses = await Diagnosis.find({ farmerId: req.user._id }).sort({ createdAt: -1 }).limit(5);

        const tasks = await Task.find({ farmerId: req.user._id, isCompleted: false }).limit(3);
        const notifications = await Notification.find({ farmerId: req.user._id, isRead: false }).limit(2);

        res.json({
            user: { name: req.user.name },
            weather: {
                temp: 23,
                condition: 'Partly Cloudy',
                humidity: 10,
                wind: 12
            },
            stats: {
                totalTests: totalDiagnoses,
                averageSatisfied: 70
            },
            dailyTasks: tasks,
            notifications
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Notifications
// @route   GET /api/farmer/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Knowledge Base
// @route   GET /api/farmer/knowledge-base
// @access  Private
const getKnowledgeBase = async (req, res) => {
    try {
        // Since Knowledge Base is global, no farmerId filter
        const kb = await KnowledgeBase.find({}).sort({ createdAt: -1 });
        res.json(kb);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Settings (Language)
// @route   PUT /api/farmer/settings/language
// @access  Private
const updateLanguage = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.language = req.body.language;
        await user.save();
        res.json({ message: 'Language updated', language: user.language });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged-in user profile
// @route   GET /api/farmer/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get combined test history (plant scans + soil tests)
// @route   GET /api/farmer/test-history
// @access  Private
const getTestHistory = async (req, res) => {
    try {
        const diagnoses = await Diagnosis.find({ farmerId: req.user._id })
            .sort({ createdAt: -1 })
            .select('imageUrl healthStatus scanScore createdAt');

        const soilTests = await FarmData.find({ farmerId: req.user._id })
            .sort({ createdAt: -1 })
            .select('soilMoisture soilFertility phLevel createdAt');

        // Tag each entry with its type
        const diagnosisHistory = diagnoses.map(d => ({ ...d.toObject(), type: 'PlantScan' }));
        const soilHistory = soilTests.map(s => ({ ...s.toObject(), type: 'SoilTest' }));

        // Merge and sort by date descending
        const combined = [...diagnosisHistory, ...soilHistory].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        res.json(combined);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Soil Test History

// @route   GET /api/farmer/soil-history
// @access  Private
const getSoilHistory = async (req, res) => {
    try {
        const history = await FarmData.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a notification (from Flutter task reminders, etc.)
// @route   POST /api/farmer/notifications
// @access  Private
const createNotification = async (req, res) => {
    try {
        const { title, body } = req.body;

        if (!title || !body) {
            return res.status(400).json({ message: 'Please provide title and body' });
        }

        const notification = await Notification.create({
            farmerId: req.user._id,
            title,
            body,
        });

        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/farmer/notifications/:id/read
// @access  Private
const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            farmerId: req.user._id,
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.isRead = true;
        await notification.save();

        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all tasks for the logged-in farmer
// @route   GET /api/farmer/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle task completion
// @route   PUT /api/farmer/tasks/:id/toggle
// @access  Private
const toggleTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            farmerId: req.user._id,
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.isCompleted = !task.isCompleted;
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
};
