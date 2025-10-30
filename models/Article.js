const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({ 
    content: {
        type: String,
        required: true 
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const article = mongoose.model("Article", articleSchema);
module.exports = article;
