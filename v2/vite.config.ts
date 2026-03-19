import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3002, // Changed to 3002 to avoid conflict with the built app
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
