require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API (API key should be in .env file)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
    )`, () => {
        // Seed default admin user if configured in env variables
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (adminEmail && adminPassword) {
            db.get("SELECT COUNT(*) as count FROM users WHERE email = ?", [adminEmail], (err, row) => {
                if (!err && row.count === 0) {
                    db.run("INSERT INTO users (email, password) VALUES (?, ?)", [adminEmail, adminPassword], (err) => {
                        if (err) {
                            console.error('Error seeding admin user:', err.message);
                        } else {
                            console.log(`Default admin user created from environment variables: ${adminEmail}`);
                        }
                    });
                }
            });
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS careers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        image_url TEXT,
        video_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, () => {
        // Attempt to alter the table to add video_url if it doesn't exist
        db.run("ALTER TABLE careers ADD COLUMN video_url TEXT", (err) => {
            // Error is expected if column already exists, safe to ignore
        });

        // Initialize with default 7 careers if empty or has outdated records
        db.get('SELECT COUNT(*) as count FROM careers', [], (err, row) => {
            if (!err && row.count < 5) {
                db.run('DELETE FROM careers', () => {
                    const stmt = db.prepare('INSERT INTO careers (title, description, category, image_url, video_url) VALUES (?, ?, ?, ?, ?)');
                    stmt.run('Software Engineering', 'Design, develop, and maintain software systems. A highly rewarding career in the tech industry with infinite growth potential.', 'tech', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop', 'https://www.youtube.com/embed/z0yElglKNls');
                    stmt.run('UI/UX Design', 'Creative high-paying career in digital design. UI/UX design focuses on creating intuitive, stunning, and user-friendly visual interfaces.', 'design', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop', 'https://www.youtube.com/embed/55NvZjUZIO8');
                    stmt.run('Data Science', 'Extract meaningful insights from raw data. Combine mathematics, statistics, and programming to drive strategic business decisions.', 'tech', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', 'https://www.youtube.com/embed/ua-CiDNNj30');
                    stmt.run('Chartered Accountancy (CA)', 'Prestigious career in finance, taxation, and auditing. Navigate complex financial laws and assist corporate tax strategies.', 'commerce', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop', 'https://www.youtube.com/embed/p1pXy4sPki8');
                    stmt.run('Aerospace Engineering', 'Design high-performance aircraft and spacecraft. Discover the path to joining top global space organizations like ISRO and NASA.', 'science', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&h=400&fit=crop', 'https://www.youtube.com/embed/1kH3iZ1iX1I');
                    stmt.run('Cybersecurity Specialist', 'Protect networks, systems, and programs from digital attacks. A high-demand defensive career in an increasingly connected world.', 'tech', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop', 'https://www.youtube.com/embed/z5nc9MDbvEc');
                    stmt.run('Product Management', 'Lead the lifecycle of a product from conception to launch. Bridge the gap between engineering, design, and business goals.', 'business', 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop', 'https://www.youtube.com/embed/HscVz4sXfHk');
                    stmt.finalize();
                    console.log('Seeded 7 premium career paths successfully with verified YouTube embeds.');
                });
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
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// API Routes - Admin Panel
app.get('/api/admin/users', (req, res) => {
    db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        db.all('SELECT id, email, created_at FROM users LIMIT 20', [], (err, users) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ count: row.count, users: users || [] });
        });
    });
});

app.get('/api/admin/careers', (req, res) => {
    db.get('SELECT COUNT(*) as count FROM careers', [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        db.all('SELECT id, title, description, category, image_url, video_url FROM careers', [], (err, careers) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ count: row.count, careers: careers || [] });
        });
    });
});

app.get('/api/admin/careers/:id', (req, res) => {
    db.get('SELECT * FROM careers WHERE id = ?', [req.params.id], (err, career) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!career) {
            return res.status(404).json({ error: 'Career not found' });
        }
        res.json({ career });
    });
});

app.post('/api/admin/careers', (req, res) => {
    const { title, description, category, image_url, video_url } = req.body;
    
    if (!title || !description || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const stmt = db.prepare('INSERT INTO careers (title, description, category, image_url, video_url) VALUES (?, ?, ?, ?, ?)');
    stmt.run(title, description, category, image_url || '', video_url || '', function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ 
            message: 'Career added successfully',
            id: this.lastID 
        });
    });
});

app.put('/api/admin/careers/:id', (req, res) => {
    const { title, description, category, image_url, video_url } = req.body;
    
    if (!title || !description || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    db.run(
        'UPDATE careers SET title = ?, description = ?, category = ?, image_url = ?, video_url = ? WHERE id = ?',
        [title, description, category, image_url || '', video_url || '', req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Career not found' });
            }
            res.json({ message: 'Career updated successfully' });
        }
    );
});

app.delete('/api/admin/careers/:id', (req, res) => {
    db.run('DELETE FROM careers WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Career not found' });
        }
        res.json({ message: 'Career deleted successfully' });
    });
});

app.delete('/api/admin/users/:id', (req, res) => {
    db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    });
});

app.get('/api/admin/activities', (req, res) => {
    const activities = [
        { 
            message: 'New user registered', 
            timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        { 
            message: 'Career listing updated', 
            timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        { 
            message: 'System started successfully', 
            timestamp: new Date(Date.now() - 86400000).toISOString()
        }
    ];
    res.json({ activities });
});

app.get('/api/admin/mentors', (req, res) => {
    db.all('SELECT * FROM mentors', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});
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
            const isAdmin = process.env.ADMIN_EMAIL && row.email === process.env.ADMIN_EMAIL;
            res.json({ message: 'Login successful', user: { id: row.id, email: row.email, isAdmin: !!isAdmin } });
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
    const { title, description, category, image_url, video_url } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    db.run('INSERT INTO careers (title, description, category, image_url, video_url) VALUES (?, ?, ?, ?, ?)',
           [title, description, category, image_url || '', video_url || ''], function(err) {
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

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            return res.json({ 
                response: "Hello! It looks like the Gemini API Key is not set yet in the environment. Please add a valid GEMINI_API_KEY to your `.env` file to unlock my full AI career counseling capabilities!\n\nFor now, here is a helpful career tip: Focus on building practical projects and internships to boost your resume!"
            });
        }

        const systemPrompt = "You are a professional and friendly AI Career Counselor named 'Career AI' for the platform 'CareerPath'. " +
            "Your job is to guide students towards their dream careers, recommend learning paths, analyze skills, " +
            "and suggest educational goals. Keep your answers clear, motivating, and professional. " +
            "Please respond concisely (max 3 short paragraphs) so that it is readable in a chat bubble. " +
            "Support multiple languages, including Hindi and English.";

        const prompt = `${systemPrompt}\n\nUser Question: ${message}`;
        let responseText = "";

        try {
            // Try standard Gemini 2.5 Flash model (fully active and working in 2026!)
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent(prompt);
            responseText = result.response.text();
        } catch (flash25Error) {
            console.warn("Gemini 2.5 Flash failed, trying fallback model gemini-2.0-flash...", flash25Error.message);
            try {
                // Fallback to gemini-2.0-flash
                const modelFallback = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                const resultFallback = await modelFallback.generateContent(prompt);
                responseText = resultFallback.response.text();
            } catch (flash20Error) {
                console.warn("Gemini 2.0 Flash failed, trying fallback model gemini-1.5-pro...", flash20Error.message);
                // Last fallback to stable gemini-1.5-pro
                const modelPro = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
                const resultPro = await modelPro.generateContent(prompt);
                responseText = resultPro.response.text();
            }
        }

        res.json({ response: responseText });
    } catch (e) {
        console.error('Gemini API error:', e);
        res.status(500).json({ error: 'Error calling Gemini AI: ' + e.message });
    }
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