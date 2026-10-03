// =========================================
// CUSTOMER DASHBOARD
// =========================================

// Get authentication data
const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");


// =========================================
// LOAD CUSTOMER BOOKINGS
// =========================================

const loadRecentBookings = async () => {

    const recentBookings =
        document.getElementById("recentBookings");

    try {

        const response = await fetch(
            "http://localhost:5000/api/bookings/my-bookings",
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        // Handle failed request
        if (!response.ok) {

            recentBookings.innerHTML = `
                <div class="empty-bookings">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h3>Unable to load bookings</h3>

                    <p>
                        ${data.message || "Please try again later."}
                    </p>

                </div>
            `;

            return;
        }


        // Check if customer has no bookings
        if (!data.bookings || data.bookings.length === 0) {

            recentBookings.innerHTML = `
                <div class="empty-bookings">

                    <div class="empty-icon">
                        📋
                    </div>

                    <h3>No bookings yet</h3>

                    <p>
                        Your repair bookings will appear here.
                    </p>

                </div>
            `;

            return;
        }


        // =====================================
        // DISPLAY BOOKINGS
        // =====================================

        recentBookings.innerHTML = "";

        // Show latest bookings first
        const bookings =
            data.bookings.slice(0, 5);


        bookings.forEach((booking) => {

            const bookingCard =
                document.createElement("div");

            bookingCard.className =
                "booking-item";


            // Format date
            const bookingDate =
                new Date(
                    booking.preferredDate
                ).toLocaleDateString();


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

                </div>

                <div class="booking-item-status">

                    <span class="booking-status status-${booking.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}">
                        ${
                            booking.status === "Cancelled" &&
                            booking.cancellationReason === "Admin Rejected"
                                ? "Booking Rejected"
                                : booking.status === "Cancelled" &&
                                  booking.cancellationReason === "Customer Cancelled"
                                    ? "Booking Cancelled"
                                    : booking.status
                        }
                    </span>

                </div>
            `;

            recentBookings.appendChild(
                bookingCard
            );

        });

    } catch (error) {

        console.error(
            "Load bookings error:",
            error
        );

        recentBookings.innerHTML = `
            <div class="empty-bookings">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>Connection Error</h3>

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

    logoutButton.addEventListener("click", () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";

    });

}

// =========================================
// TRACK REPAIR BUTTON
// =========================================

const trackRepairButton =
    document.getElementById("trackRepairButton");


if (trackRepairButton) {

    trackRepairButton.addEventListener("click", async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/bookings/my-bookings",
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to load your bookings."
                );

                return;
            }


            // Make sure the customer has bookings
            if (!data.bookings || data.bookings.length === 0) {

                alert(
                    "You do not have any repair bookings yet."
                );

                return;
            }


            // Find the latest active booking
            const activeBooking =
                data.bookings.find(
                    (booking) =>
                        booking.status !== "Completed" &&
                        booking.status !== "Cancelled"
                );


            // If there is no active repair
            if (!activeBooking) {

                alert(
                    "You currently have no active repair to track."
                );

                return;
            }


            // Open the active booking details
            window.location.href =
                `booking-details.html?id=${activeBooking._id}`;


        } catch (error) {

            console.error(
                "Track repair error:",
                error
            );


            alert(
                "Unable to connect to the server."
            );

        }

    });

}


// =========================================
// PROTECT DASHBOARD
// =========================================

if (!token || !userData) {

    window.location.href = "login.html";

} else {

    const user = JSON.parse(userData);


    // Make sure this is a customer account
    if (user.role !== "customer") {

        window.location.href = "login.html";

    } else {

        // Display customer name
        const customerName =
            document.getElementById("customerName");

        if (customerName) {
            customerName.textContent =
                user.fullName;
        }


        // Display customer email
        const customerEmail =
            document.getElementById("customerEmail");

        if (customerEmail) {
            customerEmail.textContent =
                user.email;
        }


        // Load customer's bookings
        loadRecentBookings();

    }
}