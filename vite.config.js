import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // entrance: 'index.html',
        room: 'page2.html'
      }
    }
  }
});
