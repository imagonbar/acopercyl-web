import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: 'covid-persistente-web.test',
    port: 5173,
    open: true,
    hmr: {
        host: 'covid-persistente-web.test'
    }
  }
});
