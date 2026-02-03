// Song database by mood
const songDatabase = {
    happy: [
        { title: "Walking on Sunshine", artist: "Katrina & The Waves", duration: "3:58", emoji: "☀️" },
        { title: "Happy", artist: "Pharrell Williams", duration: "3:53", emoji: "😄" },
        { title: "Good as Hell", artist: "Lizzo", duration: "2:39", emoji: "💅" },
        { title: "Can't Stop the Feeling", artist: "Justin Timberlake", duration: "3:56", emoji: "💃" },
        { title: "Uptown Funk", artist: "Bruno Mars", duration: "4:30", emoji: "🕺" },
        { title: "Shake It Off", artist: "Taylor Swift", duration: "3:39", emoji: "✨" },
        { title: "I Gotta Feeling", artist: "Black Eyed Peas", duration: "4:49", emoji: "🎉" },
        { title: "Best Day of My Life", artist: "American Authors", duration: "3:14", emoji: "🌈" },
    ],
    chill: [
        { title: "Sunset Lover", artist: "Petit Biscuit", duration: "3:29", emoji: "🌅" },
        { title: "Electric Feel", artist: "MGMT", duration: "3:49", emoji: "⚡" },
        { title: "Redbone", artist: "Childish Gambino", duration: "5:26", emoji: "🎸" },
        { title: "Ivy", artist: "Frank Ocean", duration: "4:09", emoji: "🍃" },
        { title: "Tadow", artist: "Masego & FKJ", duration: "5:46", emoji: "🎷" },
        { title: "Location", artist: "Khalid", duration: "3:39", emoji: "📍" },
        { title: "Dreams", artist: "Fleetwood Mac", duration: "4:14", emoji: "💭" },
        { title: "Banana Pancakes", artist: "Jack Johnson", duration: "3:12", emoji: "🥞" },
    ],
    energetic: [
        { title: "Blinding Lights", artist: "The Weeknd", duration: "3:20", emoji: "💡" },
        { title: "Don't Start Now", artist: "Dua Lipa", duration: "3:03", emoji: "🔥" },
        { title: "Titanium", artist: "David Guetta ft. Sia", duration: "4:05", emoji: "💪" },
        { title: "Eye of the Tiger", artist: "Survivor", duration: "4:05", emoji: "🐯" },
        { title: "Levels", artist: "Avicii", duration: "3:19", emoji: "📈" },
        { title: "Shut Up and Dance", artist: "Walk the Moon", duration: "3:19", emoji: "🎤" },
        { title: "Mr. Brightside", artist: "The Killers", duration: "3:42", emoji: "🌟" },
        { title: "Thunder", artist: "Imagine Dragons", duration: "3:07", emoji: "⛈️" },
    ],
    sad: [
        { title: "Someone Like You", artist: "Adele", duration: "4:45", emoji: "💔" },
        { title: "All Too Well", artist: "Taylor Swift", duration: "5:28", emoji: "🍂" },
        { title: "Skinny Love", artist: "Bon Iver", duration: "3:58", emoji: "❄️" },
        { title: "Hurt", artist: "Johnny Cash", duration: "3:38", emoji: "🥀" },
        { title: "The Night We Met", artist: "Lord Huron", duration: "3:28", emoji: "🌙" },
        { title: "Fix You", artist: "Coldplay", duration: "4:55", emoji: "🩹" },
        { title: "Mad World", artist: "Gary Jules", duration: "3:08", emoji: "🌧️" },
        { title: "Liability", artist: "Lorde", duration: "2:52", emoji: "🪞" },
    ],
    focused: [
        { title: "Experience", artist: "Ludovico Einaudi", duration: "5:15", emoji: "🎹" },
        { title: "Time", artist: "Hans Zimmer", duration: "4:35", emoji: "⏰" },
        { title: "Intro", artist: "The xx", duration: "2:07", emoji: "🔮" },
        { title: "Weightless", artist: "Marconi Union", duration: "8:09", emoji: "🪶" },
        { title: "Clair de Lune", artist: "Debussy", duration: "5:00", emoji: "🌕" },
        { title: "Gymnopédie No.1", artist: "Erik Satie", duration: "3:05", emoji: "🎼" },
        { title: "Bloom", artist: "ODESZA", duration: "4:21", emoji: "🌸" },
        { title: "Aqueous Transmission", artist: "Incubus", duration: "7:47", emoji: "🌊" },
    ],
    romantic: [
        { title: "Perfect", artist: "Ed Sheeran", duration: "4:23", emoji: "💍" },
        { title: "All of Me", artist: "John Legend", duration: "4:29", emoji: "💕" },
        { title: "At Last", artist: "Etta James", duration: "3:02", emoji: "🌹" },
        { title: "Can't Help Falling in Love", artist: "Elvis Presley", duration: "3:00", emoji: "👑" },
        { title: "Thinking Out Loud", artist: "Ed Sheeran", duration: "4:41", emoji: "💭" },
        { title: "La Vie En Rose", artist: "Edith Piaf", duration: "3:07", emoji: "🇫🇷" },
        { title: "Make You Feel My Love", artist: "Adele", duration: "3:32", emoji: "🕯️" },
        { title: "Unchained Melody", artist: "Righteous Brothers", duration: "3:36", emoji: "🔗" },
    ]
};

const moodInfo = {
    happy: { name: "Happy Vibes", emoji: "😊" },
    chill: { name: "Chill Mode", emoji: "😌" },
    energetic: { name: "Energy Boost", emoji: "⚡" },
    sad: { name: "In My Feels", emoji: "😢" },
    focused: { name: "Deep Focus", emoji: "🎯" },
    romantic: { name: "Love Songs", emoji: "💕" }
};

let currentMood = null;
let currentPlaylist = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSavedPlaylists();
    addToastElement();
});

function addToastElement() {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = 'toast';
    document.body.appendChild(toast);
}

function selectMood(mood) {
    currentMood = mood;
    
    // Update UI
    document.querySelectorAll('.mood-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');
    
    // Generate playlist
    generatePlaylist(mood);
    
    // Show playlist section
    document.getElementById('moodSection').classList.add('hidden');
    document.getElementById('playlistSection').classList.remove('hidden');
}

function generatePlaylist(mood) {
    const songs = [...songDatabase[mood]];
    currentPlaylist = shuffleArray(songs).slice(0, 6);
    renderPlaylist();
}

function renderPlaylist() {
    const info = moodInfo[currentMood];
    document.getElementById('playlistMoodEmoji').textContent = info.emoji;
    document.getElementById('playlistTitle').textContent = info.name;
    
    const playlistEl = document.getElementById('playlist');
    playlistEl.innerHTML = currentPlaylist.map((song, index) => `
        <li style="animation: fadeIn 0.3s ease-out ${index * 0.1}s both;">
            <span class="song-number">${index + 1}</span>
            <div class="song-cover">${song.emoji}</div>
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <span class="song-duration">${song.duration}</span>
        </li>
    `).join('');
}

function shufflePlaylist() {
    currentPlaylist = shuffleArray([...songDatabase[currentMood]]).slice(0, 6);
    renderPlaylist();
    showToast('🔀 Playlist shuffled!');
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function goBack() {
    document.getElementById('playlistSection').classList.add('hidden');
    document.getElementById('moodSection').classList.remove('hidden');
    document.querySelectorAll('.mood-card').forEach(card => {
        card.classList.remove('selected');
    });
}

function savePlaylist() {
    const saved = getSavedPlaylists();
    const playlistId = Date.now();
    const newPlaylist = {
        id: playlistId,
        mood: currentMood,
        name: moodInfo[currentMood].name,
        emoji: moodInfo[currentMood].emoji,
        songs: currentPlaylist,
        createdAt: new Date().toISOString()
    };
    
    saved.push(newPlaylist);
    localStorage.setItem('vibecast_playlists', JSON.stringify(saved));
    loadSavedPlaylists();
    showToast('💾 Playlist saved!');
}

function getSavedPlaylists() {
    const saved = localStorage.getItem('vibecast_playlists');
    return saved ? JSON.parse(saved) : [];
}

function loadSavedPlaylists() {
    const saved = getSavedPlaylists();
    const container = document.getElementById('savedPlaylists');
    
    if (saved.length === 0) {
        container.innerHTML = '<p class="no-saved">No saved playlists yet. Generate and save some vibes!</p>';
        return;
    }
    
    container.innerHTML = saved.map(playlist => `
        <div class="saved-playlist-card" onclick="loadPlaylist(${playlist.id})">
            <button class="saved-playlist-delete" onclick="event.stopPropagation(); deletePlaylist(${playlist.id})">×</button>
            <div class="saved-playlist-emoji">${playlist.emoji}</div>
            <div class="saved-playlist-name">${playlist.name}</div>
            <div class="saved-playlist-count">${playlist.songs.length} songs</div>
        </div>
    `).join('');
}

function loadPlaylist(id) {
    const saved = getSavedPlaylists();
    const playlist = saved.find(p => p.id === id);
    
    if (playlist) {
        currentMood = playlist.mood;
        currentPlaylist = playlist.songs;
        
        document.getElementById('moodSection').classList.add('hidden');
        document.getElementById('playlistSection').classList.remove('hidden');
        renderPlaylist();
    }
}

function deletePlaylist(id) {
    const saved = getSavedPlaylists().filter(p => p.id !== id);
    localStorage.setItem('vibecast_playlists', JSON.stringify(saved));
    loadSavedPlaylists();
    showToast('🗑️ Playlist deleted');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}
