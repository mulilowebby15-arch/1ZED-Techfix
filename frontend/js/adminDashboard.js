// =========================================
// ADMIN DASHBOARD
// =========================================

// Authentication
const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");

// Store available technicians
let technicians = [];


// =========================================
// LOAD TECHNICIANS
// =========================================

const loadTechnicians = async () => {

    try {

        const response = await fetch(
            "http://localhost:5000/api/admin/technicians",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "Unable to load technicians:",
                data.message
            );

            return;
        }

        technicians = data.technicians || [];

    } catch (error) {

        console.error(
            "Technicians error:",
            error
        );

    }

};


// =========================================
// LOAD ADMIN SUMMARY
// =========================================

const loadAdminSummary = async () => {

    try {

        const response = await fetch(
            "http://localhost:5000/api/admin/summary",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "Unable to load admin summary:",
                data.message
            );

            return;
        }

        document.getElementById("totalBookings").textContent =
            data.totalBookings;

        document.getElementById("totalTechnicians").textContent =
            data.totalTechnicians;

        document.getElementById("totalCustomers").textContent =
            data.totalCustomers;

    } catch (error) {

        console.error(
            "Admin summary error:",
            error
        );

    }

};


// =========================================
// CONFIRM BOOKING
// =========================================

const confirmBooking = async (bookingId) => {

    try {

        const response = await fetch(
            "http://localhost:5000/api/admin/booking-status",
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    bookingId,
                    status: "Confirmed"
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to confirm booking."
            );

            return;
        }

        alert(
            "Booking confirmed successfully."
        );

        loadAdminBookings();

    } catch (error) {

        console.error(
            "Confirm booking error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

    }

};


// =========================================
// REJECT BOOKING
// =========================================

const rejectBooking = async (bookingId) => {

    const confirmed = confirm(
        "Are you sure you want to reject this booking?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/admin/booking-status",
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    bookingId,
                    status: "Cancelled",
                    cancellationReason: "Admin Rejected"
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to reject booking."
            );

            return;
        }

        alert(
            "Booking rejected successfully."
        );

        loadAdminBookings();

    } catch (error) {

        console.error(
            "Reject booking error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

    }

};


// =========================================
// ASSIGN TECHNICIAN
// =========================================

const assignTechnician = async (
    bookingId,
    technicianId
) => {

    try {

        const response = await fetch(
            "http://localhost:5000/api/admin/assign-technician",
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    bookingId,
                    technicianId
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to assign technician."
            );

            return;
        }

        alert(
            "Technician assigned successfully."
        );

        loadAdminBookings();

    } catch (error) {

        console.error(
            "Assign technician error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

    }

};


// =========================================
// LOAD ADMIN BOOKINGS
// =========================================

const loadAdminBookings = async () => {

    const adminBookings =
        document.getElementById("adminBookings");

    try {

        const response = await fetch(
            "http://localhost:5000/api/admin/bookings",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();


        // =====================================
        // REQUEST ERROR
        // =====================================

        if (!response.ok) {

            adminBookings.innerHTML = `
                <div class="empty-bookings">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h3>
                        Unable to load bookings
                    </h3>

                    <p>
                        ${data.message || "Please try again later."}
                    </p>

                </div>
            `;

            return;
        }


        // =====================================
        // NO BOOKINGS
        // =====================================

        if (!data.bookings || data.bookings.length === 0) {

            adminBookings.innerHTML = `
                <div class="empty-bookings">

                    <div class="empty-icon">
                        📋
                    </div>

                    <h3>
                        No bookings found
                    </h3>

                    <p>
                        There are currently no repair bookings.
                    </p>

                </div>
            `;

            return;
        }


        // =====================================
        // DISPLAY BOOKINGS
        // =====================================

        adminBookings.innerHTML = "";


        data.bookings.forEach((booking) => {

            const bookingCard =
                document.createElement("div");

            bookingCard.className =
                "booking-item";


            const bookingDate =
                new Date(
                    booking.preferredDate
                ).toLocaleDateString();


            // =================================
            // TECHNICIAN SECTION
            // =================================

            let technicianSection = "";


            if (booking.technician) {

                technicianSection = `
                    <small>
                        👨‍🔧 Assigned to:
                        ${booking.technician.fullName}
                    </small>
                `;

            } else if (technicians.length > 0) {

                technicianSection = `
                    <div class="admin-assignment">

                        <label>
                            Assign Technician
                        </label>

                        <select
                            class="technician-select"
                        >

                            <option value="">
                                Select Technician
                            </option>

                            ${technicians.map((technician) => `
                                <option value="${technician._id}">
                                    ${technician.fullName}
                                </option>
                            `).join("")}

                        </select>

                        <button
                            type="button"
                            class="btn btn-primary assign-technician-button"
                        >
                            Assign
                        </button>

                    </div>
                `;

            } else {

                technicianSection = `
                    <small>
                        👨‍🔧 No technicians available.
                    </small>
                `;

            }


            // =================================
            // BOOKING CARD
            // =================================

            bookingCard.innerHTML = `
                <div class="booking-item-info">

                    <h3>
                        ${booking.deviceBrand}
                        ${booking.deviceType}
                    </h3>

                    <p>
                        ${booking.problemDescription}
                    </p>

                    <small>
                        📅 ${bookingDate}
                        &nbsp; | &nbsp;
                        🕒 ${booking.preferredTime}
                    </small>

                    <small>
                        🔧 ${booking.repairMode}
                    </small>

                    ${technicianSection}

                </div>


                <div class="admin-booking-actions">

                    ${
                        booking.status === "Pending"
                            ? `
                                <button
                                    type="button"
                                    class="btn btn-primary confirm-booking-button"
                                >
                                    Confirm Booking
                                </button>

                                <button
                                    type="button"
                                    class="btn btn-secondary reject-booking-button"
                                >
                                    Reject Booking
                                </button>
                            `
                            : ""
                    }


                    <button
                        type="button"
                        class="btn btn-primary admin-view-booking-button"
                    >
                        View Details
                    </button>

                </div>
            `;


            // =================================
            // ASSIGN TECHNICIAN EVENT
            // =================================

            const assignButton =
                bookingCard.querySelector(
                    ".assign-technician-button"
                );


            if (assignButton) {

                assignButton.addEventListener(
                    "click",
                    () => {

                        const select =
                            bookingCard.querySelector(
                                ".technician-select"
                            );

                        const technicianId =
                            select.value;


                        if (!technicianId) {

                            alert(
                                "Please select a technician first."
                            );

                            return;
                        }


                        assignTechnician(
                            booking._id,
                            technicianId
                        );

                    }
                );

            }


            // =================================
            // CONFIRM BOOKING EVENT
            // =================================

            const confirmButton =
                bookingCard.querySelector(
                    ".confirm-booking-button"
                );


            if (confirmButton) {

                confirmButton.addEventListener(
                    "click",
                    () => {

                        confirmBooking(
                            booking._id
                        );

                    }
                );

            }


            // =================================
            // REJECT BOOKING EVENT
            // =================================

            const rejectButton =
                bookingCard.querySelector(
                    ".reject-booking-button"
                );


            if (rejectButton) {

                rejectButton.addEventListener(
                    "click",
                    () => {

                        rejectBooking(
                            booking._id
                        );

                    }
                );

            }


            // =================================
            // VIEW BOOKING DETAILS
            // =================================

            const viewBookingButton =
                bookingCard.querySelector(
                    ".admin-view-booking-button"
                );


            if (viewBookingButton) {

                viewBookingButton.addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            `admin-booking-details.html?id=${booking._id}`;

                    }
                );

            }


            adminBookings.appendChild(
                bookingCard
            );

        });


    } catch (error) {

        console.error(
            "Admin bookings error:",
            error
        );


        adminBookings.innerHTML = `
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

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href =
                "login.html";

        }
    );

}


// =========================================
// PROTECT ADMIN PAGE
// =========================================

if (!token || !userData) {

    window.location.href =
        "login.html";

} else {

    const user =
        JSON.parse(userData);


    if (user.role !== "admin") {

        window.location.href =
            "login.html";

    } else {

        const adminName =
            document.getElementById("adminName");


        if (adminName) {

            adminName.textContent =
                user.fullName || "Admin";

        }


        // =================================
        // INITIALIZE DASHBOARD
        // =================================

        const initializeDashboard = async () => {

            await loadAdminSummary();

            await loadTechnicians();

            await loadAdminBookings();

        };


        initializeDashboard();

    }

}