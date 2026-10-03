const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

/*
==============================================
User Registration Route
POST: /api/users/register
==============================================
*/

router.post("/register", registerUser);

router.post("/login", loginUser);

// Get Logged-in User
router.get("/profile", authMiddleware, (req, res) => {

    res.status(200).json({
        success: true,
        message: "Protected route accessed successfully.",
        user: req.user
    });

});

module.exports = router;