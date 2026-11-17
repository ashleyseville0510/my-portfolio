
// =========================
// ENABLE JAVASCRIPT
// =========================

document.documentElement.classList.add("js-enabled");


// =========================
// MOBILE NAVIGATION
// =========================

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("show");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "✕" : "☰";

    });

    // Close menu after clicking a navigation link

    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("show");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";

        });

    });

}


// =========================
// SCROLL REVEAL ANIMATION
// =========================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("active");

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });

} else {

    // Fallback for browsers without IntersectionObserver

    revealElements.forEach(element => {
        element.classList.add("active");
    });

}


// =========================
// AUTOMATIC COPYRIGHT YEAR
// =========================

const yearElement = document.getElementById("year");

if (yearElement) {

    yearElement.textContent = new Date().getFullYear();

}


// =========================
// CONTACT FORM - FORMSPREE
// =========================

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {

    contactForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        // Validate required fields

        if (!contactForm.reportValidity()) {
            return;
        }

        const submitButton = contactForm.querySelector(
            'button[type="submit"]'
        );

        // Prevent multiple submissions

        if (submitButton && submitButton.disabled) {
            return;
        }

        const originalButtonText = submitButton
            ? submitButton.textContent
            : "";

        // Show sending status

        if (submitButton) {

            submitButton.disabled = true;
            submitButton.textContent = "Sending...";

        }

        formStatus.textContent = "Sending your message...";
        formStatus.className = "form-status";

        try {

            // Submit directly to Formspree

            const response = await fetch(
                "https://formspree.io/f/xyewwgrd",
                {
                    method: "POST",

                    body: new FormData(contactForm),

                    headers: {
                        "Accept": "application/json"
                    }
                }
            );

            if (response.ok) {

                // Success

                formStatus.textContent =
                    "Thank you! Your message has been sent successfully.";

                formStatus.classList.add("success");

                // Clear form fields

                contactForm.reset();

            } else {

                // Formspree error

                const result = await response.json().catch(() => ({}));

                formStatus.textContent =
                    result.errors
                        ? result.errors.map(error => error.message).join(" ")
                        : "Unable to send your message. Please try again.";

                formStatus.classList.add("error");

            }

        } catch (error) {

            // Network error

            formStatus.textContent =
                "Network error. Please check your internet connection and try again.";

            formStatus.classList.add("error");

            console.error("Contact form error:", error);

        } finally {

            // Restore button

            if (submitButton) {

                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;

            }

        }

    });

}
