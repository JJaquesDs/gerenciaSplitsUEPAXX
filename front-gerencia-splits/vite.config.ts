import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // Proxy para APIs
      '/splits/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/locais/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/his_man/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/hisMan/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/futMan/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/manu_futuras/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/his_man/ultimas': {
      target: 'http://localhost:8080'
      },
      '/relatorios/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Proxy para WebSocket
      '/ws/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
      }
    }
  }
})