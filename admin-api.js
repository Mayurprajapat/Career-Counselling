// Admin API Routes - Add this to your server.js

const express = require('express');

module.exports = function setupAdminAPI(app, db) {
    // Admin Dashboard - Get User Count
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

    // Admin Dashboard - Get Career Count
    app.get('/api/admin/careers', (req, res) => {
        db.get('SELECT COUNT(*) as count FROM careers', [], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            db.all('SELECT id, title, description, category, image_url FROM careers', [], (err, careers) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ count: row.count, careers: careers || [] });
            });
        });
    });

    // Get single career
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

    // Add new career
    app.post('/api/admin/careers', (req, res) => {
        const { title, description, category, image_url } = req.body;
        
        if (!title || !description || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const stmt = db.prepare('INSERT INTO careers (title, description, category, image_url) VALUES (?, ?, ?, ?)');
        stmt.run(title, description, category, image_url || '', function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ 
                message: 'Career added successfully',
                id: this.lastID 
            });
        });
    });

    // Update career
    app.put('/api/admin/careers/:id', (req, res) => {
        const { title, description, category, image_url } = req.body;
        
        if (!title || !description || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        db.run(
            'UPDATE careers SET title = ?, description = ?, category = ?, image_url = ? WHERE id = ?',
            [title, description, category, image_url || '', req.params.id],
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

    // Delete career
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

    // Delete user
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

    // Get activities (mock data for now)
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
};
