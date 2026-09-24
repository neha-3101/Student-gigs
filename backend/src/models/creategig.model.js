const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    description: {
        type: String
    },

    category: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: Number,
        required: true
    },

    profilePicture: {
        type: String,
        default: ""
    }
});

const gigModel = mongoose.model("gig", gigSchema);

module.exports = gigModel;