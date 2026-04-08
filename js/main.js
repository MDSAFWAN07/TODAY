document.addEventListener("DOMContentLoaded", () => {

    const dishes = [
        // ===== BREAKFAST =====
        { id: 1, name: "Idli Sambar", category: "Breakfast", image: "website dishes/download.jpg", price: 50, rating: 4.4, address: "Central Street" },
        { id: 2, name: "Dosa", category: "Breakfast", image: "website dishes/dosa.jpg", price: 70, rating: 4.6, address: "North Avenue" },
        { id: 3, name: "Pongal", category: "Breakfast", image: "website dishes/pongal.jpg", price: 65, rating: 4.2, address: "Market Road" },
        { id: 4, name: "Mini Idli Sambar", category: "Breakfast", image: "website dishes/miniidlisambarr.jpg", price: 45, rating: 4.1, address: "Church Lane" },
        { id: 5, name: "Podi Idly", category: "Breakfast", image: "website dishes/podiidly.jpg", price: 40, rating: 4.0, address: "Lakeview Rd" },
        { id: 6, name: "Masala Dosa", category: "Breakfast", image: "website dishes/masaladosa.jpg", price: 90, rating: 4.7, address: "Temple Street" },
        { id: 7, name: "Mini tiffin", category: "Breakfast", image: "website dishes/minitiffin.jpg", price: 55, rating: 4.3, address: "Park Avenue" },
        { id: 8, name: "Poori", category: "Breakfast", image: "website dishes/poori.jpg", price: 60, rating: 4.2, address: "River Road" },
        { id: 9, name: "Puttu", category: "Breakfast", image: "website dishes/puttu.jpg", price: 50, rating: 4.1, address: "Station Street" },
        { id: 10, name: "Idiyappam", category: "Breakfast", image: "website dishes/idiyappam.jpg", price: 55, rating: 4.2, address: "College Road" },

        // ===== LUNCH =====
        { id: 11, name: "South Indian Meals", category: "Lunch", image: "website dishes/fullmeals.jpg", price: 150, rating: 4.6, address: "Main Bazaar" },
        { id: 12, name: "Curd Rice", category: "Lunch", image: "website dishes/curdrice.jpg", price: 80, rating: 4.0, address: "Green Park" },
        { id: 13, name: "Sambar Rice", category: "Lunch", image: "website dishes/sambar rice.jpg", price: 85, rating: 4.1, address: "Hillview" },
        { id: 14, name: "Mini meals", category: "Lunch", image: "website dishes/mini-meals-thaali.jpg", price: 120, rating: 4.3, address: "Food Court" },
        { id: 15, name: "Tomato Rice", category: "Lunch", image: "website dishes/kuska.jpg", price: 90, rating: 4.2, address: "Sunset Blvd" },
        { id: 16, name: "Veg Friedrice", category: "Lunch", image: "website dishes/vegfriedrice.jpg", price: 110, rating: 4.0, address: "Oak Street" },
        { id: 17, name: "Chicken Biriyani", category: "Lunch", image: "website dishes/chickenbiriyani.jpg", price: 160, rating: 4.5, address: "Spice Avenue" },
        { id: 18, name: "Fish Biriyani", category: "Lunch", image: "website dishes/fishbiriyani.jpg", price: 170, rating: 4.4, address: "Harbour Road" },
        { id: 19, name: "Mushroom Biriyani", category: "Lunch", image: "website dishes/mushroombiriyani.jpg", price: 150, rating: 4.1, address: "Garden Lane" },
        { id: 20, name: "Paneer Fried Rice", category: "Lunch", image: "website dishes/paneerfriedrice.jpg", price: 130, rating: 4.2, address: "Bridge Street" },

        // ===== SNACKS =====
        { id: 21, name: "Brownies", category: "Snacks", image: "website dishes/BROWNIES.jpg", price: 75, rating: 4.6, address: "Corner Cafe" },
        { id: 22, name: "Samosa", category: "Snacks", image: "website dishes/samosa.jpg", price: 30, rating: 4.3, address: "City Square" },
        { id: 23, name: "Donuts", category: "Snacks", image: "website dishes/jco fav.jpg", price: 35, rating: 4.4, address: "Market Street" },
        { id: 24, name: "Icecreams", category: "Snacks", image: "website dishes/icecreams.png", price: 40, rating: 4.2, address: "Riverbank" },
        { id: 25, name: "Frenchfries", category: "Snacks", image: "website dishes/french fries.jpg", price: 50, rating: 4.5, address: "Baker's Street" },
        { id: 31, name: "Chicken lollypop", category: "Snacks", image: "website dishes/Chicken Lollypop Recipe.jpg", price: 60, rating: 4.3, address: "Sweet Lane" },
        { id: 36, name: "Chicken Momos", category: "Snacks", image: "website dishes/chickenmomos.png", price: 55, rating: 4.1, address: "Spice Street" },
        { id: 37, name: "Paneer pizza", category: "Snacks", image: "website dishes/paneerpizza.png", price: 150, rating: 4.0, address: "Flavor Avenue" },
        { id: 38, name: "Large Size Burger", category: "Snacks", image: "website dishes/Largesizeburger.png", price: 145, rating: 4.2, address: "Café Corner" },

        // ===== DINNER =====
      { id: 26, name: "Naan Chickengravy", category: "Dinner", image: "website dishes/Butter Chicken with Naan.jpg", price: 100, rating: 4.3, address: "Evening Plaza" },
    { id: 27, name: "Chapati Veggravy", category: "Dinner", image: "website dishes/Chappathi-Vegkuruma.jpg", price: 90, rating: 4.1, address: "Sunset Boulevard" },
        { id: 28, name: "Egg Kothu Parotta", category: "Dinner", image: "website dishes/Egg Kothu Parotta.jpg", price: 110, rating: 4.4, address: "Night Market" },
        { id: 29, name: "Saucy Ramen Noodles", category: "Dinner", image: "website dishes/Saucy Ramen Noodles.jpg", price: 120, rating: 4.2, address: "City Lights" },
        { id: 30, name: "Mushroom Munchurian", category: "Dinner", image: "website dishes/mushroom manchurian.jpg", price: 115, rating: 4.3, address: "Downtown" },
        { id: 32, name: "Veg Manchurian", category: "Dinner", image: "website dishes/Onion Rava Dosa.jpg", price: 100, rating: 4.1, address: "Central Park" },
        { id: 33, name: "Veg Roll", category: "Dinner", image: "website dishes/veg roll.jpg", price: 105, rating: 4.2, address: "Maple Street" },
        { id: 34, name: "Onion Rava Dosa", category: "Dinner", image: "website dishes/Onion Rava Dosa.jpg", price: 130, rating: 4.4, address: "Pine Avenue" },
        { id: 35, name: "Roast", category: "Dinner", image: "website dishes/roast.png", price: 140, rating: 4.5, address: "Oakwood Blvd" }
    ];

    const grids = document.querySelectorAll(".restaurant-grid");
    const searchInput = document.getElementById("searchInput");

    const _rupeeFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    function formatCurrency(v){ return _rupeeFormatter.format(Number(v) || 0); }

    function getColumnCount() {
        const w = window.innerWidth;
        if (w > 1000) return 4;
        if (w > 680) return 3;
        if (w > 420) return 2;
        return 1;
    }

    function renderDishes(filterText) {
        const text = (typeof filterText === 'string')
            ? filterText
            : (searchInput ? (searchInput.value || '') : '');
        const ft = text.toLowerCase();
        const cols = getColumnCount();
        const maxItems = cols * 3; // 3 rows

        grids.forEach(grid => {
            grid.innerHTML = ""; // clear grid
            const category = grid.dataset.category;

            const filtered = dishes
                .filter(d =>
                    d.category === category && (
                        (d.name || '').toLowerCase().includes(ft) ||
                        (d.hotel || '').toLowerCase().includes(ft)
                    )
                )
                .slice(0, maxItems);

            filtered.forEach(dish => {
                const card = document.createElement("div");
                card.className = "dish-card";

                const rating = dish.rating || '';
                const hotel = dish.hotel || '';
                const address = dish.address || '';

                card.innerHTML = `
                    <img src="${dish.image}" alt="${dish.name}">
                    <div class="dish-info">
                        <h4>${dish.name}</h4>
                        <div class="rating">${rating ? '⭐ ' + rating : ''}</div>
                        <div class="address">${hotel}${hotel && address ? ', ' + address : address}</div>
                        <div class="price">${formatCurrency(dish.price || 0)}</div>
                        <button class="add-cart">Add to Cart</button>
                    </div>
                `;

                grid.appendChild(card);
            });
        });
    }

    // Initial render and responsive re-render on resize
    renderDishes('');

    // Search event
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            renderDishes(e.target.value.toLowerCase());
        });
    }

    // Re-render when viewport changes to maintain 3 rows
    window.addEventListener('resize', () => renderDishes(''));

    /* ========== CATEGORY TAB NAVIGATION ========== */
    const categoryTabs = document.querySelectorAll('.cat-tab');
    const headingMap = {
        'Breakfast': 'breakfast-heading',
        'Lunch': 'lunch-heading',
        'Snacks': 'snacks-heading',
        'Dinner': 'dinner-heading'
    };

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            const headingId = headingMap[category];
            if (headingId) {
                const heading = document.getElementById(headingId);
                if (heading) {
                    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            // update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    /* ========== CART LOGIC ========== */
    const cartBtn = document.querySelector('.cart-btn');
    const cartPanel = document.getElementById('cartPanel');
    const closeCartBtn = document.getElementById('closeCart');
    const cartList = document.getElementById('cartList');
    const cartTotalEl = document.getElementById('cartTotal');
    const placeOrderBtn = document.getElementById('placeOrder');

    function loadCart() {
        try {
            return JSON.parse(localStorage.getItem('cart') || '[]');
        } catch (e) { return []; }
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function findDishById(id) {
        return dishes.find(d => d.id === Number(id));
    }

    function addToCart(id) {
        const cart = loadCart();
        const item = cart.find(i => i.id === Number(id));
        if (item) {
            item.qty += 1;
        } else {
            const dish = findDishById(id);
            cart.push({ id: dish.id, name: dish.name, price: dish.price || 0, image: dish.image, qty: 1, selected: true });
        }
        saveCart(cart);
        updateCartPanel();
        openCart();
    }

    function removeFromCart(id) {
        let cart = loadCart();
        cart = cart.filter(i => i.id !== Number(id));
        saveCart(cart);
        updateCartPanel();
    }

    function updateCartPanel() {
        const cart = loadCart();
        cartList.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            total += (item.price || 0) * (item.qty || 1);

            const node = document.createElement('div');
            node.className = 'cart-item';
            node.innerHTML = `
                <input type="checkbox" class="cart-check" data-id="${item.id}" ${item.selected ? 'checked' : ''}>
                <img src="${item.image}" alt="${item.name}">
                <div class="meta">
                    <h4>${item.name}</h4>
                    <div class="price">${formatCurrency(item.price)}</div>
                </div>
                <div class="actions">
                    <input class="qty" type="number" min="1" value="${item.qty}" data-id="${item.id}">
                    <button class="remove" data-id="${item.id}">Remove</button>
                </div>
            `;
            cartList.appendChild(node);
        });

        cartTotalEl.innerText = formatCurrency(total);
    }

    function openCart() {
        cartPanel.setAttribute('aria-hidden', 'false');
    }

    function closeCart() {
        cartPanel.setAttribute('aria-hidden', 'true');
    }

    // Delegated listeners for dynamic cart content
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('.add-cart')) {
            // find dish id from parent card - rely on image alt matching name
            const card = e.target.closest('.dish-card');
            const title = card.querySelector('.dish-info h4').innerText;
            const dish = dishes.find(d => d.name === title);
            if (dish) addToCart(dish.id);
        }

        if (e.target === cartBtn) {
            updateCartPanel();
            openCart();
        }

        if (e.target === closeCartBtn) {
            closeCart();
        }

        if (e.target.matches('.remove')) {
            const id = e.target.dataset.id;
            removeFromCart(Number(id));
        }

        if (e.target === placeOrderBtn) {
            const cart = loadCart();
            const selected = cart.filter(i => i.selected !== false);
            if (!selected.length) {
                alert('Please select items to order');
                return;
            }
            // Save pending order and navigate to cart page for confirmation
            localStorage.setItem('pendingOrder', JSON.stringify(selected));
            window.location.href = 'cart.html';
        }
    });

    // Listen to checkbox and qty changes in cart list
    cartList.addEventListener('change', (e) => {
        if (e.target.matches('.cart-check')) {
            const id = Number(e.target.dataset.id);
            const cart = loadCart();
            const item = cart.find(i => i.id === id);
            if (item) item.selected = e.target.checked;
            saveCart(cart);
        }

        if (e.target.matches('.qty')) {
            const id = Number(e.target.dataset.id);
            const val = Number(e.target.value) || 1;
            const cart = loadCart();
            const item = cart.find(i => i.id === id);
            if (item) item.qty = Math.max(1, val);
            saveCart(cart);
            updateCartPanel();
        }
    });

    // Initialize cart button (if present)
    if (cartBtn) cartBtn.addEventListener('click', (e) => { e.preventDefault(); updateCartPanel(); openCart(); });

    // Initial cart render state
    updateCartPanel();

    /* ========== LOGIN / AUTH ========== */
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const cancelLogin = document.getElementById('cancelLogin');
    const loginForm = document.getElementById('loginForm');

    function loadUser() {
        try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch (e) { return null; }
    }

    function saveUser(u) { localStorage.setItem('user', JSON.stringify(u)); }

    function clearUser() { localStorage.removeItem('user'); }

    function openLogin() { if (loginModal) loginModal.setAttribute('aria-hidden','false'); }
    function closeLogin() { if (loginModal) loginModal.setAttribute('aria-hidden','true'); }

    function updateAuthUI() {
        const user = loadUser();
        if (!loginBtn) return;
        if (user && user.name) {
            loginBtn.textContent = user.name;
            loginBtn.dataset.logged = 'true';
        } else {
            loginBtn.textContent = 'Login';
            loginBtn.removeAttribute('data-logged');
        }
    }

    // Show modal or logout on loginBtn click
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            const user = loadUser();
            if (user && user.name) {
                // treat as logout when clicking username
                if (confirm('Logout from ' + user.name + ' ?')) {
                    clearUser();
                    updateAuthUI();
                }
                return;
            }
            openLogin();
        });
    }

    if (cancelLogin) cancelLogin.addEventListener('click', (e) => { closeLogin(); });

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('loginName').value.trim();
            const email = document.getElementById('loginEmail').value.trim();
            if (!name || !email) { alert('Please provide name and email'); return; }
            saveUser({ name, email });
            updateAuthUI();
            closeLogin();
        });
    }

    // Initialize auth UI on load
    updateAuthUI();

    // Close modal by clicking backdrop, clicking the corner close, or pressing Escape
    const closeLoginBtn = document.getElementById('closeLoginBtn');
    if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => closeLogin());

    if (loginModal) {
        loginModal.addEventListener('click', (ev) => {
            // if user clicked on backdrop or the modal container (outside dialog), close
            if (ev.target === loginModal || ev.target.classList.contains('modal-backdrop')) {
                closeLogin();
            }
        });
    }

    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') {
            const modalOpen = loginModal && loginModal.getAttribute('aria-hidden') === 'false';
            if (modalOpen) closeLogin();
        }
    });
});
