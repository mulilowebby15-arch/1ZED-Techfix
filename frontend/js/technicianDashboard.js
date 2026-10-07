// =========================================
// TECHNICIAN DASHBOARD
// =========================================

// Get authentication data
const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");


// =========================================
// LOAD ASSIGNED BOOKINGS
// =========================================

const loadAssignedBookings = async () => {

    const technicianBookings =
        document.getElementById("technicianBookings");

    try {

        const response = await fetch(
            "https://onezed-techfix-api.onrender.com/api/technicians/bookings",
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

            technicianBookings.innerHTML = `
                <div class="empty-bookings">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h3>
                        Unable to load repairs
                    </h3>

                    <p>
                        ${data.message || "Please try again later."}
                    </p>

                </div>
            `;

            return;
        }


        // No assigned bookings
        if (!data.bookings || data.bookings.length === 0) {

            technicianBookings.innerHTML = `
                <div class="empty-bookings">

                    <div class="empty-icon">
                        🔧
                    </div>

                    <h3>
                        No assigned repairs
                    </h3>

                    <p>
                        You currently have no repair jobs assigned to you.
                    </p>

                </div>
            `;

            updateTechnicianSummary([]);

            return;
        }


        // =====================================
        // DISPLAY BOOKINGS
        // =====================================

        technicianBookings.innerHTML = "";


        data.bookings.forEach((booking) => {

            const bookingCard =
                document.createElement("div");

            bookingCard.className =
                "booking-item";

            bookingCard.style.cursor = "pointer";

            bookingCard.addEventListener("click", () => {

                window.location.href =
                    `technician-booking-details.html?id=${booking._id}`;

            });    


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

                    <span
                        class="booking-status status-${booking.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}"
                    >
                        ${booking.status}
                    </span>

                </div>
            `;


            technicianBookings.appendChild(
                bookingCard
            );

        });


        // Update summary cards
        updateTechnicianSummary(data.bookings);


    } catch (error) {

        console.error(
            "Load technician bookings error:",
            error
        );


        technicianBookings.innerHTML = `
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
// UPDATE TECHNICIAN SUMMARY
// =========================================

const updateTechnicianSummary = (bookings) => {

    const assignedJobs =
        document.getElementById("assignedJobs");

    const inProgressJobs =
        document.getElementById("inProgressJobs");

    const completedJobs =
        document.getElementById("completedJobs");


    const assignedCount =
        bookings.filter(
            (booking) =>
                booking.status === "Assigned"
        ).length;


    const inProgressCount =
        bookings.filter(
            (booking) =>
                booking.status === "In Progress" ||
                booking.status === "Awaiting Parts"
        ).length;


    const completedCount =
        bookings.filter(
            (booking) =>
                booking.status === "Completed"
        ).length;


    if (assignedJobs) {
        assignedJobs.textContent =
            assignedCount;
    }


    if (inProgressJobs) {
        inProgressJobs.textContent =
            inProgressCount;
    }


    if (completedJobs) {
        completedJobs.textContent =
            completedCount;
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
// PROTECT TECHNICIAN PAGE
// =========================================

if (!token || !userData) {

    window.location.href =
        "login.html";

} else {

    const user =
        JSON.parse(userData);


    // Only technicians can access this page
    if (user.role !== "technician") {

        window.location.href =
            "login.html";

    } else {

        // Display technician name
        const technicianName =
            document.getElementById("technicianName");


        if (technicianName) {

            technicianName.textContent =
                user.fullName || "Technician";

        }


        // Load assigned repairs
        loadAssignedBookings();

    }

}