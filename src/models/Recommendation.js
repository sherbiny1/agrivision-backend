const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    moistureTips: {
        current: Number,
        goal: Number,
        tips: [String]
    },
    fertilizationTips: {
        current: Number,
        recommended: Number,
        tips: [String]
    },
    recommendedCrops: [{
        name: String,
        icon: String, // e.g., 'Jasmine', 'Tomato', 'Potato'
        howToPlant: String
    }],
    irrigationDashboard: {
        wateringStatus: String, // e.g., 'Dry', 'Balanced'
        nextWatering: String,   // e.g., 'Tomorrow', 'Today'
        wateringFrequency: String, // e.g., 'Every 1-2 days'
        waterAmount: String, // e.g., '1L', '0.5-1L'
        recommendations: [String]
    },
    dailyTasks: [String],
    date: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
module.exports = Recommendation;
