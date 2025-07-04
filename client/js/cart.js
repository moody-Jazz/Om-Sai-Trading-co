document.addEventListener("DOMContentLoaded", async () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cartItemsContainer");

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  const loadCart = () => JSON.parse(localStorage.getItem("cart")) || [];
  const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

  const updateQuantity = (productId, newQty) => {
    let cart = loadCart();
    const item = cart.find(item => item.productID === productId);
    if (item) {
      if (newQty < 1) {
        cart = cart.filter(i => i.productID !== productId);
      } else {
        item.quantity = newQty;
      }
      saveCart(cart);
      location.reload();
    }
  };

  // Populate cart UI
  for (const item of cart) {
    try {
      const res = await fetch(`/api/products?productID=${item.productID}`);
      const products = await res.json();
      const product = products.find(p => p.productID === item.productID);
      if (!product) continue;

      const card = document.createElement("div");
      card.className = "cart-item-card";
      card.innerHTML = `
        <div class="cart-item-left">
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div class="cart-item-right">
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <p><strong>Price Range:</strong> ${product.priceRange}</p>
          
          <div class="quantity-controls">
            <button class="qty-btn decrement" data-id="${product.productID}">−</button>
            <input type="number" min="1" value="${item.quantity}" data-id="${product.productID}" class="cart-quantity" />
            <button class="qty-btn increment" data-id="${product.productID}">+</button>
          </div>

          <button class="remove-btn" data-id="${product.productID}">Remove</button>
        </div>`;
      container.appendChild(card);
    } catch (err) {
      console.error("Failed to fetch product:", err);
    }
  }

  // Quantity Buttons
  document.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    let cart = loadCart();

    if (e.target.classList.contains("increment")) {
      const item = cart.find(i => i.productID === id);
      if (item) {
        item.quantity += 1;
        saveCart(cart);
        location.reload();
      }
    }

    if (e.target.classList.contains("decrement")) {
      const item = cart.find(i => i.productID === id);
      if (item) {
        item.quantity -= 1;
        if (item.quantity < 1) {
          cart = cart.filter(i => i.productID !== id);
        }
        saveCart(cart);
        location.reload();
      }
    }

    if (e.target.classList.contains("remove-btn")) {
      cart = cart.filter(i => i.productID !== id);
      saveCart(cart);
      location.reload();
    }
  });

  // Input change
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("cart-quantity")) {
      const productId = e.target.dataset.id;
      const newQty = parseInt(e.target.value);
      if (!isNaN(newQty)) updateQuantity(productId, newQty);
    }
  });
});

// Handle Send Order Form
const openFormBtn = document.getElementById("openFormBtn");
const orderForm = document.getElementById("orderForm");
const formOverlay = document.getElementById("formOverlay");
const cancelBtn = document.getElementById("cancelOrder");
const submitBtn = document.getElementById("submitOrder");

openFormBtn.addEventListener("click", () => {
  orderForm.style.display = "block";
  formOverlay.style.display = "block";
});

const closeForm = () => {
  orderForm.style.display = "none";
  formOverlay.style.display = "none";
  document.getElementById("customerName").value = "";
  document.getElementById("customerPhone").value = "";
};

cancelBtn.addEventListener("click", closeForm);
formOverlay.addEventListener("click", closeForm);

// Submit Order
submitBtn.addEventListener("click", async () => {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const localCart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!name || !phone || localCart.length === 0) {
    alert("Please fill all fields and make sure cart is not empty.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  // Fetch product names to include
  const cartWithNames = [];
  for (const item of localCart) {
    try {
      const res = await fetch(`/api/products?productID=${item.productID}`);
      const products = await res.json();
      const product = products.find(p => p.productID === item.productID);
      if (product) {
        cartWithNames.push({
          productID: item.productID,
          name: product.name, 
          quantity: item.quantity
        });
      }
    } catch (err) {
      console.error("Error enriching cart item:", err);
    }
  }

  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, cart: cartWithNames }),
    });

    const result = await res.json();

    if (result.success) {
      alert("Order sent successfully!");
      localStorage.removeItem("cart");
      location.reload();
    } else {
      alert("Failed to send order.");
    }
  } catch (err) {
    console.error("Error sending order:", err);
    alert("Something went wrong.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Order";
    closeForm();
  }
});
