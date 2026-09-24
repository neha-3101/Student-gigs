const gigModel = require("../models/creategig.model");
const userModel = require("../models/auth.model");


// ========================================
// CREATE GIG
// ========================================
async function createGig(req, res) {
    try {
        const {
            title,
            price,
            description,
            category,
            phone
        } = req.body;

        // Find currently logged-in user
        const user = await userModel.findOne({
            email: req.user.email
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Create gig
        const gig = await gigModel.create({
            title,
            price,
            description,
            category,

            // Take these from logged-in user
            name: user.name,
            email: user.email,

            phone,

            profilePicture: user.profilePicture
        });

        res.status(201).json({
            message: "Gig created successfully",

            gig: {
                _id: gig._id,
                title: gig.title,
                price: gig.price,
                description: gig.description,
                category: gig.category,
                name: gig.name,
                email: gig.email,
                phone: gig.phone,
                profilePicture: gig.profilePicture
            }
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to create gig",
            error: error.message
        });
    }
}


// ========================================
// GET ALL GIGS
// ========================================
// Used by HOME PAGE
// Shows gigs created by ALL users
// ========================================
async function getAllGigs(req, res) {
    try {

        const gigs = await gigModel.find();

        res.status(200).json({
            message: "All gigs fetched successfully",
            gigs: gigs
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch gigs",
            error: error.message
        });
    }
}


// ========================================
// GET MY GIGS
// ========================================
// Used by MY GIGS PAGE
// Shows ONLY logged-in user's gigs
// ========================================
async function getMyGigs(req, res) {
    try {

        const gigs = await gigModel.find({
            email: req.user.email
        });

        res.status(200).json({
            message: "My gigs fetched successfully",
            gigs: gigs
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch my gigs",
            error: error.message
        });
    }
}


// ========================================
// DELETE GIG
// ========================================
// User can delete ONLY their own gig
// ========================================
async function deleteGig(req, res) {
    try {

        const id = req.params.id;

        const deletedGig = await gigModel.findOneAndDelete({
            _id: id,
            email: req.user.email
        });

        if (!deletedGig) {
            return res.status(403).json({
                message: "You are not authorized to delete this gig"
            });
        }

        res.status(200).json({
            message: "Gig deleted successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to delete gig",
            error: error.message
        });
    }
}


// ========================================
// UPDATE GIG
// ========================================
// User can update ONLY their own gig
// ========================================
async function updateGig(req, res) {
    try {

        const id = req.params.id;

        const {
            title,
            price,
            description,
            category,
            phone
        } = req.body;

        const updatedGig = await gigModel.findOneAndUpdate(
            {
                _id: id,
                email: req.user.email
            },
            {
                title,
                price,
                description,
                category,
                phone
            },
            {
                new: true
            }
        );

        if (!updatedGig) {
            return res.status(403).json({
                message: "You are not authorized to edit this gig"
            });
        }

        res.status(200).json({
            message: "Gig updated successfully",
            gig: updatedGig
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error updating gig",
            error: error.message
        });
    }
}


module.exports = {
    createGig,
    getAllGigs,
    getMyGigs,
    deleteGig,
    updateGig
};