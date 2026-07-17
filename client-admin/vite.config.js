import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-dom') || id.includes('react-router-dom') || id.includes('node_modules/react/')) return 'react-vendor';
          if (id.includes('lucide-react') || id.includes('react-hook-form') || id.includes('react-hot-toast')) return 'ui-vendor';
        },
      },
    },
  },
});
