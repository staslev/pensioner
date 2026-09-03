import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static, client-side only — deployable to any static host (GitHub Pages / Netlify).
export default defineConfig({
  plugins: [react()],
  base: './',
});
