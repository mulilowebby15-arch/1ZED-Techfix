/* =====================================================
   1ZED TECHFIX
   Customer Login
===================================================== */


/* =====================================================
   GET FORM ELEMENTS
===================================================== */

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");


// =========================================
// SHOW MESSAGE
// =========================================

const showMessage = (message, type) => {
    loginMessage.textContent = message;
    loginMessage.className = `form-message ${type}`;
    loginMessage.hidden = false;
};


// =========================================
// PASSWORD VISIBILITY
// =========================================

const passwordToggles = document.querySelectorAll(".password-toggle");

passwordToggles.forEach((button) => {

    button.addEventListener("click", () => {

        const targetId = button.dataset.target;
        const passwordInput = document.getElementById(targetId);

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            button.textContent = "🙈";
            button.setAttribute("aria-label", "Hide password");

        } else {

            passwordInput.type = "password";
            button.textContent = "👁";
            button.setAttribute("aria-label", "Show password");

        }

    });

});


// =========================================
// LOGIN FORM
// =========================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    // Get form values

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;


    // Hide previous message

    loginMessage.hidden = true;


    // Basic validation

    if (!email || !password) {

        showMessage(
            "Please enter your email and password.",
            "error"
        );

        return;
    }


    // Disable button while logging in

    loginButton.disabled = true;
    loginButton.textContent = "Logging In...";


    try {

        const response = await fetch(
            "https://onezed-techfix-api.onrender.com/api/users/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );


        const data = await response.json();


        // Handle failed login

        if (!response.ok) {

            showMessage(
                data.message || "Login failed.",
                "error"
            );

            return;
        }


        // Save authentication data

        localStorage.setItem("token", data.token);

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );


        // Show success message

        showMessage(
            "Login successful! Redirecting...",
            "success"
        );


        // Redirect

        setTimeout(() => {
        const userRole = data.user.role;

            if (userRole === "customer") {
            window.location.href = "customer-dashboard.html";
        } else if (userRole === "technician") {
            window.location.href = "technician-dashboard.html";
        } else if (userRole === "admin") {
            window.location.href = "admin-dashboard.html";
        } else {
            window.location.href = "../index.html";
        }
    }, 1000);


    } catch (error) {

        console.error("Login error:", error);

        showMessage(
            "Unable to connect to the server. Please make sure the backend is running.",
            "error"
        );

    } finally {

        loginButton.disabled = false;
        loginButton.textContent = "Login";

    }

});