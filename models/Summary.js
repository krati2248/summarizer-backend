const mongoose = require('mongoose');

const sumrySchema = new mongoose.Schema({ 
    summaryText: {
        type: String,
        required: true, 
    },

    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
        required: false
    },
    createdBy:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    }
}, { timestamp: true });
const sumry = mongoose.model("summary", sumrySchema);
module.exports = sumry;
