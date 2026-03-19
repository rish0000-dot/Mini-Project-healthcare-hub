import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Triggering server reload to clear HMR cache

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
})
