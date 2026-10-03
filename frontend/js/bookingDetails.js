// =========================================
// BOOKING DETAILS PAGE
// =========================================

// Get authentication data
const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");

// Get booking ID from URL
const urlParams = new URLSearchParams(window.location.search);
const bookingId = urlParams.get("id");


// =========================================
// LOAD BOOKING DETAILS
// =========================================

const loadBookingDetails = async () => {
    const bookingDetails = document.getElementById("bookingDetails");

    try {
        const response = await fetch(
            `http://localhost:5000/api/bookings/${bookingId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            bookingDetails.innerHTML = `
                <div class="empty-bookings">
                    <div class="empty-icon">⚠️</div>
                    <h3>Unable to load booking</h3>
                    <p>${data.message || "Booking could not be found."}</p>
                </div>
            `;
            return;
        }

        const booking = data.booking;

        const bookingDate = new Date(
            booking.preferredDate
        ).toLocaleDateString();

       // =========================================
       // DISPLAY BOOKING DETAILS
       // =========================================

        bookingDetails.innerHTML = `

            <!-- Booking Information -->

            <div class="booking-item">

                 <div class="booking-item-info">

                    <h3>
                        ${booking.deviceBrand} ${booking.deviceType}
                    </h3>

                    <p>
                        <strong>Problem:</strong>
                        ${booking.problemDescription}
                    </p>

                    <small>
                        📅 <strong>Preferred Date:</strong>
                        ${bookingDate}
                    </small>

                    <small>
                        🕒 <strong>Preferred Time:</strong>
                        ${booking.preferredTime}
                    </small>

                    <small>
                        🔧 <strong>Repair Mode:</strong>
                        ${booking.repairMode}
                    </small>

                </div>

                <div class="booking-item-status">

                    <span class="booking-status status-${booking.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}">
                        ${booking.status}
                    </span>

                </div>

            </div>


            <!-- Service Location -->

            <div class="dashboard-section">

                <div class="dashboard-section-heading">
                    <div>

                        <span class="dashboard-badge">
                            Service Location
                        </span>

                        <h2>
                            Where the Repair Will Take Place
                        </h2>

                    </div>
                </div>

                ${
                    booking.repairMode === "On-site Repair"
                        ? `
                            <p>
                                📍 <strong>Service Address:</strong>
                                ${booking.serviceAddress || "Address not provided."}
                            </p>
                        `
                        : booking.repairMode === "Drop-off Repair"
                            ? `
                                <p>
                                    🏢 <strong>Service Centre:</strong>
                                    Drop-off repair at the 1ZED TechFix service centre.
                                </p>
                            `
                            : `
                                <p>
                                    💻 <strong>Remote Support:</strong>
                                    This repair will be handled remotely.
                                </p>
                            `
                } 
            </div>


            <!-- Technician Information -->

            <div class="dashboard-section">

                <div class="dashboard-section-heading">
                    <div>

                        <span class="dashboard-badge">
                            Technician
                        </span>

                        <h2>
                            Assigned Technician
                        </h2>

                    </div>
                </div>

                ${
                    booking.technician
                        ? `
                            <p>
                                👨‍🔧 <strong>Name:</strong>
                                ${booking.technician.fullName}
                            </p>

                            <p>
                                📧 <strong>Email:</strong>
                                ${booking.technician.email}
                            </p>

                            ${
                                booking.technician.phone
                                    ? `
                                        <p>
                                            📞 <strong>Phone:</strong>
                                            ${booking.technician.phone}
                                        </p>
                                    `
                                    : ""
                            }
                        `
                        : `
                            <p>
                                👨‍🔧 No technician has been assigned yet.
                            </p>

                            <p>
                                You will see the technician's information here
                                once your booking has been assigned.
                            </p>
                        `
                }

            </div>


            <!-- Device Photos -->

            <div class="dashboard-section">

                <div class="dashboard-section-heading">
                    <div>

                        <span class="dashboard-badge">
                            Device Photos
                        </span>

                        <h2>
                            Uploaded Photos
                        </h2>

                    </div>
                </div>

                ${
                    booking.photos && booking.photos.length > 0
                        ? `
                            <div>

                                ${booking.photos
                                    .map(
                                        (photo) => `
                                            <img
                                                src="${photo}"
                                                alt="Device photo"
                                                style="
                                                    width: 180px;
                                                    height: 140px;
                                                    object-fit: cover;
                                                    border-radius: 12px;
                                                    margin: 8px;
                                                "
                                            >
                                        `
                                    )
                                    .join("")}

                            </div>
                        `
                        : `
                             <p>
                                📷 No device photos were uploaded with this booking.
                            </p>
                        `
                }

            </div>


            <!-- Repair Information -->

            <div class="dashboard-section">

                <div class="dashboard-section-heading">
                    <div>

                        <span class="dashboard-badge">
                            Repair Information
                        </span>

                        <h2>
                            Technician Report
                        </h2>

                    </div>
                </div>

                ${
                    booking.diagnosis ||
                    booking.repairNotes ||
                    booking.partsUsed
                        ? `
                            ${
                                booking.diagnosis
                                    ? `
                                        <p>
                                            🔍 <strong>Diagnosis:</strong>
                                            ${booking.diagnosis}
                                        </p>
                                    `
                                    : ""
                            }

                       
                            ${
                                booking.repairNotes
                                    ? `
                                        <p>
                                            📝 <strong>Repair Notes:</strong>
                                            ${booking.repairNotes}
                                        </p>
                                    `
                                    : ""
                            }

                            ${
                                booking.partsUsed
                                    ? `
                                        <p>
                                            🔩 <strong>Parts Used:</strong>
                                            ${booking.partsUsed}
                                        </p>
                                    `
                                    : ""
                            }
                        `
                        : `
                            <p>
                                🛠️ No repair report is available yet.
                            </p>

                            <p>
                                The diagnosis, repair notes, and parts used
                                will appear here once the technician works on
                                your device.
                            </p>
                        `
                }

            </div>

        `;

    } catch (error) {

        console.error("Load booking error:", error);

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
// LOGOUT
// =========================================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
    });
}


// =========================================
// PROTECT PAGE
// =========================================

if (!token || !userData) {

    window.location.href = "login.html";

} else {

    const user = JSON.parse(userData);

    if (user.role !== "customer") {

        window.location.href = "login.html";

    } else if (!bookingId) {

        document.getElementById("bookingDetails").innerHTML = `
            <div class="empty-bookings">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Booking Not Found
                </h3>

                <p>
                    No booking ID was provided.
                </p>

            </div>
        `;

    } else {

        loadBookingDetails();
    }
}