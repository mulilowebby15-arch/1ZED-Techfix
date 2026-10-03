const Booking = require("../models/Booking");
const User = require("../models/User");

/**
 * ============================================
 * Assign Technician to Booking
 * ============================================
 */
const assignTechnician = async (req, res) => {
    try {
        const { bookingId, technicianId } = req.body;

        // Check that both IDs were provided
        if (!bookingId || !technicianId) {
            return res.status(400).json({
                success: false,
                message: "Booking ID and technician ID are required."
            });
        }

        // Find the booking
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        // Find the selected technician
        const technician = await User.findById(technicianId);

        if (!technician) {
            return res.status(404).json({
                success: false,
                message: "Technician not found."
            });
        }

        // Make sure the selected user is actually a technician
        if (technician.role !== "technician") {
            return res.status(400).json({
                success: false,
                message: "Selected user is not a technician."
            });
        }

        // Assign the technician to the booking
        booking.technician = technicianId;

        // Update the booking status
        booking.status = "Assigned";

        // Save the changes
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Technician assigned successfully.",
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

// ============================================
// UPDATE BOOKING STATUS
// ============================================

const updateBookingStatus = async (req, res) => {

    try {

        const {
            bookingId,
            status,
            cancellationReason
        } = req.body;


        // Check required fields

        if (!bookingId || !status) {

            return res.status(400).json({
                success: false,
                message: "Booking ID and status are required."
            });

        }


        // Allowed booking statuses

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Assigned",
            "In Progress",
            "Awaiting Parts",
            "Completed",
            "Cancelled"
        ];


        // Validate status

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid booking status."
            });

        }


        // Find and update booking status

        const booking =
            await Booking.findByIdAndUpdate(
                bookingId,
                {
                    status: status,
                    ...(status === "Cancelled" && cancellationReason
                        ? { cancellationReason: cancellationReason }
                        : {})
                },
                {
                    returnDocument: "after",
                    runValidators: true
                }
            );


        if (!booking) {

            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });

        }


        res.status(200).json({
            success: true,
            message: "Booking status updated successfully.",
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
 * Get All Bookings
 * ============================================
 */
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("customer", "fullName email phone")
            .populate("technician", "fullName email phone")
            .sort({ createdAt: -1 });

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
  * Get All Technicians
  * ============================================
  */
const getAllTechnicians = async (req, res) => {
    try {
        const technicians = await User.find({
            role: "technician"
        }).select("fullName email phone");

        res.status(200).json({
            success: true,
            message: "Technicians retrieved successfully.",
            technicians
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
 * Get Admin Dashboard Summary
 * ============================================
 */
const getAdminSummary = async (req, res) => {
    try {

        const totalBookings =
            await Booking.countDocuments();

        const totalTechnicians =
            await User.countDocuments({
                role: "technician"
            });

        const totalCustomers =
            await User.countDocuments({
                role: "customer"
            });

        res.status(200).json({
            success: true,
            totalBookings,
            totalTechnicians,
            totalCustomers
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
    assignTechnician,
    updateBookingStatus,
    getAllBookings,
    getAllTechnicians,
    getAdminSummary
};