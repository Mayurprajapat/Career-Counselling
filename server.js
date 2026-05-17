const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Database setup
const db = new sqlite3.Database('./careerpath.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        createTables();
    }
});

// Create tables
function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS careers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, () => {
        // Initialize with default careers if empty
        db.get('SELECT COUNT(*) as count FROM careers', [], (err, row) => {
            if (!err && row.count === 0) {
                const stmt = db.prepare('INSERT INTO careers (title, description, category, image_url) VALUES (?, ?, ?, ?)');
                stmt.run('Aerospace Engineering', 'Learn how to join ISRO and explore the vast universe. Aerospace engineering involves designing and building aircraft, spacecraft, and related systems.', 'science', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=200&fit=crop&crop=center');
                stmt.run('UI/UX Design', 'Creative high-paying career in digital design. UI/UX design focuses on creating intuitive and visually appealing digital interfaces.', 'creative', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop&crop=center');
                stmt.run('Chartered Accountancy (CA)', 'Complete roadmap for Chartered Accountancy. CA is a prestigious certification for accounting and financial professionals.', 'commerce', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop&crop=center');
                stmt.finalize();
            }
        });
    });

    db.run(`CREATE TABLE IF NOT EXISTS mentors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        profession TEXT NOT NULL,
        experience INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index2.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// API Routes
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'User registered successfully', userId: this.lastID });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (row) {
            res.json({ message: 'Login successful', user: { id: row.id, email: row.email } });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

app.get('/api/careers', (req, res) => {
    db.all('SELECT * FROM careers', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

app.post('/api/careers', (req, res) => {
    const { title, description, category } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    db.run('INSERT INTO careers (title, description, category) VALUES (?, ?, ?)',
           [title, description, category], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Career added successfully', careerId: this.lastID });
    });
});

app.post('/api/mentors', (req, res) => {
    const { name, email, profession, experience } = req.body;

    if (!name || !email || !profession || !experience) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.run('INSERT INTO mentors (name, email, profession, experience) VALUES (?, ?, ?, ?)',
           [name, email, profession, experience], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Mentor application submitted successfully', mentorId: this.lastID });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
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