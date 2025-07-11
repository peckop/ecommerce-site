// ========== Auth ==========

// Register multiple users
function registerUser() {
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
  
    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }
  
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      alert("User already exists!");
      return;
    }
  
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
  
    alert("Registration successful!");
    window.location.href = "login.html";
  }
  
  // Login from user array
  function loginUser() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
  
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username && u.password === password);
  
    if (user) {
      localStorage.setItem("loggedIn", "true");
      alert("Login successful!");
      window.location.href = "index.html";
    } else {
      alert("Invalid credentials.");
    }
  }
  
  // Logout
  function logoutUser() {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
  }
  
  // Protect pages
  function requireAuth() {
    if (localStorage.getItem("loggedIn") !== "true") {
      window.location.href = "login.html";
    }
  }
  
  // ========== Theme Toggle ==========
  function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle("dark");
    const current = html.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", current);
  }
  
  function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }
  
  // ========== Products ==========
  let products = [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  async function fetchProducts() {
    try {
      const res = await fetch("https://dummyjson.com/products");
      const data = await res.json();
      products = data.products;
      renderProducts(products);
    } catch (err) {
      alert("Failed to fetch products");
    }
  }
  
  function renderProducts(productsList) {
    const productList = document.getElementById("productList");
    if (!productList) return;
  
    productList.innerHTML = "";
  
    productsList.forEach((product) => {
      const inCart = cart.find((item) => item.id === product.id);
      const qty = inCart ? inCart.quantity : 1;
  
      productList.innerHTML += `
        <div class="product-card">
          <img src="${product.thumbnail}" alt="${product.title}" />
          <h3>${product.title}</h3>
          <p><strong>Price:</strong> $${product.price}</p>
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>Description:</strong> ${product.description}</p>
          ${
            inCart
              ? `<div class="qty-controls">
                  <button onclick="updateQuantity(${product.id}, -1)">-</button>
                  <span>${qty}</span>
                  <button onclick="updateQuantity(${product.id}, 1)">+</button>
                </div>`
              : `<button onclick="addToCart(${product.id})">Add to Cart</button>`
          }
        </div>
      `;
    });
  
    updateCartCount();
  }
  
  function addToCart(id) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
  
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
  
    saveCart();
    renderProducts(products);
  }
  
  function updateQuantity(id, change) {
    const item = cart.find((p) => p.id === id);
    if (!item) return;
  
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter((p) => p.id !== id);
    }
  
    saveCart();
    renderProducts(products);
    renderCart();
  }
  
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }
  
  function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBtn = document.getElementById("cartBtn");
    if (cartBtn) {
      cartBtn.textContent = `Cart (${count})`;
    }
  }
  
  // ========== Search ==========
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const keyword = searchInput.value.toLowerCase();
      const filtered = products.filter(p =>
        p.title.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword)
      );
      renderProducts(filtered);
    });
  }
  
  // ========== Cart Page ==========
  function renderCart() {
    const cartContainer = document.getElementById("cartContainer");
    if (!cartContainer) return;
  
    cartContainer.innerHTML = "";
  
    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }
  
    cart.forEach((item) => {
      cartContainer.innerHTML += `
        <div class="cart-item">
          <img src="${item.thumbnail}" alt="${item.title}">
          <div class="cart-info">
            <h3>${item.title}</h3>
            <p>Price: $${item.price} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <div class="cart-actions">
            <button onclick="updateQuantity(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
      `;
    });
  }
  
  // ========== Checkout ==========
  function handleCheckoutSubmit(e) {
    e.preventDefault();
  
    const name = document.getElementById("fullName").value.trim();
    const address = document.getElementById("addressLine").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const zip = document.getElementById("zip").value.trim();
    const payment = document.getElementById("payment").value;
  
    if (!name || !address || !city || !state || !zip || !payment) {
      alert("Please fill in all fields.");
      return;
    }
  
    alert("Order placed successfully!");
    localStorage.removeItem("cart");
    window.location.href = "index.html";
  }
  
  // ========== Sort ==========
  function sortProducts(value) {
    let sorted = [...products];
    if (value === "low") sorted.sort((a, b) => a.price - b.price);
    else if (value === "high") sorted.sort((a, b) => b.price - a.price);
    renderProducts(sorted);
  }
  
  // ========== Bind Events ==========
  document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
  
    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
  
    const regForm = document.getElementById("registerForm");
    if (regForm) regForm.addEventListener("submit", (e) => {
      e.preventDefault();
      registerUser();
    });
  
    const loginForm = document.getElementById("loginForm");
    if (loginForm) loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      loginUser();
    });
  
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);
  
    const productList = document.getElementById("productList");
    if (productList) fetchProducts();
  
    const cartContainer = document.getElementById("cartContainer");
    if (cartContainer) renderCart();
  
    const checkoutForm = document.getElementById("checkoutForm");
    if (checkoutForm) checkoutForm.addEventListener("submit", handleCheckoutSubmit);
  
    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) sortSelect.addEventListener("change", (e) => sortProducts(e.target.value));
  });
  