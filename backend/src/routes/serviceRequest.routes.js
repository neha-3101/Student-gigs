const express = require("express");

const serviceRequestController = require("../controllers/serviceRequest.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();


// CREATE SERVICE REQUEST
router.post(
    "/",
    authMiddleware.authUser,
    serviceRequestController.createRequest
);


// CANCEL SERVICE REQUEST BY GIG ID
router.patch(
    "/gig/:gigId/cancel",
    authMiddleware.authUser,
    serviceRequestController.cancelRequest
);


// CANCEL SERVICE REQUEST BY ID
router.patch(
    "/:id/cancel",
    authMiddleware.authUser,
    serviceRequestController.cancelRequest
);


// GET MY REQUESTS (as requester)
router.get(
    "/my",
    authMiddleware.authUser,
    serviceRequestController.getMyRequests
);


// GET RECEIVED REQUESTS (as gig owner)
router.get(
    "/received",
    authMiddleware.authUser,
    serviceRequestController.getReceivedRequests
);


// GET REQUEST STATUS FOR A SPECIFIC GIG
router.get(
    "/gig/:gigId/status",
    authMiddleware.authUser,
    serviceRequestController.getRequestStatus
);


// ACCEPT REQUEST
router.patch(
    "/:id/accept",
    authMiddleware.authUser,
    serviceRequestController.acceptRequest
);


// REJECT REQUEST
router.patch(
    "/:id/reject",
    authMiddleware.authUser,
    serviceRequestController.rejectRequest
);


// UPDATE PROGRESS
router.patch(
    "/:id/progress",
    authMiddleware.authUser,
    serviceRequestController.updateProgress
);


// GET ONE REQUEST
router.get(
    "/:id",
    authMiddleware.authUser,
    serviceRequestController.getOneRequest
);


module.exports = router;
