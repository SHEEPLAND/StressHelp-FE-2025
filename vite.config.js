import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // about: resolve(__dirname, 'about.html'), // remove or restore these files if needed
        // apitest: resolve(__dirname, 'src/pages/apitest.html'),
      },
    },
  },
  base: './',
});
