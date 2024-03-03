/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      fileName: 'index',
      formats: ['es', 'cjs'],
    },

    sourcemap: true,

    rollupOptions: {
      external: [
        'vscode-languageserver', //
        'vscode-languageserver/node',
        'vscode-languageserver-textdocument',
      ],
    },
  },
  test: {},
});
