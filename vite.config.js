import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // main: resolve(__dirname, 'index.html'),
       //   about: resolve(__dirname, 'about.html'), // remove or restore these files if needed
         data: resolve(__dirname, 'src/pages/data.html'),
         diary: resolve(__dirname, 'src/pages/diary-page.html'),
         home: resolve(__dirname, 'src/pages/index.html'),
         kysely: resolve(__dirname, 'src/pages/kysely.html'),
         login: resolve(__dirname, 'src/pages/login.html'),
         tools: resolve(__dirname, 'src/pages/tools.html'),
         user: resolve(__dirname, 'src/pages/user-info.html'),
      },
    },
  },
  base: './',
});
