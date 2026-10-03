const express = require("express");
const router = express.Router();

const {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    hideBooking
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

/**
 * ============================================
 * Booking Routes
 * ============================================
 */

// Create a new booking
router.post(
    "/",
    authMiddleware,
    upload.array("photos", 5),
    createBooking
);

// Get bookings belonging to the logged-in customer
router.get("/my-bookings", authMiddleware, getMyBookings);

router.patch(
    "/:id/hide",
    authMiddleware,
    hideBooking
);

// Get one booking by ID
router.get("/:id", authMiddleware, getBookingById);

// Cancel a pending booking
router.delete("/:id", authMiddleware, cancelBooking);

module.exports = router;