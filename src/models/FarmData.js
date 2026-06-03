const mongoose = require('mongoose');

const farmDataSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    // Survey Data
    soilFeel: { type: String },
    soilWetness: { type: String },
    soilColor: { type: String },
    soilSmell: { type: String },
    plantLook: { type: String },
    previousCrop: { type: String },

    // Detailed Test Results
    soilMoisture: { type: String }, // Low, Medium, High
    soilMoisturePercentage: { type: Number },
    soilFertility: { type: String }, // Very Poor, Moderate, Good, Very Good
    soilFertilityPercentage: { type: Number },
    drainageQuality: { type: Number }, // percentage
    nutrientLevel: { type: String }, // Low, Medium, High
    phLevel: { type: Number }, // value

    dateEntered: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

const FarmData = mongoose.model('FarmData', farmDataSchema);
module.exports = FarmData;
