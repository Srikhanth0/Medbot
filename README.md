# MedBot - AI Health Assistant

MedBot is an intelligent health monitoring application that combines AI-powered chat capabilities with 3D character animations and medical data analysis.


<video src="Demo.mp4" controls width="600"></video>


## Features

- **AI Chat Interface**: Interactive health assistant powered by Google's Gemini AI
- **3D Character Animations**: Engaging 3D character with exercise animations
- **Medical Data Analysis**: OCR-based prescription and ECG analysis
- **Health Monitoring**: Track vital signs and health metrics
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express
- **AI**: Google Gemini API
- **3D Graphics**: Three.js
- **Styling**: Tailwind CSS
- **OCR**: Tesseract.js
- **Charts**: Recharts

## Project Structure

```
medbot/
├── medbot-app/          # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── assets/      # Static assets
│   ├── public/          # Public assets
│   └── package.json     # Frontend dependencies
├── shared/              # Shared 3D models and assets
├── docs/                # Documentation
├── public/              # Backend public assets
├── server.js            # Express backend server
├── .gitignore           # Git ignore patterns
└── package.json         # Root package.json with scripts
```

## Three.js FBX Viewers

### CDN-based Viewer (`threejs-viewer-cdn/`)
- **Purpose:** Simple standalone Three.js viewer using CDN imports
- **Files:** `index.html`, `app.js`
- **Usage:** Open `threejs-viewer-cdn/index.html` in a browser
- **Features:** Basic FBX loading and animation playback

### Build-based Viewer (`threejs-viewer-build/`)
- **Purpose:** Advanced Three.js viewer with build system
- **Files:** Source files, build templates
- **Usage:** 
  ```bash
  npm run dev:threejs    # Start Webpack dev server
  npm run build:threejs  # Build for production
  ```
- **Features:** Animation switching, UI controls, hot reloading

## MEDBOT Application (`medbot-app/`)

### React/TypeScript Health Monitoring App with AI Integration
- **Purpose:** Complete medical health monitoring application with Gemini AI assistant
- **Structure:**
  - `src/components/` - Reusable UI components
  - `src/pages/` - Application pages (including AI-powered ChatInterface)
  - `src/utils/` - Utility functions (including Gemini API integration)
  - `src/` - Main app files
- **AI Features:**
  -  **Gemini AI Chat Interface** - Health-focused AI assistant
  -  **Real-time Chat** - Instant AI responses
  -  **Secure API Proxy** - Backend handles API keys safely
  -  **Health Context** - AI trained for medical assistance
- **Usage:**
  ```bash
  npm run dev:medbot    # Start Vite dev server
  npm run build:medbot  # Build for production
  ```

## Gemini AI Integration

### Backend Proxy Server (`server.js`)
- **Purpose:** Secure API key handling for Gemini AI
- **Features:**
  -  **API Key Protection** - Never exposed to frontend
  -  **CORS Enabled** - Allows frontend communication
  -  **Health Endpoints** - Server status monitoring
  -  **Error Handling** - Robust error management

### Frontend Integration
- **ChatInterface Component** - AI-powered health assistant
- **Utility Functions** - Reusable Gemini API functions
- **Health Context** - Specialized prompts for medical assistance

### Setup:
```bash
# 1. Get Gemini API key from Google AI Studio
# 2. Create .env file:
copy env.example .env
# 3. Add your API key to .env:
GEMINI_API_KEY=your_actual_api_key_here

# 4. Start the server:
npm run dev:server
```

##  Shared Assets (`shared/`)

### Models (`shared/models/`)
- FBX animation files shared between Three.js viewers
- Contains exercise animations: Idle Transition, Jumping Jacks, Kettlebell Swing, etc.

### Libraries (`shared/libs/`)
- Legacy Three.js and FBXLoader files (for manual use)
- Not used in the current CDN/module-based setup

##  Documentation (`docs/`)

- `SCRIPTS_OVERVIEW.md` - Detailed script documentation
- `FOLDER_STRUCTURE_PLAN.md` - Structure planning document
- `GEMINI_SETUP.md` - Complete Gemini AI setup guide
- MEDBOT application documentation
- Project planning and todo files

##  Quick Start

### Initial Setup:
```bash
# Install all dependencies (root + MEDBOT app)
npm run install:all

# Setup Gemini AI (optional but recommended)
copy env.example .env
# Edit .env and add your Gemini API key
```

### Development:
```bash
# Run all applications simultaneously
npm run dev

# Or run individually:
npm run dev:threejs    # Three.js viewer (port 3000)
npm run dev:medbot     # MEDBOT app (port 5173)
npm run dev:server     # Gemini AI server (port 3001)
```

### Production Build:
```bash
# Build all applications
npm run build

# Or build individually:
npm run build:threejs
npm run build:medbot
```

### CDN Viewer (No build required):
```bash
# Simply open in browser
threejs-viewer-cdn/index.html
```

##  Development

### Centralized NPM Management:
- **Root `package.json`** - Manages Three.js viewer and Gemini server dependencies
- **`medbot-app/package.json`** - Manages React/TypeScript app dependencies
- **Concurrent Development** - Run all apps simultaneously with `npm run dev`

### Available Scripts:
- `npm run dev` - Start all applications (Three.js + MEDBOT + Gemini)
- `npm run dev:threejs` - Three.js viewer only
- `npm run dev:medbot` - MEDBOT app only
- `npm run dev:server` - Gemini AI server only
- `npm run build` - Build all applications
- `npm run install:all` - Install all dependencies

##  AI Features

### Health Assistant Capabilities:
-  **Medical Information** - General health knowledge
-  **Exercise Advice** - Fitness recommendations
-  **Nutrition Guidance** - Dietary suggestions
-  **Mental Health Support** - Wellness tips
-  **Safety Reminders** - Always encourages professional consultation

### Integration Points:
- **ChatInterface** - Main AI chat component
- **Health Pages** - AI assistance for health metrics
- **Exercise Viewer** - AI guidance for 3D exercises
- **Profile Management** - Personalized AI recommendations

##  Notes

- All Three.js viewers share the same FBX models from `shared/models/`
- Import paths have been updated to work with the new structure
- Each application can be developed and deployed independently
- The MEDBOT app uses React/TypeScript with Vite and includes AI integration
- The Three.js viewers support both CDN and build-based approaches
- Centralized npm management allows easy dependency updates and script execution
- Gemini AI integration provides intelligent health assistance

##  Contributing

- Each application has its own development workflow
- Shared assets are maintained in the `shared/` folder
- Documentation is centralized in the `docs/` folder
- Use root-level npm scripts for common operations
- AI integration follows security best practices 
