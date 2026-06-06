import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/auth": {
        target: "http://localhost:3006",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, "/feelWell/v1/auth"),
      },
      "/api/users": {
        target: "http://localhost:3006",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/users/, "/feelWell/v1/auth/users"),
      },
    },
  },
});