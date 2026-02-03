// API Base URL - change this when deploying
const API_URL = '/api';

// State
let notes = [];
let editingNoteId = null;
let deleteNoteId = null;
let selectedColor = '#fef3c7';

// DOM Elements
const notesGrid = document.getElementById('notesGrid');
const emptyState = document.getElementById('emptyState');
const noteCount = document.getElementById('noteCount');
const addNoteBtn = document.getElementById('addNoteBtn');
const noteModal = document.getElementById('noteModal');
const deleteModal = document.getElementById('deleteModal');
const noteForm = document.getElementById('noteForm');
const searchInput = document.getElementById('searchInput');
const colorPicker = document.getElementById('colorPicker');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    setupEventListeners();
    addToastElement();
});

function addToastElement() {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = 'toast';
    document.body.appendChild(toast);
}

function setupEventListeners() {
    // Add note button
    addNoteBtn.addEventListener('click', () => openModal());

    // Form submission
    noteForm.addEventListener('submit', handleSubmit);

    // Color picker
    colorPicker.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-option')) {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedColor = e.target.dataset.color;
        }
    });

    // Search
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (e.target.value.trim()) {
                searchNotes(e.target.value);
            } else {
                loadNotes();
            }
        }, 300);
    });

    // Delete confirmation
    confirmDeleteBtn.addEventListener('click', () => {
        if (deleteNoteId) {
            deleteNote(deleteNoteId);
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeDeleteModal();
        }
        if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            openModal();
        }
    });
}

// API Functions
async function loadNotes() {
    try {
        const response = await fetch(`${API_URL}/notes`);
        if (!response.ok) throw new Error('Failed to fetch notes');
        notes = await response.json();
        renderNotes();
    } catch (error) {
        console.error('Error loading notes:', error);
        showToast('Failed to load notes', 'error');
    }
}

async function searchNotes(query) {
    try {
        const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to search notes');
        notes = await response.json();
        renderNotes();
    } catch (error) {
        console.error('Error searching notes:', error);
    }
}

async function createNote(noteData) {
    try {
        const response = await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteData)
        });
        if (!response.ok) throw new Error('Failed to create note');
        const newNote = await response.json();
        notes.unshift(newNote);
        renderNotes();
        showToast('Note created! 📝', 'success');
        return newNote;
    } catch (error) {
        console.error('Error creating note:', error);
        showToast('Failed to create note', 'error');
    }
}

async function updateNote(id, noteData) {
    try {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteData)
        });
        if (!response.ok) throw new Error('Failed to update note');
        const updatedNote = await response.json();
        const index = notes.findIndex(n => n.id === id);
        if (index !== -1) {
            notes[index] = updatedNote;
        }
        renderNotes();
        showToast('Note updated! ✨', 'success');
        return updatedNote;
    } catch (error) {
        console.error('Error updating note:', error);
        showToast('Failed to update note', 'error');
    }
}

async function deleteNote(id) {
    try {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete note');
        notes = notes.filter(n => n.id !== id);
        renderNotes();
        closeDeleteModal();
        showToast('Note deleted 🗑️', 'success');
    } catch (error) {
        console.error('Error deleting note:', error);
        showToast('Failed to delete note', 'error');
    }
}

// Render Functions
function renderNotes() {
    if (notes.length === 0) {
        notesGrid.innerHTML = '';
        emptyState.classList.remove('hidden');
        noteCount.textContent = '0 notes';
        return;
    }

    emptyState.classList.add('hidden');
    noteCount.textContent = `${notes.length} note${notes.length !== 1 ? 's' : ''}`;

    notesGrid.innerHTML = notes.map((note, index) => `
        <div class="note-card" style="background: ${note.color}; animation-delay: ${index * 0.05}s" onclick="openModal(${note.id})">
            <h3 class="note-title">${escapeHtml(note.title)}</h3>
            <p class="note-content">${escapeHtml(note.content || 'No content')}</p>
            <div class="note-footer">
                <span class="note-date">${formatDate(note.updated_at)}</span>
                <div class="note-actions">
                    <button class="note-btn edit" onclick="event.stopPropagation(); openModal(${note.id})" title="Edit">
                        ✏️
                    </button>
                    <button class="note-btn delete" onclick="event.stopPropagation(); openDeleteModal(${note.id})" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Modal Functions
function openModal(noteId = null) {
    editingNoteId = noteId;
    const modalTitle = document.getElementById('modalTitle');
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');

    if (noteId) {
        // Edit mode
        const note = notes.find(n => n.id === noteId);
        if (note) {
            modalTitle.textContent = 'Edit Note';
            noteTitle.value = note.title;
            noteContent.value = note.content || '';
            selectedColor = note.color;
            selectColor(note.color);
        }
    } else {
        // Create mode
        modalTitle.textContent = 'New Note';
        noteTitle.value = '';
        noteContent.value = '';
        selectedColor = '#fef3c7';
        selectColor('#fef3c7');
    }

    noteModal.classList.remove('hidden');
    noteTitle.focus();
}

function closeModal() {
    noteModal.classList.add('hidden');
    editingNoteId = null;
    noteForm.reset();
}

function openDeleteModal(noteId) {
    deleteNoteId = noteId;
    deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    deleteNoteId = null;
}

function selectColor(color) {
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.color === color);
    });
}

// Form Handler
async function handleSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    if (!title) {
        showToast('Please enter a title', 'error');
        return;
    }

    const noteData = {
        title,
        content,
        color: selectedColor
    };

    if (editingNoteId) {
        await updateNote(editingNoteId, noteData);
    } else {
        await createNote(noteData);
    }

    closeModal();
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Make functions globally available
window.openModal = openModal;
window.closeModal = closeModal;
window.openDeleteModal = openDeleteModal;
window.closeDeleteModal = closeDeleteModal;
