async function fetchAndDisplayCategories() {
    try {
        const res = await fetch('/api/categories');
        const categories = await res.json();

        const container = document.getElementById('category-container');
        container.innerHTML = ''; // Clear old content

        categories.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
        <div class="category-image">
          <img src="${cat.image}" alt="${cat.name}" />
        </div>
        <div class="category-info">
          <h2 class="category-title">${cat.name}</h2>
          <p class="category-description">${cat.description || "No description available."}</p>
          <p class="category-id">Category ID: <span>${cat.categoryID}</span></p>
          <button class="category-button" data-id="${cat.categoryID}">Explore</button>
        </div>
      `;
            container.appendChild(card);
        });

        // Add event listeners to all "Explore" buttons
        container.querySelectorAll('.category-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const categoryID = e.target.getAttribute('data-id');
                window.location.href = `explore-product.html?categoryID=${categoryID}`;
            });
        });

    } catch (err) {
        console.error('Error loading categories:', err);
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', fetchAndDisplayCategories);
