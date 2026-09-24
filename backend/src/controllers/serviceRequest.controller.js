const ServiceRequest = require("../models/serviceRequest.model");
const gigModel = require("../models/creategig.model");
const userModel = require("../models/auth.model");


// ========================================
// CATEGORY-SPECIFIC PROGRESS FLOWS
// ========================================

const PROGRESS_FLOWS = {
    Teaching: ["connected", "scheduled", "in_progress", "completed"],
    Coding: ["connected", "work_started", "in_progress", "ready_for_review", "completed"],
    Design: ["connected", "work_started", "in_progress", "ready_for_review", "completed"],
};

const DEFAULT_FLOW = ["connected", "in_progress", "completed"];


// ========================================
// CREATE SERVICE REQUEST
// ========================================
async function createRequest(req, res) {
    try {
        const { gigId } = req.body;

        if (!gigId) {
            return res.status(400).json({
                message: "gigId is required",
            });
        }

        // Find the gig
        const gig = await gigModel.findById(gigId);

        if (!gig) {
            return res.status(404).json({
                message: "Gig not found",
            });
        }

        // Find the requester (current logged-in user)
        const requester = await userModel.findOne({
            email: req.user.email,
        });

        if (!requester) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        // Find the gig owner
        const gigOwner = await userModel.findOne({
            email: gig.email,
        });

        if (!gigOwner) {
            return res.status(404).json({
                message: "Gig owner not found",
            });
        }

        // Prevent self-request
        if (requester._id.toString() === gigOwner._id.toString()) {
            return res.status(400).json({
                message: "You cannot send a request to your own gig",
            });
        }

        // Prevent duplicate active requests (pending or accepted)
        const existingRequest = await ServiceRequest.findOne({
            gigId: gig._id,
            requesterId: requester._id,
            status: { $in: ["pending", "accepted"] },
        });

        if (existingRequest) {
            return res.status(409).json({
                message: "Request already exists",
                request: existingRequest,
            });
        }

        // Create the service request
        const serviceRequest = await ServiceRequest.create({
            gigId: gig._id,
            requesterId: requester._id,
            gigOwnerId: gigOwner._id,
            status: "pending",
        });

        res.status(201).json({
            message: "Service request sent successfully",
            serviceRequest,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to create service request",
            error: error.message,
        });
    }
}


// ========================================
// CANCEL SERVICE REQUEST (Toggle support)
// ========================================
async function cancelRequest(req, res) {
    try {
        const user = await userModel.findOne({
            email: req.user.email,
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        const { id, gigId } = req.params;

        let request;
        if (id) {
            request = await ServiceRequest.findById(id);
        } else if (gigId) {
            request = await ServiceRequest.findOne({
                gigId: gigId,
                requesterId: user._id,
                status: "pending",
            });
        }

        if (!request) {
            return res.status(404).json({
                message: "Pending service request not found",
            });
        }

        // Only requester can cancel their pending request
        if (request.requesterId.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to cancel this request",
            });
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                message: `Cannot cancel a request with status: ${request.status}`,
            });
        }

        request.status = "cancelled";
        await request.save();

        res.status(200).json({
            message: "Service request cancelled successfully",
            request,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to cancel service request",
            error: error.message,
        });
    }
}


// ========================================
// GET MY REQUESTS (as requester)
// ========================================
async function getMyRequests(req, res) {
    try {
        const user = await userModel.findOne({
            email: req.user.email,
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        const requests = await ServiceRequest.find({
            requesterId: user._id,
        })
            .populate("gigId", "title category price name email phone profilePicture")
            .populate("gigOwnerId", "name email profilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "My requests fetched successfully",
            requests,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch my requests",
            error: error.message,
        });
    }
}


// ========================================
// GET RECEIVED REQUESTS (as gig owner)
// ========================================
async function getReceivedRequests(req, res) {
    try {
        const user = await userModel.findOne({
            email: req.user.email,
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        const requests = await ServiceRequest.find({
            gigOwnerId: user._id,
        })
            .populate("gigId", "title category price name email phone profilePicture")
            .populate("requesterId", "name email profilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Received requests fetched successfully",
            requests,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch received requests",
            error: error.message,
        });
    }
}


// ========================================
// GET ONE REQUEST
// ========================================
async function getOneRequest(req, res) {
    try {
        const user = await userModel.findOne({
            email: req.user.email,
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        const request = await ServiceRequest.findById(req.params.id)
            .populate("gigId", "title category price name email phone profilePicture")
            .populate("requesterId", "name email profilePicture")
            .populate("gigOwnerId", "name email profilePicture");

        if (!request) {
            return res.status(404).json({
                message: "Service request not found",
            });
        }

        // Only requester or gig owner can view
        const isRequester = request.requesterId._id.toString() === user._id.toString();
        const isOwner = request.gigOwnerId._id.toString() === user._id.toString();

        if (!isRequester && !isOwner) {
            return res.status(403).json({
                message: "You are not authorized to view this request",
            });
        }

        res.status(200).json({
            message: "Service request fetched successfully",
            request,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch service request",
            error: error.message,
        });
    }
}


// ========================================
// ACCEPT REQUEST
// ========================================
async function acceptRequest(req, res) {
    try {
        const user = await userModel.findOne({
            email: req.user.email,
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        const request = await ServiceRequest.findById(req.params.id)
            .populate("gigId", "category");

        if (!request) {
            return res.status(404).json({
                message: "Service request not found",
            });
        }

        // Only gig owner can accept
        if (request.gigOwnerId.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to accept this request",
            });
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                message: `Cannot accept a request with status: ${request.status}`,
            });
        }

        request.status = "accepted";
        request.progressStatus = "connected";

        await request.save();

        res.status(200).json({
            message: "Request accepted successfully",
            request,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to accept request",
            error: error.message,
        });
    }
}


// ========================================
// REJECT REQUEST
// ========================================
async function rejectRequest(req, res) {
    try {
        const user = await userModel.findOne({
            email: req.user.email,
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        const request = await ServiceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                message: "Service request not found",
            });
        }

        // Only gig owner can reject
        if (request.gigOwnerId.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to reject this request",
            });
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                message: `Cannot reject a request with status: ${request.status}`,
            });
        }

        request.status = "rejected";

        await request.save();

        res.status(200).json({
            message: "Request rejected successfully",
            request,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to reject request",
            error: error.message,
        });
    }
}


// ========================================
// UPDATE PROGRESS
// ========================================
async function updateProgress(req, res) {
    try {
        const user = await userModel.findOne({
            email: req.user.email,
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        const request = await ServiceRequest.findById(req.params.id)
            .populate("gigId", "category");

        if (!request) {
            return res.status(404).json({
                message: "Service request not found",
            });
        }

        // Only gig owner can update progress
        if (request.gigOwnerId.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to update progress",
            });
        }

        if (request.status !== "accepted") {
            return res.status(400).json({
                message: "Can only update progress for accepted requests",
            });
        }

        const { progressStatus, progressMessage, agreedTime } = req.body;

        if (progressStatus) {
            const category = request.gigId?.category || "";
            const allowedStatuses = PROGRESS_FLOWS[category] || DEFAULT_FLOW;

            if (!allowedStatuses.includes(progressStatus)) {
                return res.status(400).json({
                    message: `Invalid progress status '${progressStatus}' for category '${category}'. Allowed: ${allowedStatuses.join(", ")}`,
                });
            }

            request.progressStatus = progressStatus;

            if (progressStatus === "completed") {
                request.status = "completed";
            }
        }

        if (progressMessage !== undefined) {
            request.progressMessage = progressMessage;
        }

        if (agreedTime !== undefined) {
            request.agreedTime = agreedTime;
        }

        await request.save();

        res.status(200).json({
            message: "Progress updated successfully",
            request,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to update progress",
            error: error.message,
        });
    }
}


// ========================================
// GET REQUEST STATUS FOR A SPECIFIC GIG
// ========================================
async function getRequestStatus(req, res) {
    try {
        const user = await userModel.findOne({
            email: req.user.email,
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        const { gigId } = req.params;

        const request = await ServiceRequest.findOne({
            gigId: gigId,
            requesterId: user._id,
        })
            .populate("gigId", "title category price phone")
            .populate("gigOwnerId", "name email profilePicture")
            .sort({ createdAt: -1 });

        if (!request) {
            return res.status(200).json({
                message: "No request found",
                request: null,
            });
        }

        res.status(200).json({
            message: "Request status fetched",
            request,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch request status",
            error: error.message,
        });
    }
}


module.exports = {
    createRequest,
    cancelRequest,
    getMyRequests,
    getReceivedRequests,
    getOneRequest,
    acceptRequest,
    rejectRequest,
    updateProgress,
    getRequestStatus,
};
