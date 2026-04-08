const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// Database setup
const db = new sqlite3.Database('./foodie.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initDatabase();
    }
});

// Initialize database tables
function initDatabase() {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Dishes table
    db.run(`CREATE TABLE IF NOT EXISTS dishes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        image TEXT,
        price REAL NOT NULL,
        rating REAL,
        address TEXT
    )`);

    // Cart table
    db.run(`CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        dish_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (dish_id) REFERENCES dishes (id)
    )`);

    // Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Order items table
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        dish_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (dish_id) REFERENCES dishes (id)
    )`);

    // Insert sample dishes if not exists
    insertSampleDishes();
}

// Sample dishes data
function insertSampleDishes() {
    const dishes = [
        // Breakfast
        { name: "Idli Sambar", category: "Breakfast", image: "website dishes/download.jpg", price: 50, rating: 4.4, address: "Central Street" },
        { name: "Dosa", category: "Breakfast", image: "website dishes/dosa.jpg", price: 70, rating: 4.6, address: "North Avenue" },
        { name: "Pongal", category: "Breakfast", image: "website dishes/pongal.jpg", price: 65, rating: 4.2, address: "Market Road" },
        { name: "Mini Idli Sambar", category: "Breakfast", image: "website dishes/miniidlisambarr.jpg", price: 45, rating: 4.1, address: "Church Lane" },
        { name: "Podi Idly", category: "Breakfast", image: "website dishes/podiidly.jpg", price: 40, rating: 4.0, address: "Lakeview Rd" },
        { name: "Masala Dosa", category: "Breakfast", image: "website dishes/masaladosa.jpg", price: 90, rating: 4.7, address: "Temple Street" },
        { name: "Mini tiffin", category: "Breakfast", image: "website dishes/minitiffin.jpg", price: 55, rating: 4.3, address: "Park Avenue" },
        { name: "Poori", category: "Breakfast", image: "website dishes/poori.jpg", price: 60, rating: 4.2, address: "River Road" },
        { name: "Puttu", category: "Breakfast", image: "website dishes/puttu.jpg", price: 50, rating: 4.1, address: "Station Street" },
        { name: "Idiyappam", category: "Breakfast", image: "website dishes/idiyappam.jpg", price: 55, rating: 4.2, address: "College Road" },

        // Lunch
        { name: "South Indian Meals", category: "Lunch", image: "website dishes/fullmeals.jpg", price: 150, rating: 4.6, address: "Main Bazaar" },
        { name: "Curd Rice", category: "Lunch", image: "website dishes/curdrice.jpg", price: 80, rating: 4.0, address: "Green Park" },
        { name: "Sambar Rice", category: "Lunch", image: "website dishes/sambar rice.jpg", price: 85, rating: 4.1, address: "Hillview" },
        { name: "Mini meals", category: "Lunch", image: "website dishes/mini-meals-thaali.jpg", price: 120, rating: 4.3, address: "Food Court" },
        { name: "Tomato Rice", category: "Lunch", image: "website dishes/kuska.jpg", price: 90, rating: 4.2, address: "Sunset Blvd" },
        { name: "Veg Friedrice", category: "Lunch", image: "website dishes/vegfriedrice.jpg", price: 110, rating: 4.0, address: "Oak Street" },
        { name: "Chicken Biriyani", category: "Lunch", image: "website dishes/chickenbiriyani.jpg", price: 160, rating: 4.5, address: "Spice Avenue" },
        { name: "Fish Biriyani", category: "Lunch", image: "website dishes/fishbiriyani.jpg", price: 170, rating: 4.4, address: "Harbour Road" },
        { name: "Mushroom Biriyani", category: "Lunch", image: "website dishes/mushroombiriyani.jpg", price: 150, rating: 4.1, address: "Garden Lane" },
        { name: "Paneer Fried Rice", category: "Lunch", image: "website dishes/paneerfriedrice.jpg", price: 130, rating: 4.2, address: "Bridge Street" },

        // Snacks
        { name: "Brownies", category: "Snacks", image: "website dishes/BROWNIES.jpg", price: 75, rating: 4.6, address: "Corner Cafe" },
        { name: "Samosa", category: "Snacks", image: "website dishes/samosa.jpg", price: 30, rating: 4.3, address: "City Square" },
        { name: "Donuts", category: "Snacks", image: "website dishes/jco fav.jpg", price: 35, rating: 4.4, address: "Market Street" },
        { name: "Icecreams", category: "Snacks", image: "website dishes/icecreams.png", price: 40, rating: 4.2, address: "Riverbank" },
        { name: "Frenchfries", category: "Snacks", image: "website dishes/french fries.jpg", price: 50, rating: 4.5, address: "Baker's Street" },
        { name: "Chicken lollypop", category: "Snacks", image: "website dishes/Chicken Lollypop Recipe.jpg", price: 60, rating: 4.3, address: "Sweet Lane" },
        { name: "Chicken Momos", category: "Snacks", image: "website dishes/chickenmomos.png", price: 55, rating: 4.1, address: "Spice Street" },
        { name: "Paneer pizza", category: "Snacks", image: "website dishes/paneerpizza.png", price: 150, rating: 4.0, address: "Flavor Avenue" },
        { name: "Large Size Burger", category: "Snacks", image: "website dishes/Largesizeburger.png", price: 145, rating: 4.2, address: "Café Corner" },

        // Dinner
        { name: "Naan Chickengravy", category: "Dinner", image: "website dishes/Butter Chicken with Naan.jpg", price: 100, rating: 4.3, address: "Evening Plaza" },
        { name: "Chapati Veggravy", category: "Dinner", image: "website dishes/Chappathi-Vegkuruma.jpg", price: 90, rating: 4.1, address: "Sunset Boulevard" },
        { name: "Egg Kothu Parotta", category: "Dinner", image: "website dishes/Egg Kothu Parotta.jpg", price: 110, rating: 4.4, address: "Night Market" },
        { name: "Saucy Ramen Noodles", category: "Dinner", image: "website dishes/Saucy Ramen Noodles.jpg", price: 120, rating: 4.2, address: "City Lights" },
        { name: "Mushroom Munchurian", category: "Dinner", image: "website dishes/mushroom manchurian.jpg", price: 115, rating: 4.3, address: "Downtown" },
        { name: "Veg Manchurian", category: "Dinner", image: "website dishes/Onion Rava Dosa.jpg", price: 100, rating: 4.1, address: "Central Park" },
        { name: "Veg Roll", category: "Dinner", image: "website dishes/veg roll.jpg", price: 105, rating: 4.2, address: "Maple Street" },
        { name: "Onion Rava Dosa", category: "Dinner", image: "website dishes/Onion Rava Dosa.jpg", price: 130, rating: 4.4, address: "Pine Avenue" },
        { name: "Roast", category: "Dinner", image: "website dishes/roast.png", price: 140, rating: 4.5, address: "Oakwood Blvd" }
    ];

    // Check if dishes already exist
    db.get("SELECT COUNT(*) as count FROM dishes", (err, row) => {
        if (err) {
            console.error('Error checking dishes:', err);
            return;
        }

        if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO dishes (name, category, image, price, rating, address) VALUES (?, ?, ?, ?, ?, ?)");
            dishes.forEach(dish => {
                stmt.run(dish.name, dish.category, dish.image, dish.price, dish.rating, dish.address);
            });
            stmt.finalize();
            console.log('Sample dishes inserted.');
        }
    });
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// API Routes

// Get all dishes
app.get('/api/dishes', (req, res) => {
    const category = req.query.category;
    let query = 'SELECT * FROM dishes';
    let params = [];

    if (category) {
        query += ' WHERE category = ?';
        params.push(category);
    }

    query += ' ORDER BY category, name';

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get single dish
app.get('/api/dishes/:id', (req, res) => {
    db.get('SELECT * FROM dishes WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Dish not found' });
            return;
        }
        res.json(row);
    });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Username or email already exists' });
                    }
                    return res.status(500).json({ error: err.message });
                }

                const token = jwt.sign(
                    { id: this.lastID, username, email },
                    process.env.JWT_SECRET || 'your-secret-key',
                    { expiresIn: '24h' }
                );

                res.status(201).json({
                    message: 'User created successfully',
                    token,
                    user: { id: this.lastID, username, email }
                });
            });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

// User login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    });
});

// Get user cart
app.get('/api/cart', authenticateToken, (req, res) => {
    const query = `
        SELECT c.id, c.quantity, d.id as dish_id, d.name, d.image, d.price, d.category
        FROM cart c
        JOIN dishes d ON c.dish_id = d.id
        WHERE c.user_id = ?
    `;

    db.all(query, [req.user.id], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add item to cart
app.post('/api/cart', authenticateToken, (req, res) => {
    const { dish_id, quantity = 1 } = req.body;

    if (!dish_id) {
        return res.status(400).json({ error: 'Dish ID is required' });
    }

    // Check if item already in cart
    db.get('SELECT * FROM cart WHERE user_id = ? AND dish_id = ?', [req.user.id, dish_id], (err, existing) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (existing) {
            // Update quantity
            db.run('UPDATE cart SET quantity = quantity + ? WHERE id = ?',
                [quantity, existing.id],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ message: 'Cart updated', cart_id: existing.id });
                });
        } else {
            // Add new item
            db.run('INSERT INTO cart (user_id, dish_id, quantity) VALUES (?, ?, ?)',
                [req.user.id, dish_id, quantity],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ message: 'Item added to cart', cart_id: this.lastID });
                });
        }
    });
});

// Update cart item quantity
app.put('/api/cart/:id', authenticateToken, (req, res) => {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: 'Valid quantity is required' });
    }

    db.run('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
        [quantity, req.params.id, req.user.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Cart item not found' });
            }
            res.json({ message: 'Cart updated' });
        });
});

// Remove item from cart
app.delete('/api/cart/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM cart WHERE id = ? AND user_id = ?',
        [req.params.id, req.user.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Cart item not found' });
            }
            res.json({ message: 'Item removed from cart' });
        });
});

// Create order from cart
app.post('/api/orders', authenticateToken, (req, res) => {
    // Get cart items
    const cartQuery = `
        SELECT c.quantity, d.id as dish_id, d.price
        FROM cart c
        JOIN dishes d ON c.dish_id = d.id
        WHERE c.user_id = ?
    `;

    db.all(cartQuery, [req.user.id], (err, cartItems) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Calculate total
        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order
        db.run('INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
            [req.user.id, totalAmount],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                const orderId = this.lastID;

                // Add order items
                const stmt = db.prepare('INSERT INTO order_items (order_id, dish_id, quantity, price) VALUES (?, ?, ?, ?)');
                cartItems.forEach(item => {
                    stmt.run(orderId, item.dish_id, item.quantity, item.price);
                });
                stmt.finalize();

                // Clear cart
                db.run('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

                res.status(201).json({
                    message: 'Order created successfully',
                    order_id: orderId,
                    total_amount: totalAmount
                });
            });
    });
});

// Get user orders
app.get('/api/orders', authenticateToken, (req, res) => {
    const query = `
        SELECT o.id, o.total_amount, o.status, o.created_at,
               GROUP_CONCAT(oi.quantity || 'x ' || d.name) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN dishes d ON oi.dish_id = d.id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `;

    db.all(query, [req.user.id], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});