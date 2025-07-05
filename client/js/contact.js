// contact.js — Animation + EmailJS logic for Contact Page

document.addEventListener("DOMContentLoaded", () => {
    // ----- Animate Contact Section -----
    const contactSection = document.querySelector(".contact-section");
    contactSection.style.opacity = 0;
    contactSection.style.transform = "translateY(30px)";
    setTimeout(() => {
        contactSection.style.transition = "all 1s ease-out";
        contactSection.style.opacity = 1;
        contactSection.style.transform = "translateY(0)";
    }, 200);

    // ----- Animate Form Fields + Info Boxes on Scroll -----
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

// ----- Contact Form Submission -----
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const submitBtn = form.querySelector("button");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Disable the button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        alert("Message sent successfully!");
        form.reset();
      } else {
        alert("Failed to send message.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
});