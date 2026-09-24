const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const uploadMiddleware=require("../middleware/upload.middleware");

const router = express.Router();

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.get("/me", authMiddleware.authUser, authController.getMe);

router.post(
    "/upload/profile",
    authMiddleware.authUser,
    uploadMiddleware.single("profilePicture"),
    authController.profile
);

router.delete('/delete/profile',authMiddleware.authUser,authController.removeProfile)
router.delete('/logout',authMiddleware.authUser,authController.logoutUser)

module.exports = router;