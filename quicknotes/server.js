const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
const db = new Database('notes.db');

// Create tables
db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        color TEXT DEFAULT '#fef3c7',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

console.log('📝 Database initialized');

// API Routes

// GET all notes
app.get('/api/notes', (req, res) => {
    try {
        const notes = db.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all();
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// GET single note
app.get('/api/notes/:id', (req, res) => {
    try {
        const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});

// POST create new note
app.post('/api/notes', (req, res) => {
    try {
        const { title, content, color } = req.body;
        
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }

        const stmt = db.prepare(
            'INSERT INTO notes (title, content, color) VALUES (?, ?, ?)'
        );
        const result = stmt.run(title.trim(), content || '', color || '#fef3c7');
        
        const newNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json(newNote);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Failed to create note' });
    }
});

// PUT update note
app.put('/api/notes/:id', (req, res) => {
    try {
        const { title, content, color } = req.body;
        const { id } = req.params;

        const existing = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Note not found' });
        }

        const stmt = db.prepare(`
            UPDATE notes 
            SET title = ?, content = ?, color = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `);
        stmt.run(
            title || existing.title,
            content !== undefined ? content : existing.content,
            color || existing.color,
            id
        );

        const updatedNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
        res.json(updatedNote);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Failed to update note' });
    }
});

// DELETE note
app.delete('/api/notes/:id', (req, res) => {
    try {
        const { id } = req.params;
        
        const existing = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Note not found' });
        }

        db.prepare('DELETE FROM notes WHERE id = ?').run(id);
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

// Search notes
app.get('/api/search', (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.json([]);
        }
        
        const notes = db.prepare(`
            SELECT * FROM notes 
            WHERE title LIKE ? OR content LIKE ?
            ORDER BY updated_at DESC
        `).all(`%${q}%`, `%${q}%`);
        
        res.json(notes);
    } catch (error) {
        console.error('Error searching notes:', error);
        res.status(500).json({ error: 'Failed to search notes' });
    }
});

// Serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════╗
    ║                                           ║
    ║   📝 QuickNotes Server Running!           ║
    ║                                           ║
    ║   Local:  http://localhost:${PORT}           ║
    ║                                           ║
    ║   Made with 💚 at HackathonX 2026         ║
    ║                                           ║
    ╚═══════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down gracefully...');
    db.close();
    process.exit(0);
});
