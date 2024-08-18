import react from '@vitejs/plugin-react';
import { deleteAsync } from 'del';
import copy from 'rollup-plugin-copy';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

const cleanPlugin = () => ({
  name: 'clean',
  buildStart: async () => {
    await deleteAsync(['../strmdctem.github.io/*', '../strmdctem-test/*'], {
      force: true
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  logLevel: 'info',
  build: {
    outDir: './dist',
    emptyOutDir: true,
    rollupOptions: {
      plugins: [
        cleanPlugin(),
        visualizer(),
        copy({
          // Use rollup-plugin-copy here
          targets: [
            { src: 'dist/*', dest: '../strmdctem.github.io' },
            { src: 'dist/*', dest: '../strmdctem-test' }
          ],
          hook: 'writeBundle'
        })
      ]
    }
  },
  esbuild: { legalComments: 'none' },
  plugins: [react()]
});
