import path from 'path'
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, './app/main/index.ts'),
        },
        // output: {
        //   format: 'es',
        // },
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, './app/preload/index.ts'),
        },
        // output: {
        //   format: 'es',
        // },
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    root: path.resolve(__dirname, './app/renderer'),
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, './app/renderer/index.html'),
        },
        // output: {
        //   format: 'es',
        // },
      },
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
    plugins: [react()],
  },
})
