const Booking = require("../models/Booking");

/**
 * ============================================
 * Get Technician's Assigned Bookings
 * ============================================
 */
const getAssignedBookings = async (req, res) => {
    try {

        // Find bookings assigned to the logged-in technician
        const bookings = await Booking.find({
            technician: req.user.id
        })
            .populate("customer", "fullName email phone")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Assigned bookings retrieved successfully.",
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
 * Update Repair Status
 * ============================================
 */
const updateRepairStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Check that a status was provided
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required."
            });
        }

        // Allowed repair statuses
        const allowedStatuses = [
            "In Progress",
            "Awaiting Parts",
            "Completed"
        ];

        // Make sure the status is valid
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid repair status."
            });
        }

        // Find the booking assigned to the logged-in technician
        const booking = await Booking.findOne({
            _id: id,
            technician: req.user.id
        });

        // Booking does not exist or belongs to another technician
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found or not assigned to you."
            });
        }

        // Only Assigned, In Progress, or Awaiting Parts bookings can be updated
        if (
            booking.status !== "Assigned" &&
            booking.status !== "In Progress" &&
            booking.status !== "Awaiting Parts"
        ) {
            return res.status(400).json({
                success: false,
                message: "This booking cannot be updated."
            });
        }

        // Update the repair status
        booking.status = status;

        // Save the booking
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Repair status updated successfully.",
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
 * Update Repair Information
 * ============================================
 */
const updateRepairInformation = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            diagnosis,
            repairNotes,
            partsUsed
        } = req.body;

        // Find the booking assigned to the logged-in technician
        const booking = await Booking.findOne({
            _id: id,
            technician: req.user.id
        });

        // Booking does not exist or belongs to another technician
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found or not assigned to you."
            });
        }

        // Make sure the repair has started
        if (
            booking.status !== "In Progress" &&
            booking.status !== "Completed"
        ) {
            return res.status(400).json({
                success: false,
                message: "Repair information can only be added to an active repair."
            });
        }

        // Update repair information
        if (diagnosis !== undefined) {
            booking.diagnosis = diagnosis;
        }

        if (repairNotes !== undefined) {
            booking.repairNotes = repairNotes;
        }

        if (partsUsed !== undefined) {
            booking.partsUsed = partsUsed;
        }

        // Save changes
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Repair information updated successfully.",
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
    getAssignedBookings,
    updateRepairStatus,
    updateRepairInformation
};