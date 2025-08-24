# MedBot Startup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Start Everything
```bash
npm run dev
```

That's it! This will start:
- ⚛️ **React App** (http://localhost:5173)
- 🤖 **AI Server** (http://localhost:3001)

## 📋 What's Included

✅ **AI Health Assistant** - Powered by Gemini API  
✅ **3D Character Animations** - 6 exercise animations  
  
✅ **RAG Pipeline** - Semantic exercise search  
✅ **Health Dashboard** - Real-time metrics and analytics  

## 🔧 Prerequisites

- **Node.js 16+**
- **npm or yarn**

## 🐛 Troubleshooting



### Port Conflicts
- React: 5173
- AI Server: 3001



## 📁 Clean Project Structure

```
Medbot/
├── medbot-app/              # React application
│   ├── src/components/     # ChatInterface with 3D
│   ├── public/models/      # FBX animations

├── server.js               # AI server
└── package.json           # Single dev script
```

## 🎯 Features

- **One Command Startup** - `npm run dev` does everything
- **Integrated 3D** - No separate Three.js viewers needed
- **Smart AI** - Gemini + RAG
- **Clean Code** - Removed all unnecessary files 