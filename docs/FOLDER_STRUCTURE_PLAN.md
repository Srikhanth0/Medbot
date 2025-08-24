# Folder Structure Plan

## Current Analysis

The project contains **3 separate applications**:
1. **Three.js FBX Viewer** (CDN-based, standalone)
2. **Three.js FBX Viewer** (Webpack/Vite build system)
3. **MEDBOT React/TypeScript Application**

## Proposed Folder Structure

```
project-root/
├── threejs-viewer-cdn/           # CDN-based Three.js viewer
│   ├── index.html
│   └── app.js
│
├── threejs-viewer-build/          # Webpack/Vite Three.js viewer
│   ├── src/
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── vite-index.html
│   ├── webpack.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── medbot-app/                    # React/TypeScript MEDBOT application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Character3D.tsx
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   └── ToggleSwitch.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── HealthPage.tsx
│   │   │   ├── IntegrationPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   ├── CalendarPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── README.md
│
├── shared/                        # Shared assets
│   ├── models/                    # FBX files (shared between viewers)
│   │   ├── Idle Transition.fbx
│   │   ├── Jumping Jacks.fbx
│   │   ├── Kettlebell Swing.fbx
│   │   ├── Pike Walk.fbx
│   │   └── Situps.fbx
│   └── libs/                      # Legacy libraries (if needed)
│       ├── three.module.js
│       └── FBXLoader.js
│
├── docs/                          # Documentation
│   ├── SCRIPTS_OVERVIEW.md
│   ├── MEDBOT - Medical Health Monitoring Application.md
│   ├── MEDBOT Application Structure.md
│   ├── MEDBOT - Complete Medical Health Monitoring Application.md
│   └── todo.md
│
└── README.md                      # Main project overview
```

## Import Path Updates Required

### 1. Three.js CDN Viewer (`threejs-viewer-cdn/`)
- **Current:** `app.js` loads `'model/your_model.fbx'`
- **Update:** Change to `'../shared/models/Idle Transition.fbx'`

### 2. Three.js Build Viewer (`threejs-viewer-build/`)
- **Current:** `src/index.js` loads `'models/Idle Transition.fbx'`
- **Update:** Change to `'../shared/models/Idle Transition.fbx'`

### 3. MEDBOT App (`medbot-app/`)
- **Current:** All imports are relative to root
- **Update:** All imports remain the same (they're already in the correct structure)

## Benefits of This Structure

1. **Clear Separation:** Each application has its own folder
2. **Shared Assets:** Models and libraries are shared between viewers
3. **Maintained Imports:** All existing imports will work with minimal changes
4. **Scalability:** Easy to add new applications or features
5. **Documentation:** All docs are organized in one place

## Implementation Steps

1. Create the folder structure
2. Move files to their respective folders
3. Update import paths for model files
4. Update any build configurations
5. Test each application independently

## Notes

- The MEDBOT app already has a proper React structure
- The Three.js viewers can share the same model files
- Each application can have its own package.json and dependencies
- Build tools (Webpack/Vite) will work independently for each app 