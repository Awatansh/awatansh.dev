import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [
    {
      name: 'resolve-shared-plugin',
      resolveId(id) {
        if (id === '@portfolio/shared') {
          return path.resolve(__dirname, '../shared/src/index.ts')
        }
      },
    },
    react(),
  ],
  resolve: {
    alias: {
      '@portfolio/shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  server: {
    middlewareMode: true,
    // SPA fallback: for any 404, serve index.html
    // This is handled by Vercel's vercel.json
  },
  preview: {
    middlewareMode: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
