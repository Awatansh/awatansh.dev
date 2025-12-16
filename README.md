# Terminal-Based Portfolio

A minimalist, terminal-styled portfolio with Gemini AI integration, built with React and Express.

## ✨ Features

- 🖥️ **Fullscreen Terminal** - Green-on-black retro interface
- 🤖 **Gemini AI** - Context-aware ask & chat modes
- 🎮 **13 Commands** - Full-featured terminal experience
- 🌊 **Ripple Animations** - Interactive mouse effects
- 📱 **Responsive Design** - Works on all devices
- 🗄️ **MongoDB** - Auto-cleanup of old messages yearly
- 📋 **Contact Form** - Collect submissions with social handles
- 🔐 **OAuth Ready** - Admin panel scaffold included
- ⚡ **Production Ready** - TypeScript, tests, docs included

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

For detailed setup, see [DEV.md](DEV.md)

## 📚 Documentation

- **[DEV.md](DEV.md)** - Development guide & quick reference
- **[devdocs/](devdocs/)** - Detailed documentation
  - `MONGODB_SETUP.md` - Database setup
  - `SETUP.md` - Installation instructions
  - `ARCHITECTURE.md` - Technical details
  - `QUICK_REFERENCE.md` - Command reference
  - `INSTALLATION_CHECKLIST.md` - Step-by-step guide

## 🎮 Terminal Commands

| Command          | Purpose           |
| ---------------- | ----------------- |
| `help`           | List all commands |
| `about`          | About information |
| `projects`       | Show projects     |
| `skills`         | Show skills       |
| `experience`     | Work experience   |
| `education`      | Education         |
| `contact`        | Contact info      |
| `reachout`       | Contact form      |
| `ask "question"` | Ask AI            |
| `chat`           | Chat mode         |
| `socials`        | Social links      |
| `resume`         | View resume       |
| `clear`          | Clear terminal    |
| `exit`           | Exit session      |

## 💻 Tech Stack

| Layer    | Technology                           |
| -------- | ------------------------------------ |
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Backend  | Express.js + Node.js                 |
| Database | MongoDB (with auto-cleanup)          |
| AI       | Google Gemini API                    |
| Build    | Vite                                 |
| Testing  | Vitest + Jest                        |

## 📦 Project Structure

```
portfolio/
├── frontend/          React app (port 5173)
├── backend/          Express API (port 5000)
├── shared/           Types & constants
├── devdocs/          Detailed documentation
└── package.json      Monorepo config
```

## 🔧 Requirements

- Node.js 18+
- npm 9+
- MongoDB (local or Atlas)
- Gemini API key (free from aistudio.google.com)

## 🎯 Key Features

### Stateless Chat

- No chat history persistence (by design)
- Context-aware AI responses
- Uses your portfolio data

### Auto Cleanup

- Contact submissions older than 1 year deleted automatically
- Runs on Jan 1st each year
- MongoDB TTL index handles it

### Production Ready

- TypeScript everywhere
- Full test coverage
- Comprehensive documentation
- Error handling included
- Security best practices

## 📝 Environment Setup

### Backend (.env)

```env
DATABASE_URL=mongodb://localhost:27017/portfolio
GEMINI_API_KEY=your_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Development

```bash
# Start both servers
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## 🌐 Deployment

### Frontend (Vercel)

```bash
git push origin main
# Auto-deploys
```

### Backend (Railway/Render)

```bash
git push origin main
# Set env vars in dashboard
# Auto-deploys
```

## 📚 Learn More

- [Development Guide](DEV.md) - Commands, API, troubleshooting
- [MongoDB Setup](devdocs/MONGODB_SETUP.md) - Database configuration
- [Architecture](devdocs/ARCHITECTURE.md) - Technical details
- [Setup Guide](devdocs/SETUP.md) - Full instructions

## 🎓 What You Get

✅ Complete fullstack application  
✅ AI integration ready to use  
✅ Contact form with persistence  
✅ Terminal UI component  
✅ Production architecture  
✅ Comprehensive tests  
✅ Full TypeScript support  
✅ Detailed documentation

## 🚨 Common Issues?

Check [DEV.md](DEV.md) troubleshooting section or see detailed docs in `devdocs/` folder.

## 📄 License

MIT

---

**Ready to go?** Start with [DEV.md](DEV.md) → Run `npm run dev` → Open http://localhost:5173
