import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Allow external connections for Teams development
    https: false, // Set to true if you need HTTPS for Teams
  },
  // Add this for stricter checking in dev
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    // Define environment variables for build
    'process.env': process.env,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
