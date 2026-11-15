import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  // Cloudflare Pages: "/" | GitHub Pages: "/shamseh-film/"
  base: process.env.CF_PAGES ? '/' : '/shamseh-film/',
  appType: 'spa',
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})