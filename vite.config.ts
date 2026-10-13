import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/campusable/',
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts: true,
  },
});
