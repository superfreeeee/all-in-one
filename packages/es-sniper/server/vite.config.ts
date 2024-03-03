import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      fileName: 'index',
      formats: ['cjs'],
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
});
