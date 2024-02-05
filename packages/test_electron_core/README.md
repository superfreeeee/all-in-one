# test_electron_core

- `main.js` 主进程
  - `app` 管理整个应用
  - `BrowserWindow` 管理窗口
- `preload.js` 预加载，js-bridge
  - `contextBridge` 管理桥接器
- `renderer.js` 页面主脚本

## IPC 进程通信

- `app.whenReady` 注册通道 handler
- `preload.js` 内注入 bridge API，使用 `ipcRenderer` 触发主进程通道
- `renderer.js` 内通过 bridge API，与主进程进行通信

## Trouble shooting

- mirror 地址设置

https://segmentfault.com/a/1190000040356146

- `.npmrc` 变量设置不生效问题

https://www.cnblogs.com/w4ngzhen/p/17425229.html

- `proxyconnect tcp: dial tcp :0` 问题

https://github.com/develar/app-builder/issues/75
