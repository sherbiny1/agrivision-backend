const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
