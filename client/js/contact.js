// contact.js — Animation Logic for Contact Page

document.addEventListener("DOMContentLoaded", () => {
    // Fade in the contact section
    const contactSection = document.querySelector(".contact-section");
    contactSection.style.opacity = 0;
    contactSection.style.transform = "translateY(30px)";

    setTimeout(() => {
        contactSection.style.transition = "all 1s ease-out";
        contactSection.style.opacity = 1;
        contactSection.style.transform = "translateY(0)";
    }, 200);

    // Animate form fields on scroll
    const formFields = document.querySelectorAll(".contact-form .form-group, .contact-form button");
    const contactInfoBoxes = document.querySelectorAll(".contact-info .info-box");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = "translateY(0)";
                entry.target.style.transition = "all 0.6s ease-out";
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    formFields.forEach(field => {
        field.style.opacity = 0;
        field.style.transform = "translateY(20px)";
        observer.observe(field);
    });

    contactInfoBoxes.forEach(box => {
        box.classList.add("info-box");
        box.style.opacity = 0;
        box.style.transform = "translateX(-20px)";
        observer.observe(box);
    });
});
