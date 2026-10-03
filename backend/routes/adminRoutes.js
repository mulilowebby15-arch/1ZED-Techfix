const express = require("express");
const router = express.Router();

const {
    assignTechnician,
    updateBookingStatus,
    getAllBookings,
    getAllTechnicians,
    getAdminSummary
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/**
 * ============================================
 * Admin Routes
 * ============================================
 */

// Get admin dashboard summary
router.get(
    "/summary",
    authMiddleware,
    authorizeRoles("admin"),
    getAdminSummary
);

// Get all bookings
router.get(
    "/bookings",
    authMiddleware,
    authorizeRoles("admin"),
    getAllBookings
);

// Get all technicians
router.get(
    "/technicians",
    authMiddleware,
    authorizeRoles("admin"),
    getAllTechnicians
);

// Assign a technician to a booking
router.put(
    "/assign-technician",
    authMiddleware,
    authorizeRoles("admin"),
    assignTechnician
);

// Update booking status
router.put(
    "/booking-status",
    authMiddleware,
    authorizeRoles("admin"),
    updateBookingStatus
);

module.exports = router;