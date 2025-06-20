
async function loadCategories() {
    try {
        const res = await fetch('/api/categories');
        const categories = await res.json();
        const container = document.getElementById('product-carousel');

        categories.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
        <img src="${cat.image}" alt="${cat.name}">
        <p>${cat.name}</p><br>
        <button class="product-range-btn">Explore</button>
      `;

            // Add click listener for Explore button
            card.querySelector('.product-range-btn').addEventListener('click', () => {
                window.location.href = `/explore-product.html?categoryID=${encodeURIComponent(cat.categoryID)}`;
            });

            container.appendChild(card);
        });
    } catch (err) {
        console.error('Failed to load categories:', err);
    }
}


// Call function on load
window.addEventListener('DOMContentLoaded', loadCategories);




const scrollWrapper = document.querySelector('.product-scroll-wrapper');

let scrollAmount = 1;
let direction = 1;

function autoScroll() {
    scrollWrapper.scrollLeft += scrollAmount * direction;

    // Looping logic
    if (scrollWrapper.scrollLeft + scrollWrapper.clientWidth >= scrollWrapper.scrollWidth) {
        direction = -1; // Scroll backward
    } else if (scrollWrapper.scrollLeft <= 0) {
        direction = 1; // Scroll forward
    }

    requestAnimationFrame(autoScroll);
}

requestAnimationFrame(autoScroll);

