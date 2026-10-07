// =========================================
// TECHNICIAN BOOKING DETAILS
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


// Repair information elements
const repairInformationSection =
    document.getElementById(
        "repairInformationSection"
    );

const repairInformationForm =
    document.getElementById(
        "repairInformationForm"
    );

const diagnosisInput =
    document.getElementById(
        "diagnosis"
    );

const repairNotesInput =
    document.getElementById(
        "repairNotes"
    );

const partsUsedInput =
    document.getElementById(
        "partsUsed"
    );    


// =========================================
// LOAD BOOKING DETAILS
// =========================================

const loadBookingDetails = async () => {

    const bookingDetails =
        document.getElementById(
            "technicianBookingDetails"
        );


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
            "https://onezed-techfix-api.onrender.com/api/technicians/bookings",
            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${token}`
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
                        Unable to load repair
                    </h3>

                    <p>
                        ${data.message || "Please try again later."}
                    </p>

                </div>
            `;

            return;
        }


        // Find requested booking
        const booking =
            data.bookings.find(
                (item) =>
                    item._id === bookingId
            );


        // Booking does not belong to technician
        if (!booking) {

            bookingDetails.innerHTML = `
                <div class="empty-bookings">

                    <div class="empty-icon">
                        🔒
                    </div>

                    <h3>
                        Repair not found
                    </h3>

                    <p>
                        This repair is not assigned to you.
                    </p>

                </div>
            `;

            return;
        }


        // Show repair information section
        if (
            repairInformationSection &&
            (
            booking.status === "In Progress" ||
                booking.status === "Completed"
            )
        ) {

            repairInformationSection.style.display =
                "block";

            if (diagnosisInput) {
                diagnosisInput.value =
                    booking.diagnosis || "";
            }

            if (repairNotesInput) {
                repairNotesInput.value =
                    booking.repairNotes || "";
            }

            if (partsUsedInput) {
                partsUsedInput.value =
                    booking.partsUsed || "";
            }

        }


        // Format preferred date
        const bookingDate =
            new Date(
                booking.preferredDate
            ).toLocaleDateString();


        // =====================================
        // DISPLAY BOOKING DETAILS
        // =====================================

        bookingDetails.innerHTML = `

            <div class="booking-item">

                <div class="booking-item-info">

                    <span class="dashboard-badge">
                        Assigned Repair
                    </span>

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


                    ${
                        booking.serviceAddress
                            ? `
                                <small>
                                    📍 ${booking.serviceAddress}
                                </small>
                            `
                            : ""
                    }


                    <div
                        class="booking-item-status"
                        style="margin-top: 15px;"
                    >
                        <span
                            class="booking-status status-${booking.status
                                .toLowerCase()
                                .replace(/\s+/g, "-")}"
                        >
                            ${booking.status}
                        </span>
                    </div>

                    ${
                        booking.status === "Assigned"
                            ? `
                                <div style="margin-top: 20px;">

                                    <button
                                        type="button"
                                        id="startRepairButton"
                                        class="btn btn-primary"
                                    >
                                        Start Repair
                                    </button>

                                </div>
                            `
                            : booking.status === "In Progress"
                                ? `
                                    <div style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">

                                        <button
                                            type="button"
                                            id="awaitingPartsButton"
                                            class="btn btn-primary"
                                        >
                                            Mark Awaiting Parts
                                        </button>

                                        <button
                                            type="button"
                                            id="completeRepairButton"
                                            class="btn btn-primary"
                                        >
                                            Complete Repair
                                        </button>

                                    </div>
                                `
                            : booking.status === "Awaiting Parts"
                                ? `
                                    <div style="margin-top: 20px;">

                                        <button
                                            type="button"
                                            id="resumeRepairButton"
                                            class="btn btn-primary"
                                        >
                                            Resume Repair
                                        </button>

                                    </div>
                                `
                                : ""
                    }

                </div>

            </div>

        `;


        const startRepairButton =
            document.getElementById(
                "startRepairButton"
            );

        if (startRepairButton) {

            startRepairButton.addEventListener(
                "click",
                startRepair
            );

        }

        const awaitingPartsButton =
            document.getElementById(
                "awaitingPartsButton"
            );

        if (awaitingPartsButton) {

            awaitingPartsButton.addEventListener(
                "click",
                markAwaitingParts
            );

        }

        const resumeRepairButton =
            document.getElementById(
                "resumeRepairButton"
            );

        if (resumeRepairButton) {

            resumeRepairButton.addEventListener(
                "click",
                resumeRepair
            );

        }

        const completeRepairButton =
            document.getElementById(
                "completeRepairButton"
            );

        if (completeRepairButton) {

            completeRepairButton.addEventListener(
                "click",
                completeRepair
            );

        }


        

    } catch (error) {

        console.error(
            "Technician booking details error:",
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
// START REPAIR
// =========================================

const startRepair = async () => {

    const startRepairButton =
        document.getElementById(
            "startRepairButton"
        );

    if (!startRepairButton) {
        return;
    }

    startRepairButton.disabled = true;

    startRepairButton.textContent =
        "Starting Repair...";

    try {

        const response = await fetch(
            `https://onezed-techfix-api.onrender.com/api/technicians/bookings/${bookingId}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    status: "In Progress"
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to start repair."
            );

            startRepairButton.disabled = false;

            startRepairButton.textContent =
                "Start Repair";

            return;
        }

        alert(
            "Repair started successfully."
        );

        await loadBookingDetails();

    } catch (error) {

        console.error(
            "Start repair error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

        startRepairButton.disabled = false;

        startRepairButton.textContent =
            "Start Repair";
    }
};


// =========================================
// MARK AWAITING PARTS
// =========================================

const markAwaitingParts = async () => {

    const awaitingPartsButton =
        document.getElementById(
            "awaitingPartsButton"
        );

    if (!awaitingPartsButton) {
        return;
    }

    awaitingPartsButton.disabled = true;

    awaitingPartsButton.textContent =
        "Updating...";

    try {

        const response = await fetch(
            `https://onezed-techfix-api.onrender.com/api/technicians/bookings/${bookingId}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    status: "Awaiting Parts"
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to update repair status."
            );

            awaitingPartsButton.disabled = false;

            awaitingPartsButton.textContent =
                "Mark Awaiting Parts";

            return;
        }

        alert(
            "Repair marked as awaiting parts."
        );

        await loadBookingDetails();

    } catch (error) {

        console.error(
            "Awaiting parts error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

        awaitingPartsButton.disabled = false;

        awaitingPartsButton.textContent =
            "Mark Awaiting Parts";
    }
};


// =========================================
// RESUME REPAIR
// =========================================

const resumeRepair = async () => {

    const resumeRepairButton =
        document.getElementById(
            "resumeRepairButton"
        );

    if (!resumeRepairButton) {
        return;
    }

    resumeRepairButton.disabled = true;

    resumeRepairButton.textContent =
        "Resuming Repair...";

    try {

        const response = await fetch(
            `https://onezed-techfix-api.onrender.com/api/technicians/bookings/${bookingId}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    status: "In Progress"
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to resume repair."
            );

            resumeRepairButton.disabled = false;

            resumeRepairButton.textContent =
                "Resume Repair";

            return;
        }

        alert(
            "Repair resumed successfully."
        );

        await loadBookingDetails();

    } catch (error) {

        console.error(
            "Resume repair error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

        resumeRepairButton.disabled = false;

        resumeRepairButton.textContent =
            "Resume Repair";
    }
};


// =========================================
// COMPLETE REPAIR
// =========================================

const completeRepair = async () => {

    const completeRepairButton =
        document.getElementById(
            "completeRepairButton"
        );

    if (!completeRepairButton) {
        return;
    }

    // Make sure repair information has been saved
    const diagnosis =
        diagnosisInput
            ? diagnosisInput.value.trim()
            : "";

    const repairNotes =
        repairNotesInput
            ? repairNotesInput.value.trim()
            : "";

    if (!diagnosis || !repairNotes) {

        alert(
            "Please save the diagnosis and repair notes before completing the repair."
        );

        return;
    }

    const confirmCompletion =
        confirm(
            "Are you sure you want to mark this repair as completed?"
        );

    if (!confirmCompletion) {
        return;
    }

    completeRepairButton.disabled = true;

    completeRepairButton.textContent =
        "Completing Repair...";

    try {

        const response = await fetch(
            `https://onezed-techfix-api.onrender.com/api/technicians/bookings/${bookingId}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    status: "Completed"
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to complete repair."
            );

            completeRepairButton.disabled = false;

            completeRepairButton.textContent =
                "Complete Repair";

            return;
        }

        alert(
            "Repair completed successfully."
        );

        await loadBookingDetails();

    } catch (error) {

        console.error(
            "Complete repair error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

        completeRepairButton.disabled = false;

        completeRepairButton.textContent =
            "Complete Repair";
    }
};


// =========================================
// LOGOUT
// =========================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


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
// SAVE REPAIR INFORMATION
// =========================================

if (repairInformationForm) {

    repairInformationForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const saveButton =
                document.getElementById(
                    "saveRepairInformationButton"
                );

            if (saveButton) {

                saveButton.disabled = true;

                saveButton.textContent =
                    "Saving...";
            }

            try {

                const response = await fetch(
                    `https://onezed-techfix-api.onrender.com/api/technicians/bookings/${bookingId}/repair`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json",
                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            diagnosis:
                                diagnosisInput.value.trim(),

                            repairNotes:
                                repairNotesInput.value.trim(),

                            partsUsed:
                                partsUsedInput.value.trim()
                        })
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to save repair information."
                    );

                    return;
                }

                alert(
                    "Repair information saved successfully."
                );

                await loadBookingDetails();

            } catch (error) {

                console.error(
                    "Save repair information error:",
                    error
                );

                alert(
                    "Unable to connect to the server."
                );

            } finally {

                if (saveButton) {

                    saveButton.disabled = false;

                    saveButton.textContent =
                        "Save Repair Information";
                }

            }

        }
    );

}


// =========================================
// PROTECT PAGE
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

        loadBookingDetails();

    }

}