import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 1. Increase the warning limit slightly (optional, but cleaner console)
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        // 2. Separate heavy libraries into their own chunks
        manualChunks: {
          'mantine': ['@mantine/core', '@mantine/hooks'],
          'recharts': ['recharts'],
          'vendor': ['react', 'react-dom', 'axios', '@tanstack/react-query'],
        },
      },
    },
  },
})