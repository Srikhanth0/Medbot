# MedBot Development Scripts

This directory contains simplified scripts for the MedBot application.

## 🚀 Quick Start

**Single Command Development:**
```bash
npm run dev
```

This command directly starts the Vite development server without any complex setup.

## NPM Scripts

### `npm run dev` ⭐ **MAIN COMMAND**
- **Description**: Start Vite development server
- **What it does**: Starts the React development server directly
- **Usage**: `npm run dev`

### `npm run build`
- **Description**: Build for production
- **What it does**: Compiles TypeScript and builds the production bundle
- **Usage**: `npm run build`

### `npm run lint`
- **Description**: Run ESLint
- **What it does**: Checks code quality and style
- **Usage**: `npm run lint`

### `npm run preview`
- **Description**: Preview production build
- **What it does**: Serves the production build locally
- **Usage**: `npm run preview`

## Prerequisites

1. **Node.js**: Node.js 16+ installed
2. **npm**: npm package manager

## How It Works

### Simple Development Flow

```
npm run dev
    ↓
vite (direct)
    ↓
React development server starts
```

## File Structure

```
medbot-app/
├── scripts/
│   └── README.md          # This file
├── package.json           # NPM scripts
└── ...
```

## Benefits of Simplified Setup

- **Faster startup** - No complex environment checks
- **No Python dependencies** - Pure Node.js/React setup
- **Cross-platform** - Works on all platforms without special scripts
- **Easier maintenance** - Fewer moving parts
- **Standard Vite workflow** - Uses standard Vite commands 