const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    daysAgo: {
        type: String, // e.g., '2 Days Ago'
    },
    content: {
        type: String,
    }
}, { timestamps: true });

const KnowledgeBase = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
module.exports = KnowledgeBase;
