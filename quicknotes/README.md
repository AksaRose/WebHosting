# QuickNotes 📝

A simple collaborative notes app with a beautiful UI - Built at HackathonX 2026!

## What is it?

QuickNotes is a full-stack notes application where you can create, edit, and delete sticky notes. It features a clean, modern interface with colorful note cards.

## Features

- 📝 Create, edit, and delete notes
- 🎨 7 different note colors to choose from
- 🔍 Real-time search functionality
- 💾 Persistent storage with SQLite database
- 📱 Fully responsive design
- ⌨️ Keyboard shortcuts (Cmd/Ctrl + N for new note)

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js + Express.js
- **Database:** SQLite (using better-sqlite3)

## How to Run Locally

### Prerequisites
- Node.js 18+ installed

### Steps

1. **Install dependencies:**
```bash
cd quicknotes
npm install
```

2. **Start the server:**
```bash
npm start
```

3. **Open your browser:**
Navigate to `http://localhost:3000`

That's it! The database will be created automatically on first run.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| GET | `/api/notes/:id` | Get single note |
| POST | `/api/notes` | Create new note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |
| GET | `/api/search?q=query` | Search notes |

## How to Host

### Option 1: Railway (Recommended for full-stack)
1. Push to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project → Deploy from GitHub
4. Railway auto-detects Node.js and deploys!
5. Add a persistent volume for SQLite data (optional)

### Option 2: Render
1. Push to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service
4. Connect your repo
5. Build command: `npm install`
6. Start command: `npm start`

### Option 3: Fly.io
1. Install flyctl: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Launch: `fly launch`
4. Deploy: `fly deploy`

### Option 4: DigitalOcean App Platform
1. Push to GitHub
2. Create new App on DigitalOcean
3. Connect your repo
4. It auto-detects Node.js settings

### Option 5: Self-hosted (VPS)
```bash
# On your VPS
git clone <your-repo>
cd quicknotes
npm install
npm start

# Or use PM2 for production
npm install -g pm2
pm2 start server.js --name quicknotes
```

## Project Structure

```
quicknotes/
├── server.js           # Express server + API routes
├── package.json        # Dependencies
├── notes.db           # SQLite database (created on first run)
├── public/
│   ├── index.html     # Main HTML
│   ├── style.css      # Styles
│   └── app.js         # Frontend JavaScript
└── README.md          # This file
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |

## Database

The app uses SQLite for simplicity. The database file (`notes.db`) is created automatically when you first run the server.

**Note for cloud hosting:** If you're deploying to a platform without persistent storage, consider switching to PostgreSQL or MongoDB. The database file will be reset on each deploy otherwise.

## Made with 💚 at HackathonX 2026
