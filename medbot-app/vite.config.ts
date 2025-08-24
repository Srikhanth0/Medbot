import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.fbx'], // Treat FBX files as binary assets
  server: {
    port: 5173,
    host: 'localhost',
    strictPort: false, // Allow Vite to find next available port
    hmr: {
      port: 5173,
      host: 'localhost',
      overlay: true,
    },
  },
  preview: {
    port: 5173,
    host: 'localhost',
  },
})

