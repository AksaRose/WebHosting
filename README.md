# Web Hosting Sample Projects 🚀

Two sample hackathon-style projects demonstrating different hosting scenarios.

## Projects

### 1. VibeCast 🎵 (Frontend Only)
A mood-based playlist generator with a beautiful retro-futuristic design.

**Tech:** HTML, CSS, Vanilla JavaScript (No backend needed!)

**Location:** `./vibecast/`

**To run locally:**
```bash
cd vibecast
# Just open index.html in your browser, or:
npx serve .
```

**Hosting options:** GitHub Pages, Netlify, Vercel, Cloudflare Pages, any static host

---

### 2. QuickNotes 📝 (Full Stack)
A notes app with colorful sticky notes, search, and persistent storage.

**Tech:** Node.js, Express, SQLite, HTML/CSS/JS

**Location:** `./quicknotes/`

**To run locally:**
```bash
cd quicknotes
npm install
npm start
# Open http://localhost:3000
```

**Hosting options:** Railway, Render, Fly.io, Heroku, DigitalOcean, any Node.js host

---

## Quick Comparison

| Feature | VibeCast | QuickNotes |
|---------|----------|------------|
| Type | Frontend Only | Full Stack |
| Backend | ❌ | ✅ Node.js/Express |
| Database | ❌ (localStorage) | ✅ SQLite |
| Build Step | None | `npm install` |
| Hosting Complexity | Easy | Medium |
| Cost | Free (static) | Free-Low |

## Hosting Guide Summary

### For Static Sites (VibeCast)

1. **GitHub Pages** - Free, push to repo, enable in settings
2. **Netlify** - Free, drag & drop or connect repo
3. **Vercel** - Free, `vercel` command or connect repo
4. **Cloudflare Pages** - Free, connect to GitHub/GitLab

### For Full-Stack Apps (QuickNotes)

1. **Railway** - Easy, auto-detects Node.js, free tier available
2. **Render** - Connect repo, configure start command
3. **Fly.io** - `fly launch` and `fly deploy`
4. **Heroku** - Classic option, `git push heroku main`

## Project Structure

```
WebHosting/
├── README.md           # This file
├── vibecast/           # Frontend-only project
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── README.md
└── quicknotes/         # Full-stack project
    ├── server.js
    ├── package.json
    ├── public/
    │   ├── index.html
    │   ├── style.css
    │   └── app.js
    └── README.md
```

## Made for Teaching Web Hosting 🎓

These projects are intentionally simple and beginner-friendly, perfect for:
- Learning web hosting basics
- Hackathon starter templates
- Teaching full-stack vs static deployments
- Demonstrating modern web development

---
