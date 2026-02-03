const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple JSON file database
const DB_FILE = path.join(__dirname, 'data.json');

// Initialize database file if it doesn't exist
function initDB() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ notes: [], nextId: 1 }, null, 2));
    }
}

function readDB() {
    initDB();
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

console.log('📝 Database initialized');

// API Routes

// GET all notes
app.get('/api/notes', (req, res) => {
    try {
        const db = readDB();
        const notes = db.notes.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// GET single note
app.get('/api/notes/:id', (req, res) => {
    try {
        const db = readDB();
        const note = db.notes.find(n => n.id === parseInt(req.params.id));
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

        const db = readDB();
        const now = new Date().toISOString();
        
        const newNote = {
            id: db.nextId++,
            title: title.trim(),
            content: content || '',
            color: color || '#fef3c7',
            created_at: now,
            updated_at: now
        };
        
        db.notes.push(newNote);
        writeDB(db);
        
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
        const id = parseInt(req.params.id);

        const db = readDB();
        const noteIndex = db.notes.findIndex(n => n.id === id);
        
        if (noteIndex === -1) {
            return res.status(404).json({ error: 'Note not found' });
        }

        const existing = db.notes[noteIndex];
        const updatedNote = {
            ...existing,
            title: title || existing.title,
            content: content !== undefined ? content : existing.content,
            color: color || existing.color,
            updated_at: new Date().toISOString()
        };
        
        db.notes[noteIndex] = updatedNote;
        writeDB(db);

        res.json(updatedNote);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Failed to update note' });
    }
});

// DELETE note
app.delete('/api/notes/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        const db = readDB();
        const noteIndex = db.notes.findIndex(n => n.id === id);
        
        if (noteIndex === -1) {
            return res.status(404).json({ error: 'Note not found' });
        }

        db.notes.splice(noteIndex, 1);
        writeDB(db);
        
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
        
        const db = readDB();
        const query = q.toLowerCase();
        const notes = db.notes
            .filter(n => 
                n.title.toLowerCase().includes(query) || 
                n.content.toLowerCase().includes(query)
            )
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        
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
    process.exit(0);
});
