import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // A relative base keeps the site portable between a custom domain and GitHub Pages.
  base: './',
  plugins: [react()],
})
