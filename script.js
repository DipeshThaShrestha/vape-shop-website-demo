const products = [
  {
    id: "nova-pod",
    name: "Nova Pod Starter Kit",
    category: "devices",
    badge: "Device",
    notes: "Compact refillable pod kit with adjustable airflow and USB-C charging.",
    price: 34.99,
    stock: "In stock",
    color: "#7dd3c7"
  },
  {
    id: "summit-disposable",
    name: "Summit Disposable 5K",
    category: "devices",
    badge: "Device",
    notes: "Sealed disposable device in rotating fruit and mint profiles.",
    price: 18.99,
    stock: "Low stock",
    color: "#f7b267"
  },
  {
    id: "mint-ice",
    name: "Mint Ice 30ml",
    category: "e-liquid",
    badge: "E-liquid",
    notes: "Crisp mint profile available in multiple strengths where legal.",
    price: 16.5,
    stock: "In stock",
    color: "#8bd3e6"
  },
  {
    id: "berry-citrus",
    name: "Berry Citrus 60ml",
    category: "e-liquid",
    badge: "E-liquid",
    notes: "Bright berry blend with a clean citrus finish.",
    price: 22,
    stock: "In stock",
    color: "#f28ca8"
  },
  {
    id: "mesh-coils",
    name: "Mesh Coil Pack",
    category: "accessories",
    badge: "Accessory",
    notes: "Five-pack replacement mesh coils for compatible pod systems.",
    price: 14.99,
    stock: "In stock",
    color: "#c9b37e"
  },
  {
    id: "carry-case",
    name: "Travel Carry Case",
    category: "accessories",
    badge: "Accessory",
    notes: "Soft shell case with separated slots for devices and sealed bottles.",
    price: 12.99,
    stock: "In stock",
    color: "#a5b4fc"
  },
  {
    id: "classic-blend",
    name: "Classic Blend 30ml",
    category: "e-liquid",
    badge: "E-liquid",
    notes: "Smooth traditional flavor profile for adult customers.",
    price: 16.5,
    stock: "In stock",
    color: "#d9a441"
  },
  {
    id: "dual-charger",
    name: "Dual USB-C Charger",
    category: "accessories",
    badge: "Accessory",
    notes: "Compact dual-port charger for compatible rechargeable devices.",
    price: 11.5,
    stock: "In stock",
    color: "#94a3b8"
  }
];

const state = {
  filter: "all",
  mode: "Pickup",
  cart: {}
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const productGrid = document.querySelector("#productGrid");
const cartCount = document.querySelector("#cartCount");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartSubtotal = document.querySelector("#cartSubtotal");
const cartModeTitle = document.querySelector("#cartModeTitle");
const scrim = document.querySelector("#scrim");

function renderProducts() {
  const visibleProducts = products.filter((product) => state.filter === "all" || product.category === state.filter);

  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-art" aria-hidden="true">
        <div class="pack" style="--pack: ${product.color}"></div>
      </div>
      <div class="product-body">
        <div class="product-meta">
          <span class="badge">${product.badge}</span>
          <span>${product.stock}</span>
        </div>
        <h3>${product.name}</h3>
        <p>${product.notes}</p>
      </div>
      <div class="product-footer">
        <span class="price">${formatter.format(product.price)}</span>
        <button class="add-button" type="button" data-add="${product.id}">Add</button>
      </div>
    </article>
  `).join("");
}

function cartEntries() {
  return Object.entries(state.cart)
    .map(([id, quantity]) => ({
      ...products.find((product) => product.id === id),
      quantity
    }))
    .filter((item) => item.quantity > 0);
}

function renderCart() {
  const entries = cartEntries();
  const count = entries.reduce((total, item) => total + item.quantity, 0);
  const subtotal = entries.reduce((total, item) => total + item.price * item.quantity, 0);

  cartCount.textContent = count;
  cartSubtotal.textContent = formatter.format(subtotal);
  cartModeTitle.textContent = `${state.mode} cart`;

  if (!entries.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    return;
  }

  cartItems.innerHTML = entries.map((item) => `
    <div class="cart-line">
      <div>
        <p>${item.name}</p>
        <span>${formatter.format(item.price)} each</span>
      </div>
      <div class="qty-controls" aria-label="Quantity controls for ${item.name}">
        <button type="button" data-dec="${item.id}" aria-label="Decrease ${item.name}">-</button>
        <strong>${item.quantity}</strong>
        <button type="button" data-inc="${item.id}" aria-label="Increase ${item.name}">+</button>
      </div>
    </div>
  `).join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  scrim.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  scrim.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

document.querySelector("#confirmAge").addEventListener("click", () => {
  document.querySelector("#ageGate").classList.add("hidden");
  document.body.classList.remove("locked");
  localStorage.setItem("cloudNineAgeConfirmed", "true");
});

document.querySelector("#denyAge").addEventListener("click", () => {
  document.querySelector(".age-panel").innerHTML = `
    <p class="kicker">Access limited</p>
    <h1>Sorry, this demo is for adults 21+.</h1>
    <p>Please close this page if you are not of legal purchasing age.</p>
  `;
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach((item) => item.classList.toggle("active", item === button));
    renderProducts();
  });
});

document.querySelectorAll(".fulfillment-toggle button").forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    document.querySelectorAll(".fulfillment-toggle button").forEach((item) => item.classList.toggle("active", item === button));
    renderCart();
  });
});

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (!addButton) return;

  const id = addButton.dataset.add;
  state.cart[id] = (state.cart[id] || 0) + 1;
  renderCart();
  openCart();
});

cartItems.addEventListener("click", (event) => {
  const incButton = event.target.closest("[data-inc]");
  const decButton = event.target.closest("[data-dec]");
  const id = incButton?.dataset.inc || decButton?.dataset.dec;
  if (!id) return;

  state.cart[id] = (state.cart[id] || 0) + (incButton ? 1 : -1);
  if (state.cart[id] <= 0) delete state.cart[id];
  renderCart();
});

document.querySelector("#openCart").addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closeCart);
scrim.addEventListener("click", closeCart);

if (localStorage.getItem("cloudNineAgeConfirmed") === "true") {
  document.querySelector("#ageGate").classList.add("hidden");
} else {
  document.body.classList.add("locked");
}

renderProducts();
renderCart();
