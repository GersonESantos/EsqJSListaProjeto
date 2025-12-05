import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // Redireciona requisições de /api para o seu servidor backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
