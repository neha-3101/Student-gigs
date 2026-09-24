const express = require('express');

const creategigController = require('../controllers/creategig.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();


// CREATE GIG
router.post(
    "/create",
    authMiddleware.authUser,
    creategigController.createGig
);


// GET ALL GIGS
// Used by Home page
// Shows gigs from ALL users
router.get(
    "/",
    authMiddleware.authUser,
    creategigController.getAllGigs
);


// GET MY GIGS
// Used by My Gigs page
// Shows ONLY logged-in user's gigs
router.get(
    "/my",
    authMiddleware.authUser,
    creategigController.getMyGigs
);


// DELETE GIG
// Only owner can delete because controller checks req.user.email
router.delete(
    "/delete/:id",
    authMiddleware.authUser,
    creategigController.deleteGig
);


// UPDATE GIG
// Only owner can edit because controller checks req.user.email
router.patch(
    "/gig/:id",
    authMiddleware.authUser,
    creategigController.updateGig
);


module.exports = router;