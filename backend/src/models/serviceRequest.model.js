const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
    {
        gigId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "gig",
            required: true,
        },

        requesterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "auth",
            required: true,
        },

        gigOwnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "auth",
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
            default: "pending",
        },

        progressStatus: {
            type: String,
            default: "",
        },

        progressMessage: {
            type: String,
            default: "",
        },

        agreedTime: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);

module.exports = ServiceRequest;
