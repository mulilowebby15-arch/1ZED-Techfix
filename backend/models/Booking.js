const mongoose = require("mongoose");

/**
 * ============================================
 * Booking Schema
 * ============================================
 */

const bookingSchema = new mongoose.Schema(
    {
        // Customer who created the booking
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Type of device
        deviceType: {
            type: String,
            required: true,
            trim: true
        },

        // Brand of the device
        deviceBrand: {
            type: String,
            required: true,
            trim: true
        },

        // Description of the device problem
        problemDescription: {
            type: String,
            required: true,
            trim: true
        },

        // customer's repair mode
        repairMode: {
            type: String,
            enum: [
                "On-site Repair",
                "Drop-off Repair",
                "Remote Support"
            ],
            required: true
        },

        // service address
        serviceAddress: {
            type: String,
            default: ""
        },

        // Customer's preferred repair date
        preferredDate: {
            type: Date,
            required: true
        },

        // Customer's preferred repair time
        preferredTime: {
            type: String,
            required: true,
            trim: true
        },

        // Current booking status
        status: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Assigned",
                "In Progress",
                "Awaiting Parts",
                "Completed",
                "Cancelled"
            ],
            default: "Pending"
        },


        // Reason why the booking was cancelled
        cancellationReason: {
            type: String,
            enum: [
                "Customer Cancelled",
                "Admin Rejected"
            ],
            default: null
        },

        // Technician assigned to the booking
        technician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        // customer conceal/hide booking
        hiddenFromCustomer: {
            type: Boolean,
            default: false
        },

        // Photos of the faulty device
        photos: {
            type: [String],
            default: []
        },

        // Repair information
        diagnosis: {
            type: String,
            default: ""
        },
        
         repairNotes: {
            type: String,
            default: ""
        },

        partsUsed: {
            type: String,
            default: ""
        }
         


    },

    {
        timestamps: true
    }
);

/**
 * ============================================
 * Export Booking Model
 * ============================================
 */

module.exports = mongoose.model("Booking", bookingSchema);