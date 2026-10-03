// =========================================
// BOOK REPAIR
// =========================================

// Get authentication data
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");


// =========================================
// PROTECT BOOKING PAGE
// =========================================

if (!token || !user) {
    window.location.href = "login.html";
}


// =========================================
// GET FORM ELEMENTS
// =========================================

const bookingForm = document.getElementById("bookingForm");
const bookingButton = document.getElementById("bookingButton");
const bookingMessage = document.getElementById("bookingMessage");

const repairMode = document.getElementById("repairMode");
const repairLocationGroup = document.getElementById("repairLocationGroup");
const dropOffLocation = document.getElementById("dropOffLocation");
const serviceAddress = document.getElementById("serviceAddress");


// =========================================
// SHOW MESSAGE
// =========================================

const showMessage = (message, type) => {

    bookingMessage.textContent = message;

    bookingMessage.className = `form-message ${type}`;

    bookingMessage.hidden = false;
};


// =========================================
// REPAIR MODE
// SHOW/HIDE LOCATION
// =========================================

repairMode.addEventListener("change", () => {

    const selectedMode = repairMode.value;


    // Hide both location sections first
    repairLocationGroup.hidden = true;
    dropOffLocation.hidden = true;

    // Remove required attribute
    serviceAddress.required = false;


    // On-site repair
    if (selectedMode === "On-site Repair") {

        repairLocationGroup.hidden = false;

        serviceAddress.required = true;

    }


    // Drop-off repair
    else if (selectedMode === "Drop-off Repair") {

        dropOffLocation.hidden = false;

    }

});


// =========================================
// BOOKING FORM SUBMISSION
// =========================================

bookingForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    // Hide previous message
    bookingMessage.hidden = true;


    // Get form values
    const deviceType =
        document.getElementById("deviceType").value;

    const deviceBrand =
        document.getElementById("deviceBrand").value.trim();

    const problemDescription =
        document.getElementById("problemDescription").value.trim();

    const selectedRepairMode =
        repairMode.value;

    const preferredDate =
        document.getElementById("preferredDate").value;

    const preferredTime =
        document.getElementById("preferredTime").value;

    const photos =
        document.getElementById("photos").files;


    // =========================================
    // BASIC VALIDATION
    // =========================================

    if (
        !deviceType ||
        !deviceBrand ||
        !problemDescription ||
        !selectedRepairMode ||
        !preferredDate ||
        !preferredTime
    ) {

        showMessage(
            "Please complete all required fields.",
            "error"
        );

        return;
    }


    // =========================================
    // ON-SITE VALIDATION
    // =========================================

    let address = "";

    if (selectedRepairMode === "On-site Repair") {

        address = serviceAddress.value.trim();

        if (!address) {

            showMessage(
                "Please enter the service address.",
                "error"
            );

            return;
        }
    }


    // =========================================
    // CHECK PHOTO LIMIT
    // =========================================

    if (photos.length > 5) {

        showMessage(
            "You can upload a maximum of 5 images.",
            "error"
        );

        return;
    }


    // =========================================
    // CHECK PHOTO SIZE
    // =========================================

    for (const photo of photos) {

        if (photo.size > 5 * 1024 * 1024) {

            showMessage(
                "Each image must be 5MB or smaller.",
                "error"
            );

            return;
        }
    }


    // =========================================
    // CREATE FORM DATA
    // =========================================

    const formData = new FormData();

    formData.append("deviceType", deviceType);

    formData.append("deviceBrand", deviceBrand);

    formData.append(
        "problemDescription",
        problemDescription
    );

    formData.append(
        "repairMode",
        selectedRepairMode
    );

    formData.append(
        "serviceAddress",
        address
    );

    formData.append(
        "preferredDate",
        preferredDate
    );

    formData.append(
        "preferredTime",
        preferredTime
    );


    // Add photos
    for (const photo of photos) {

        formData.append("photos", photo);

    }


    // =========================================
    // DISABLE BUTTON
    // =========================================

    bookingButton.disabled = true;

    bookingButton.textContent = "Submitting...";


    // =========================================
    // SEND BOOKING TO BACKEND
    // =========================================

    try {

        const response = await fetch(
            "http://localhost:5000/api/bookings",
            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${token}`
                },

                body: formData
            }
        );


        const data = await response.json();


        // =====================================
        // HANDLE ERROR
        // =====================================

        if (!response.ok) {

            showMessage(
                data.message || "Unable to create booking.",
                "error"
            );

            return;
        }


        // =====================================
        // SUCCESS
        // =====================================

        showMessage(
            "Booking created successfully!",
            "success"
        );


        // Clear form
        bookingForm.reset();


        // Hide location sections
        repairLocationGroup.hidden = true;
        dropOffLocation.hidden = true;


        // Redirect after success
        setTimeout(() => {

            window.location.href =
                "customer-dashboard.html";

        }, 1500);


    } catch (error) {

        console.error(
            "Booking error:",
            error
        );

        showMessage(
            "Unable to connect to the server. Please make sure the backend is running.",
            "error"
        );

    } finally {

        bookingButton.disabled = false;

        bookingButton.textContent =
            "Submit Booking";

    }

});