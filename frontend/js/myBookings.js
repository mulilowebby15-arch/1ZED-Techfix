// =========================================
// MY BOOKINGS PAGE
// =========================================

// Get authentication data
const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");





// =========================================
// LOAD ALL BOOKINGS
// =========================================

const loadAllBookings = async () => {

    const allBookings =
        document.getElementById("allBookings");

    try {

        const response = await fetch(
            "https://onezed-techfix-api.onrender.com/api/bookings/my-bookings",
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

            allBookings.innerHTML = `
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


        // No bookings
        if (!data.bookings || data.bookings.length === 0) {

            allBookings.innerHTML = `
                <div class="empty-bookings">

                    <div class="empty-icon">
                        📋
                    </div>

                    <h3>
                        No bookings yet
                    </h3>

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

        allBookings.innerHTML = "";


        data.bookings.forEach((booking) => {

            const bookingCard =
                document.createElement("div");

            bookingCard.className =
                "booking-item";

            bookingCard.style.cursor = "pointer";


        // Open booking details when the card is clicked
        bookingCard.addEventListener("click", () => {

            window.location.href =
                `booking-details.html?id=${booking._id}`;

        });


        // Format preferred date
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

                <span
                    class="booking-status status-${booking.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}"
                >
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


        // =====================================
        // HIDE UNASSIGNED BOOKING
        // =====================================

        if (!booking.technician) {

            const hideButton =
                document.createElement("button");

            hideButton.type = "button";

           hideButton.className =
                "btn btn-outline hide-booking-button";

            hideButton.textContent =
                "Concel Booking";


            hideButton.addEventListener("click", async (event) => {

                // Prevent the booking card click
                event.stopPropagation();


                const confirmHide =
                    confirm(
                        "Are you sure you want to conceal this booking?"
                    );


                if (!confirmHide) {
                    return;
                }


                try {

                    const response =
                        await fetch(
                            `https://onezed-techfix-api.onrender.com/api/bookings/${booking._id}/hide`,
                            {
                                method: "PATCH",

                                headers: {
                                    Authorization:
                                        `Bearer ${token}`
                                }
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        alert(
                            data.message ||
                            "Unable to conceal booking."
                        );

                        return;
                    }


                    alert(
                        "Booking concealed successfully."
                    );


                    // Reload the bookings list
                    loadAllBookings();


                } catch (error) {

                    console.error(
                        "conceal booking error:",
                        error
                    );


                    alert(
                        "Unable to connect to the server."
                    );

                }

            });


            // Add button to the booking card
            bookingCard.appendChild(
                hideButton
            );

        }


            allBookings.appendChild(
                bookingCard
            );

        });

        

    } catch (error) {

        console.error(
            "Load bookings error:",
            error
        );

        allBookings.innerHTML = `
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

    // Only customers can access this page
    if (user.role !== "customer") {

        window.location.href = "login.html";

    } else {

        loadAllBookings();

    }
}