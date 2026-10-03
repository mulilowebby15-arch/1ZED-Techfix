// =========================================
// ADMIN BOOKING DETAILS
// =========================================

// Get authentication data
const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");

// Get booking ID from URL
const urlParams = new URLSearchParams(
    window.location.search
);

const bookingId =
    urlParams.get("id");


// =========================================
// LOAD BOOKING DETAILS
// =========================================

const loadBookingDetails = async () => {

    const bookingDetails =
        document.getElementById(
            "adminBookingDetails"
        );


    // Check booking ID
    if (!bookingId) {

        bookingDetails.innerHTML = `
            <div class="empty-bookings">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Booking not found
                </h3>

                <p>
                    No booking ID was provided.
                </p>

            </div>
        `;

        return;
    }


    try {

        const response = await fetch(
            "http://localhost:5000/api/admin/bookings",
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        // Handle failed request
        if (!response.ok) {

            bookingDetails.innerHTML = `
                <div class="empty-bookings">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h3>
                        Unable to load booking
                    </h3>

                    <p>
                        ${data.message || "Please try again later."}
                    </p>

                </div>
            `;

            return;
        }


        const booking =
            data.bookings.find(
                (item) => item._id === bookingId
            );


        if (!booking) {

            bookingDetails.innerHTML = `
                <div class="empty-bookings">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h3>
                        Booking not found
                    </h3>

                    <p>
                        The selected booking could not be found.
                    </p>

                </div>
            `;

            return;
        }


        // Format date
        const bookingDate =
            new Date(
                booking.preferredDate
            ).toLocaleDateString();


        // =====================================
        // CUSTOMER INFORMATION
        // =====================================

        let customerSection = "";

        if (booking.customer) {

            customerSection = `
                <div class="booking-detail-card">

                    <h3>
                        👤 Customer Information
                    </h3>

                    <p>
                        <strong>Name:</strong>
                        ${booking.customer.fullName}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${booking.customer.email}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${booking.customer.phone}
                    </p>

                </div>
            `;

        }


        // =====================================
        // TECHNICIAN INFORMATION
        // =====================================

        let technicianSection = "";

        if (booking.technician) {

            technicianSection = `
                <div class="booking-detail-card">

                    <h3>
                        👨‍🔧 Technician
                    </h3>

                    <p>
                        <strong>Name:</strong>
                        ${booking.technician.fullName}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${booking.technician.email}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${booking.technician.phone}
                    </p>

                </div>
            `;

        } else {

            technicianSection = `
                <div class="booking-detail-card">

                    <h3>
                        👨‍🔧 Technician
                    </h3>

                    <p>
                        No technician has been assigned yet.
                    </p>

                </div>
            `;

        }


        // =====================================
        // SERVICE LOCATION
        // =====================================

        let locationText = "";

        if (
            booking.repairMode ===
            "On-site Repair"
        ) {

            locationText =
                booking.serviceAddress ||
                "No service address provided.";

        } else if (
            booking.repairMode ===
            "Drop-off Repair"
        ) {

            locationText =
                "Customer will drop off the device.";

        } else if (
            booking.repairMode ===
            "Remote Support"
        ) {

            locationText =
                "Remote support.";

        }


        // =====================================
        // PHOTOS
        // =====================================

        let photosSection = "";

        if (
            booking.photos &&
            booking.photos.length > 0
        ) {

            photosSection = `
                <div class="booking-detail-card">

                    <h3>
                        📷 Device Photos
                    </h3>

                    <div class="booking-photos">

                        ${booking.photos.map((photo) => `
                            <img
                                src="${photo}"
                                alt="Device photo"
                                class="booking-photo"
                            >
                        `).join("")}

                    </div>

                </div>
            `;

        }


        // =====================================
        // REPAIR INFORMATION
        // =====================================

        let repairSection = "";

        if (
            booking.diagnosis ||
            booking.repairNotes ||
            booking.partsUsed
        ) {

            repairSection = `
                <div class="booking-detail-card">

                    <h3>
                        🔧 Repair Information
                    </h3>

                    <p>
                        <strong>Diagnosis:</strong>
                        ${booking.diagnosis || "Not provided"}
                    </p>

                    <p>
                        <strong>Repair Notes:</strong>
                        ${booking.repairNotes || "Not provided"}
                    </p>

                    <p>
                        <strong>Parts Used:</strong>
                        ${booking.partsUsed || "None recorded"}
                    </p>

                </div>
            `;

        }


        // =====================================
        // DISPLAY DETAILS
        // =====================================

        bookingDetails.innerHTML = `

            <div class="booking-detail-card">

                <h2>
                    ${booking.deviceBrand}
                    ${booking.deviceType}
                </h2>

                <span
                    class="booking-status status-${booking.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}"
                >
                    ${booking.status}
                </span>

            </div>


            ${customerSection}


            <div class="booking-detail-card">

                <h3>
                    💻 Device & Problem
                </h3>

                <p>
                    <strong>Device Type:</strong>
                    ${booking.deviceType}
                </p>

                <p>
                    <strong>Brand:</strong>
                    ${booking.deviceBrand}
                </p>

                <p>
                    <strong>Problem:</strong>
                    ${booking.problemDescription}
                </p>

            </div>


            <div class="booking-detail-card">

                <h3>
                    📅 Appointment Information
                </h3>

                <p>
                    <strong>Preferred Date:</strong>
                    ${bookingDate}
                </p>

                <p>
                    <strong>Preferred Time:</strong>
                    ${booking.preferredTime}
                </p>

                <p>
                    <strong>Repair Mode:</strong>
                    ${booking.repairMode}
                </p>

                <p>
                    <strong>Service Location:</strong>
                    ${locationText}
                </p>

            </div>


            ${technicianSection}


            ${photosSection}


            ${repairSection}

        `;

    } catch (error) {

        console.error(
            "Admin booking details error:",
            error
        );


        bookingDetails.innerHTML = `
            <div class="empty-bookings">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Connection Error
                </h3>

                <p>
                    Unable to connect to the server.
                    Please make sure the backend is running.
                </p>

            </div>
        `;

    }

};


// =========================================
// PROTECT PAGE
// =========================================

if (!token || !userData) {

    window.location.href =
        "login.html";

} else {

    const user =
        JSON.parse(userData);


    // Only admins can access this page
    if (user.role !== "admin") {

        window.location.href =
            "login.html";

    } else {

        loadBookingDetails();

    }

}