const uploadToCloudinary = require("../utils/uploadToCloudinary");
const Booking = require("../models/Booking");

/**
 * ============================================
 * Create a New Booking
 * ============================================
 */

const createBooking = async (req, res) => {
    try {
        const {
            deviceType,
            deviceBrand,
            problemDescription,
            repairMode,
            serviceAddress,
            preferredDate,
            preferredTime
        } = req.body;

        // Upload device photos to Cloudinary
        const photoUrls = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer);
                photoUrls.push(result.secure_url);
            }
        }

        // Create the booking
        const newBooking = new Booking({
            customer: req.user.id,
            deviceType,
            deviceBrand,
            problemDescription,
            repairMode,
            serviceAddress,
            preferredDate,
            preferredTime,
            photos: photoUrls
        });

        // Save the booking to MongoDB
        await newBooking.save();

        res.status(201).json({
            success: true,
            message: "Booking created successfully.",
            booking: newBooking
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
 * Get Logged-in Customer's Bookings
 * ============================================
 */
const getMyBookings = async (req, res) => {
    try {

        // Find bookings belonging to the logged-in customer
        const bookings = await Booking.find({
            customer: req.user.id, 
            hiddenFromCustomer: false
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully.",
            bookings
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
 * Get One Booking by ID
 * ============================================
 */
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the booking and make sure it belongs
        // to the logged-in customer
        const booking = await Booking.findOne({
            _id: id,
            
            customer: req.user.id
        }).populate("technician", "fullName email phone");

        // Booking not found or does not belong to customer
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Booking retrieved successfully.",
            booking
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
 * Cancel a Booking
 * ============================================
 */
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the booking belonging to the logged-in customer
        const booking = await Booking.findOne({
            _id: id,
            customer: req.user.id
        });

        // Booking does not exist or belongs to another customer
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        // Only Pending bookings can be cancelled
        if (booking.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending bookings can be cancelled."
            });
        }

        // Change the booking status
        booking.status = "Cancelled";

        // Record that the customer cancelled the booking
        booking.cancellationReason = "Customer Cancelled";

        // Save the updated booking
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully.",
            booking
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

const hideBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findOne({
            _id: id,
            customer: req.user.id
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        if (booking.technician) {
            return res.status(400).json({
                success: false,
                message: "Only unassigned bookings can be hidden."
            });
        }

        booking.hiddenFromCustomer = true;

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking hidden successfully.",
            booking
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
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    hideBooking
};

