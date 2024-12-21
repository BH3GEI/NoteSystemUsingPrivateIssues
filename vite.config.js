import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  base: '/NoteSystemUsingPrivateIssues/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true
  },
  server: {
    port: 2333,
    host: '0.0.0.0'
  },
})
