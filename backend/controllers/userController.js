const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * ============================================
 * Register a New User
 * ============================================
 */
const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists."
            });
        }

        // Encrypt the user's password
const hashedPassword = await bcrypt.hash(password, 10);

// Create a new user
const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
    phone
});

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error."
        });

    }
};

/**
 * ============================================
 * Login User
 * ============================================
 */
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: existingUser._id,
                role: existingUser.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: existingUser._id,
                fullName: existingUser.fullName,
                email: existingUser.email,
                role: existingUser.role
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error."
        });

    }
};

module.exports = {
    registerUser,
    loginUser
};

