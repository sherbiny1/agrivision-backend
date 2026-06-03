const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
