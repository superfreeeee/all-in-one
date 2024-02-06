# test_electron_vite

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ pnpm install
```

### Development

```bash
$ pnpm dev
```

### Build

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```

## Trouble shooting

- ESM 切换（还是先用 cjs，目前一些功能未全面支持 esm，反正都打包了，与 node 支持相关）
  - `electron.vite.config.ts` 修改 `build.rollupOptions.output.format = 'es'` 可以开启
  - `package.json` 修改 `main = './out/main/index.mjs'` 使用 mjs 产物
  - `/app/main/index.ts` 修改 `../preload/index.mjs` 使用 mjs 产物

https://cn.electron-vite.org/guide/dev
