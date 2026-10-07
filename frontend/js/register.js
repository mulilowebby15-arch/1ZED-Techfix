/* =====================================================
   1ZED TECHFIX
   Customer Registration
===================================================== */


/* =====================================================
   GET FORM ELEMENTS
===================================================== */

const registerForm =
    document.getElementById("registerForm");

const registerButton =
    document.getElementById("registerButton");

const registerMessage =
    document.getElementById("registerMessage");


/* =====================================================
   SHOW MESSAGE
===================================================== */

const showMessage = (message, type) => {

    registerMessage.textContent = message;

    registerMessage.className =
        `form-message ${type}`;

    registerMessage.hidden = false;
};


/* =====================================================
   PASSWORD VISIBILITY
===================================================== */

const passwordToggles =
    document.querySelectorAll(".password-toggle");


passwordToggles.forEach((toggle) => {

    toggle.addEventListener("click", () => {

        const targetId =
            toggle.dataset.target;

        const passwordInput =
            document.getElementById(targetId);


        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            toggle.textContent = "🙈";

            toggle.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            passwordInput.type = "password";

            toggle.textContent = "👁️";

            toggle.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    });

});


/* =====================================================
   REGISTRATION
===================================================== */

registerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        /* =============================================
           GET FORM VALUES
        ============================================= */

        const name =
            document.getElementById("name")
                .value
                .trim();

        const email =
            document.getElementById("email")
                .value
                .trim();

        const phone =
            document.getElementById("phone")
                .value
                .trim();

        const password =
            document.getElementById("password")
                .value;

        const confirmPassword =
            document.getElementById("confirmPassword")
                .value;


        /* =============================================
           CLEAR PREVIOUS MESSAGE
        ============================================= */

        registerMessage.hidden = true;


        /* =============================================
           VALIDATION
        ============================================= */

        if (
            !name ||
            !email ||
            !phone ||
            !password ||
            !confirmPassword
        ) {

            showMessage(
                "Please fill in all fields.",
                "error"
            );

            return;
        }


        /* =============================================
           PASSWORD MATCH
        ============================================= */

        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match.",
                "error"
            );

            return;
        }


        /* =============================================
           DISABLE BUTTON
        ============================================= */

        registerButton.disabled = true;

        registerButton.textContent =
            "Creating Account...";


        try {

            /* =========================================
               SEND REGISTRATION TO BACKEND
            ========================================== */

            const response = await fetch(
                "https://onezed-techfix-api.onrender.com/api/users/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        /* Backend expects fullName */

                        fullName: name,

                        email,

                        phone,

                        password

                    })
                }
            );


            /* =========================================
               READ SERVER RESPONSE
            ========================================== */

            const data =
                await response.json();


            /* =========================================
               HANDLE SERVER ERROR
            ========================================== */

            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Registration failed.",
                    "error"
                );

                return;
            }


            /* =========================================
               REGISTRATION SUCCESS
            ========================================== */

            showMessage(
                "Account created successfully! Redirecting to login...",
                "success"
            );


            registerForm.reset();


            /* =========================================
               REDIRECT TO LOGIN
            ========================================== */

            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1500);

        }


        catch (error) {

            console.error(
                "Registration error:",
                error
            );

            showMessage(
                "Unable to connect to the server. Please make sure the backend is running.",
                "error"
            );

        }


        finally {

            registerButton.disabled = false;

            registerButton.textContent =
                "Create Account";

        }

    }
);