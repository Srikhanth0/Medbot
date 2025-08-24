# Scripts Overview

This document describes the purpose of each main script in the project, including the Three.js FBX viewer and other application scripts.

---

## 📦 Three.js FBX Viewer Scripts

### `src/index.js`
- **Purpose:**
  - Main entry point for the Three.js FBX viewer (used by Webpack and Vite).
  - Handles 3D scene setup, camera, renderer, OrbitControls, FBX loading, and animation switching.
  - Exposes `window.playAnimation(name)` for UI button interaction.
- **Usage:**
  - Used as the entry for Webpack (`webpack.config.js`).
  - Can also be used as the entry for Vite (rename or update Vite config if needed).

### `public/index.html`
- **Purpose:**
  - HTML template for Webpack build.
  - Contains UI buttons for animation switching and a debug panel.

### `vite-index.html`
- **Purpose:**
  - HTML template for Vite build.
  - Similar to `public/index.html` but used when running with Vite.

### `webpack.config.js`
- **Purpose:**
  - Webpack configuration for building and serving the Three.js viewer.

### `vite.config.js`
- **Purpose:**
  - Vite configuration for fast development and build of the Three.js viewer.

---

## 🩺 MEDBOT React/TypeScript Application Scripts

### `app.js`
- **Purpose:**
  - Legacy or alternate entry point for a different Three.js or app experiment.
  - Not used in the current build system.

### `App.jsx`, `App.tsx`, `main.jsx`, `main.tsx`, `Layout.tsx`, `Sidebar.tsx`, etc.
- **Purpose:**
  - Components and entry points for the MEDBOT React/TypeScript application.
  - Not related to the Three.js FBX viewer.

### `*.ts(x)` and `*.js(x)` files (e.g., `LoginPage.tsx`, `HealthMetricCard.tsx`, etc.)
- **Purpose:**
  - Various React components and pages for the MEDBOT health monitoring application.

---

## 🗂️ Loader and Library Scripts

### `libs/three.module.js`
- **Purpose:**
  - Local copy of Three.js module (legacy/manual use).
  - Not used in the current CDN/module-based setup.

### `Loaders/FBXLoader.js`
- **Purpose:**
  - Local copy of FBXLoader (legacy/manual use).
  - Not used in the current CDN/module-based setup.

---

## 📝 Other Markdown and Config Files

### `README.md`
- **Purpose:**
  - Main project documentation, setup, and usage instructions for both Webpack and Vite.

### `MEDBOT - Medical Health Monitoring Application.md`, `MEDBOT Application Structure.md`, `MEDBOT - Complete Medical Health Monitoring Application.md`, `todo.md`
- **Purpose:**
  - Documentation and planning for the MEDBOT application.

---

## 🔄 **Summary**
- The Three.js FBX viewer is implemented in `src/index.js` and is the only script needed for both Webpack and Vite builds.
- All other scripts in `src/` are either legacy, experimental, or part of the separate MEDBOT React/TypeScript application.
- Local library/loader files are not needed with the current CDN/module-based setup. 