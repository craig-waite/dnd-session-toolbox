import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), tanstackStart(), viteReact()],
  test: {
    environment: 'jsdom',
    exclude: ['e2e/**', 'node_modules/**'],
    setupFiles: ['./src/test/setup.ts'],
  },
})
