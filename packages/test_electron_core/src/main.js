const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron/main');
const { isMac } = require('./env.js');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    // frame: false,
    // titleBarStyle: 'hiddenInset',
    // titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //   color: '#2f3241',
    //   symbolColor: '#74b1be',
    //   backgroundColor: '#fff',
    //   height: 60,
    // },
    // transparent: true,
    webPreferences: {
      preload: path.resolve(__dirname, './preload.js'),
    },
  });

  win.loadFile('index.html');
};

/**
 * app ready
 */
app.whenReady().then(() => {
  console.log('[app] whenReady');

  ipcMain.handle('ping', () => 'pong');

  createWindow();

  app.on('activate', () => {
    console.log('[app] activate');

    const wins = BrowserWindow.getAllWindows();
    if (wins.length === 0) {
      createWindow();
    }
  });
});

/**
 * window close
 */
app.on('window-all-closed', function () {
  console.log('[app] window-all-closed');

  if (!isMac) {
    app.quit(); // 手动终止应用程序的进程
  }
});

// const contents = win.webContents;
// console.log(contents);
