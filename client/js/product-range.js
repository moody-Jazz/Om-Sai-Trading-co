

const carousel = document.getElementById("product-carousel");

let scrollAmount = 0;
const scrollStep = 200; // pixels to scroll per step
const delay = 2500; // milliseconds between scrolls

function autoScroll() {
    if (carousel.scrollWidth - carousel.clientWidth === scrollAmount) {
        scrollAmount = 0;
    } else {
        scrollAmount += scrollStep;
    }

    carousel.scrollTo({
        left: scrollAmount,
        behavior: "smooth"
    });
}

setInterval(autoScroll, delay);

