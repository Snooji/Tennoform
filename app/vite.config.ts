import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The React shell is built into ../assets and loaded by index.html next to the existing app script.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  base: '/assets/',
  build: {
    outDir: '../assets',
    emptyOutDir: true,
    manifest: true,
    assetsDir: '',
    rollupOptions: { input: path.resolve(__dirname, 'src/main.tsx') },
  },
})
