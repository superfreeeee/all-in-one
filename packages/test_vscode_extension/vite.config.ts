import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/extension.ts'),
      formats: ['cjs'],
      fileName: 'extension',
    },

    rollupOptions: {
      external: ['vscode'],
    },

    sourcemap: true,

    outDir: 'dist',
  },

  plugins: [],
});
