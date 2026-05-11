import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // Esto permitirá localhost y tu IP local
    port: 5173,
    open: true,
  }
});
