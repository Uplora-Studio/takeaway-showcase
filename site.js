const menuItems = [
  { id: 1, name: 'Classic Burger', description: 'Beef patty, cheddar, lettuce and house sauce.', price: 8.95, category: 'Burgers' },
  { id: 2, name: 'Crispy Chicken Wrap', description: 'Crunchy chicken, slaw and garlic mayo.', price: 7.5, category: 'Wraps' },
  { id: 3, name: 'Loaded Fries', description: 'Seasoned fries with cheese sauce and onions.', price: 4.95, category: 'Sides' },
  { id: 4, name: 'Margherita Pizza', description: 'Stone baked pizza with mozzarella and basil.', price: 10.95, category: 'Pizza' },
  { id: 5, name: 'Veggie Bowl', description: 'Rice, roasted veg, avocado and chilli jam.', price: 8.25, category: 'Bowls' },
  { id: 6, name: 'Chocolate Shake', description: 'Thick shake finished with chocolate drizzle.', price: 3.95, category: 'Drinks' },
];

const currency = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

const state = {
  view: 'home',
  cartOpen: false,
  cart: JSON.parse(localStorage.getItem('takeaway-cart') || '[]'),
  user: JSON.parse(localStorage.getItem('takeaway-user') || 'null'),
  loginMessage: '',
};

function saveState() {
  localStorage.setItem('takeaway-cart', JSON.stringify(state.cart));
  if (state.user) {
    localStorage.setItem('takeaway-user', JSON.stringify(state.user));
  } else {
    localStorage.removeItem('takeaway-user');
  }
}

function cartCount() {
  return state.cart.reduce((t, i) => t + i.quantity, 0);
}

function subtotal() {
  return state.cart.reduce((t, i) => t + i.quantity * i.price, 0);
}

function addToCart(id) {
  const item = menuItems.find((entry) => entry.id === id);
  const existing = state.cart.find((entry) => entry.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ ...item, quantity: 1 });
  }
  state.cartOpen = true;
  saveState();
  render();
}

function updateQuantity(id, delta) {
  const item = state.cart.find((entry) => entry.id === id);
  if (!item) return;
  item.quantity += delta;
  state.cart = state.cart.filter((entry) => entry.quantity > 0);
  saveState();
  render();
}

function setView(view) {
  state.view = view;
  render();
}

function login(event) {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!email || !password) {
    state.loginMessage = 'Enter an email and password to demonstrate the login flow.';
    render();
    return;
  }
  const displayName = email.split('@')[0] || 'Guest';
  state.user = {
    email,
    name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
  };
  state.loginMessage = 'Login successful. This now shows a signed-in takeaway customer experience.';
  saveState();
  state.view = 'home';
  render();
}

function logout() {
  state.user = null;
  state.loginMessage = 'You have been logged out.';
  saveState();
  render();
}

function homeMarkup() {
  return `
    <section class="hero card">
      <div>
        <p class="eyebrow">Made simpler</p>
        <h2>No feature-heavy header. Just the essentials.</h2>
        <p class="hero-copy">This version keeps the showcase focused on three things: a clean home view, a working menu with add to cart, and a visible login flow so clients can see how ordering could work.</p>
        <div class="hero-actions">
          <button class="primary-button" data-view="menu">Browse menu</button>
          <button class="secondary-button" data-view="login">View login</button>
        </div>
      </div>
      <div class="hero-panel">
        <h3>What is included</h3>
        <ul>
          <li>Home</li>
          <li>Menu</li>
          <li>Add to cart</li>
          <li>Cart drawer</li>
          <li>Customer login showcase</li>
        </ul>
      </div>
    </section>
  `;
}

function menuMarkup() {
  return `
    <section class="menu-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Menu showcase</p>
          <h2>Clickable products with a real cart flow</h2>
        </div>
        <p>${cartCount()} item(s) in cart</p>
      </div>
      <div class="menu-grid">
        ${menuItems.map((item) => `
          <article class="card menu-card">
            <span class="pill">${item.category}</span>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="menu-card-footer">
              <strong>${currency.format(item.price)}</strong>
              <button class="primary-button add-btn" data-id="${item.id}">Add to cart</button>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function loginMarkup() {
  return `
    <section class="login-section card">
      <div>
        <p class="eyebrow">Login showcase</p>
        <h2>${state.user ? `Welcome back, ${state.user.name}` : 'Customer login demo'}</h2>
        <p>This is a lightweight login example for the showcase. It is enough to show that returning customers can sign in before ordering.</p>
      </div>
      ${state.user ? `
        <div class="account-panel">
          <p><strong>Signed in as:</strong> ${state.user.email}</p>
          <button class="secondary-button" id="logout-btn">Log out</button>
        </div>
      ` : `
        <form class="login-form" id="login-form">
          <label>Email<input id="email" type="email" placeholder="customer@example.com" /></label>
          <label>Password<input id="password" type="password" placeholder="Enter any password" /></label>
          <button class="primary-button" type="submit">Sign in</button>
        </form>
      `}
      ${state.loginMessage ? `<p class="status-message">${state.loginMessage}</p>` : ''}
    </section>
  `;
}

function cartMarkup() {
  return `
    <aside class="cart-drawer ${state.cartOpen ? 'open' : ''}" aria-label="Cart drawer">
      <div class="cart-header">
        <h2>Your cart</h2>
        <button class="close-button" id="close-cart">Close</button>
      </div>
      ${state.cart.length === 0 ? `
        <p class="empty-state">Your cart is empty. Add items from the menu to demonstrate the flow.</p>
      ` : `
        <div class="cart-items">
          ${state.cart.map((item) => `
            <div class="cart-item">
              <div>
                <h3>${item.name}</h3>
                <p>${currency.format(item.price)} each</p>
              </div>
              <div class="quantity-controls">
                <button class="qty-btn" data-id="${item.id}" data-delta="-1">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="cart-footer">
          <div class="cart-total">
            <span>Subtotal</span>
            <strong>${currency.format(subtotal())}</strong>
          </div>
          <button class="primary-button full-width">Checkout demo</button>
        </div>
      `}
    </aside>
    ${state.cartOpen ? '<button class="backdrop" id="backdrop" aria-label="Close cart"></button>' : ''}
  `;
}

function render() {
  document.getElementById('app').innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Takeaway demo</p>
          <h1>Simple takeaway showcase</h1>
        </div>
        <nav class="topnav" aria-label="Primary">
          <button class="nav-link ${state.view === 'home' ? 'active' : ''}" data-view="home">Home</button>
          <button class="nav-link ${state.view === 'menu' ? 'active' : ''}" data-view="menu">Menu</button>
          <button class="nav-link ${state.view === 'login' ? 'active' : ''}" data-view="login">${state.user ? 'Account' : 'Login'}</button>
          <button class="cart-button" id="open-cart">Cart (${cartCount()})</button>
        </nav>
      </header>
      <main class="page-content">${state.view === 'home' ? homeMarkup() : state.view === 'menu' ? menuMarkup() : loginMarkup()}</main>
      ${cartMarkup()}
    </div>
  `;

  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => setView(button.dataset.view));
  });
  document.querySelectorAll('.add-btn').forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.id)));
  });
  document.querySelectorAll('.qty-btn').forEach((button) => {
    button.addEventListener('click', () => updateQuantity(Number(button.dataset.id), Number(button.dataset.delta)));
  });
  const openCart = document.getElementById('open-cart');
  if (openCart) openCart.addEventListener('click', () => { state.cartOpen = true; render(); });
  const closeCart = document.getElementById('close-cart');
  if (closeCart) closeCart.addEventListener('click', () => { state.cartOpen = false; render(); });
  const backdrop = document.getElementById('backdrop');
  if (backdrop) backdrop.addEventListener('click', () => { state.cartOpen = false; render(); });
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', login);
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
}

render();
