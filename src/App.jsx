import { useEffect, useMemo, useState } from 'react';

const menuItems = [
  {
    id: 1,
    name: 'Classic Burger',
    description: 'Beef patty, cheddar, lettuce and house sauce.',
    price: 8.95,
    category: 'Burgers',
  },
  {
    id: 2,
    name: 'Crispy Chicken Wrap',
    description: 'Crunchy chicken, slaw and garlic mayo.',
    price: 7.5,
    category: 'Wraps',
  },
  {
    id: 3,
    name: 'Loaded Fries',
    description: 'Seasoned fries with cheese sauce and onions.',
    price: 4.95,
    category: 'Sides',
  },
  {
    id: 4,
    name: 'Margherita Pizza',
    description: 'Stone baked pizza with mozzarella and basil.',
    price: 10.95,
    category: 'Pizza',
  },
  {
    id: 5,
    name: 'Veggie Bowl',
    description: 'Rice, roasted veg, avocado and chilli jam.',
    price: 8.25,
    category: 'Bowls',
  },
  {
    id: 6,
    name: 'Chocolate Shake',
    description: 'Thick shake finished with chocolate drizzle.',
    price: 3.95,
    category: 'Drinks',
  },
];

const currency = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
});

function App() {
  const [activeView, setActiveView] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('takeaway-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('takeaway-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [form, setForm] = useState({ email: '', password: '' });
  const [loginMessage, setLoginMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('takeaway-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('takeaway-user', JSON.stringify(user));
      return;
    }

    localStorage.removeItem('takeaway-user');
  }, [user]);

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const addToCart = (item) => {
    setCart((current) => {
      const existing = current.find((entry) => entry.id === item.id);

      if (existing) {
        return current.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });

    setCartOpen(true);
  };

  const updateQuantity = (id, nextQuantity) => {
    if (nextQuantity <= 0) {
      setCart((current) => current.filter((item) => item.id !== id));
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: nextQuantity } : item
      )
    );
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setLoginMessage('Enter an email and password to demonstrate the login flow.');
      return;
    }

    const displayName = form.email.split('@')[0] || 'Guest';

    setUser({
      email: form.email,
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
    });
    setForm({ email: '', password: '' });
    setLoginMessage('Login successful. This now shows a signed-in takeaway customer experience.');
    setActiveView('home');
  };

  const handleLogout = () => {
    setUser(null);
    setLoginMessage('You have been logged out.');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Takeaway demo</p>
          <h1>Simple takeaway showcase</h1>
        </div>

        <nav className="topnav" aria-label="Primary">
          <button
            className={activeView === 'home' ? 'nav-link active' : 'nav-link'}
            onClick={() => setActiveView('home')}
          >
            Home
          </button>
          <button
            className={activeView === 'menu' ? 'nav-link active' : 'nav-link'}
            onClick={() => setActiveView('menu')}
          >
            Menu
          </button>
          <button
            className={activeView === 'login' ? 'nav-link active' : 'nav-link'}
            onClick={() => setActiveView('login')}
          >
            {user ? 'Account' : 'Login'}
          </button>
          <button className="cart-button" onClick={() => setCartOpen(true)}>
            Cart ({cartCount})
          </button>
        </nav>
      </header>

      <main className="page-content">
        {activeView === 'home' && (
          <section className="hero card">
            <div>
              <p className="eyebrow">Made simpler</p>
              <h2>No feature-heavy header. Just the essentials.</h2>
              <p className="hero-copy">
                This version keeps the showcase focused on three things: a clean home view,
                a working menu with add to cart, and a visible login flow so clients can see
                how ordering could work.
              </p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => setActiveView('menu')}>
                  Browse menu
                </button>
                <button className="secondary-button" onClick={() => setActiveView('login')}>
                  View login
                </button>
              </div>
            </div>

            <div className="hero-panel">
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
        )}

        {activeView === 'menu' && (
          <section className="menu-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Menu showcase</p>
                <h2>Clickable products with a real cart flow</h2>
              </div>
              <p>{cartCount} item(s) in cart</p>
            </div>

            <div className="menu-grid">
              {menuItems.map((item) => (
                <article className="card menu-card" key={item.id}>
                  <span className="pill">{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="menu-card-footer">
                    <strong>{currency.format(item.price)}</strong>
                    <button className="primary-button" onClick={() => addToCart(item)}>
                      Add to cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeView === 'login' && (
          <section className="login-section card">
            <div>
              <p className="eyebrow">Login showcase</p>
              <h2>{user ? `Welcome back, ${user.name}` : 'Customer login demo'}</h2>
              <p>
                This is a lightweight login example for the showcase. It is enough to show that
                returning customers can sign in before ordering.
              </p>
            </div>

            {user ? (
              <div className="account-panel">
                <p><strong>Signed in as:</strong> {user.email}</p>
                <button className="secondary-button" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            ) : (
              <form className="login-form" onSubmit={handleLogin}>
                <label>
                  Email
                  <input
                    type="email"
                    placeholder="customer@example.com"
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, email: event.target.value }))
                    }
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    placeholder="Enter any password"
                    value={form.password}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, password: event.target.value }))
                    }
                  />
                </label>
                <button className="primary-button" type="submit">
                  Sign in
                </button>
              </form>
            )}

            {loginMessage && <p className="status-message">{loginMessage}</p>}
          </section>
        )}
      </main>

      <aside className={cartOpen ? 'cart-drawer open' : 'cart-drawer'} aria-label="Cart drawer">
        <div className="cart-header">
          <h2>Your cart</h2>
          <button className="close-button" onClick={() => setCartOpen(false)}>
            Close
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="empty-state">Your cart is empty. Add items from the menu to demonstrate the flow.</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{currency.format(item.price)} each</p>
                  </div>

                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Subtotal</span>
                <strong>{currency.format(subtotal)}</strong>
              </div>
              <button className="primary-button full-width">Checkout demo</button>
            </div>
          </>
        )}
      </aside>

      {cartOpen && <button className="backdrop" aria-label="Close cart" onClick={() => setCartOpen(false)} />}
    </div>
  );
}

export default App;
