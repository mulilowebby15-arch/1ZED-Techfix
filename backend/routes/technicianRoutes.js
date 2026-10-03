const express = require("express");
const router = express.Router();

const {
    getAssignedBookings,
    updateRepairStatus,
    updateRepairInformation
} = require("../controllers/technicianController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/**
 * ============================================
 * Technician Routes
 * ============================================
 */

// Get bookings assigned to the logged-in technician
router.get(
    "/bookings",
    authMiddleware,
    authorizeRoles("technician"),
    getAssignedBookings
);

// Update the status of an assigned booking
router.put(
    "/bookings/:id/status",
    authMiddleware,
    authorizeRoles("technician"),
    updateRepairStatus
);

// Update repair information
router.put(
    "/bookings/:id/repair",
    authMiddleware,
    authorizeRoles("technician"),
    updateRepairInformation
);

module.exports = router;