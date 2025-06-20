document.addEventListener("DOMContentLoaded", () => {
    fadeInOnLoad();
    setupRevealOnScroll();
    autoScrollProductCarousel();
});

function fadeInOnLoad() {
    const sections = document.querySelectorAll("section");
    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = "translateY(30px)";
        section.style.transition = "all 1s ease-out";
    });

    setTimeout(() => {
        sections.forEach(section => {
            section.style.opacity = 1;
            section.style.transform = "translateY(0)";
        });
    }, 200);
}

function setupRevealOnScroll() {
    const revealables = document.querySelectorAll(".nav-bar, .hero, .quality-section, .product-range-section .product-card, .info-table .row, .business-info .highlight-box, .why-card, .partners-grid img, .contact-form .form-group, .contact-form button, .contact-info .info-box");

    revealables.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = "translateY(20px)";
        el.style.transition = "all 0.6s ease-out";
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = "translateY(0)";
            } else {
                entry.target.style.opacity = 0;
                entry.target.style.transform = "translateY(20px)";
            }
        });
    }, { threshold: 0.1 });

    revealables.forEach(el => {
        observer.observe(el);
    });
}

function autoScrollProductCarousel() {
    const carousel = document.getElementById("product-carousel");
    if (!carousel) return;

    let direction = 1;

    setInterval(() => {
        carousel.scrollBy({
            left: direction * 2,
            behavior: "smooth"
        });

        if (
            carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth ||
            carousel.scrollLeft <= 0
        ) {
            direction *= -1;
        }
    }, 30);
}

document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".highlight-box h3");
    const highlightsSection = document.querySelector(".highlights");

    const runCounter = (counter) => {
        const target = +counter.textContent.replace("+", "");
        counter.textContent = "0";

        const update = () => {
            const current = +counter.textContent;
            const increment = Math.ceil(target / 100);

            if (current < target) {
                counter.textContent = current + increment;
                setTimeout(update, 20);
            } else {
                counter.textContent = target + "+";
            }
        };

        update();
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(runCounter);
                observer.unobserve(entry.target); // Run only once
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

    if (highlightsSection) {
        observer.observe(highlightsSection);
    }
});




document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.querySelector(".search-box input");
    const searchButton = document.querySelector(".search-box button");

    let categoryMap = {}; // { "paint": "categoryID123" }
    let productMap = {};  // { "hammer": "productID123" }

    // Step 1: Fetch data from your existing APIs
    try {
        const [categoryRes, productRes] = await Promise.all([
            fetch("http://localhost:5000/api/categories"),
            fetch("http://localhost:5000/api/products"),
        ]);

        const categories = await categoryRes.json();
        const products = await productRes.json();

        // Create name-to-ID maps
        categories.forEach(cat => {
            if (cat.name) categoryMap[cat.name.toLowerCase()] = cat.categoryID;
        });

        products.forEach(prod => {
            if (prod.name) productMap[prod.name.toLowerCase()] = prod.productID;
        });

    } catch (err) {
        console.error("Failed to fetch categories/products:", err);
    }

    // Step 2: Handle search
    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        if (categoryMap[query]) {
            // Redirect to category page with category ID
            window.location.href = `explore-product.html?categoryID=${encodeURIComponent(categoryMap[query])}`;
        } else if (productMap[query]) {
            // Redirect to product page with product ID
            window.location.href = `product.html?productID=${encodeURIComponent(productMap[query])}`;
        } else {
            alert("No matching category or product found.");
        }
    }

    // Button click and Enter key triggers
    searchButton.addEventListener("click", handleSearch);
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleSearch();
    });
});

