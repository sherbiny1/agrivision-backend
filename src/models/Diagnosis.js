const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    imageUrl: {
        type: String,
        required: true,
    },
    scanScore: { type: Number, required: true }, // e.g., 92
    healthStatus: { type: String, required: true }, // e.g., "Unhealthy"
    
    // Detailed analysis
    pests: [{
        name: String,
        percentage: Number
    }],
    diseases: [{
        name: String,
        percentage: Number
    }],
    wiltsPercentage: { type: Number, default: 0 },
    leafSpotsPercentage: { type: Number, default: 0 },
    
    // Treatment Recommendations
    pestTreatment: {
        currentRate: Number,
        futureGrowth: Number,
        recommendations: [String]
    },
    diseaseTreatment: {
        currentRate: Number,
        futureGrowth: Number,
        recommendations: [String]
    },

    status: {
        type: String,
        enum: ['Pending', 'Validated'],
        default: 'Pending',
    },
    agronomistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    agronomistNotes: {
        type: String,
    }
}, { timestamps: true });

const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema);
module.exports = Diagnosis;
