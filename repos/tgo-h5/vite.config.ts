import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react({ jsxImportSource: '@emotion/react', babel: { plugins: ['@emotion/babel-plugin'] } }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // 与默认 VITE_API_BASE_URL=/api 对齐：/api/* → 后端根路径 /*（可按实际网关改 rewrite）
      '/apidoctor': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/apidoctor/, ''),
      },
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api/, ''),
      },
    },
  },
  preview: { port: 5174 },
  build: {
    manifest: true
  }
})

