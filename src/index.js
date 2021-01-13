// Electronの読み込み
const electron = require('electron');
const app = electron.app;
var ipcMain = electron.ipcMain;

var BrowserWindow = electron.BrowserWindow;
const localShortcut = require('electron-localshortcut');
const globalShortcut = electron.globalShortcut;
const dialog = electron.dialog;

// mainWindow変数の初期化
var mainWindow = null;

// MacOS(darwin)でない場合にはアプリを終了する
app.on('window-all-closed', function() {
  if(process.platform != 'darwin')
  app.quit();
});

// 画面を表示．index.htmlを読み込む
// Close処理を行う
app.on('ready', function() {
  const { net } = require('electron');
  // 画面表示
  mainWindow = new BrowserWindow({
    width: 1400, 
    height: 800,
    'webPreferences': {
      'nodeIntegration': true,
      'webviewTag': true
    }
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  //mainWindow.webContents.openDevTools();

  mainWindow.on('ready-to-show', function () {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.webContents.executeJavaScript(`
      require('electron').ipcRenderer.send('gpu', document.body.innerHTML);
    `);
  });

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  globalShortcut.register('Command+O', () => {
    dialog.showMessageBox("dev", "opened dev tools");
    mainWindow.webContents.openDevTools()
  })

  globalShortcut.register('Command+D', () => {
    mainWindow.webContents.openDevTools();
  })

  globalShortcut.register('Command+Q', () => {
    app.quit()
  })

  ipcMain.on('message', (event, arg) => {
    //console.log(arg)
    //mainWindow.webContents.openDevTools()
    const body = JSON.stringify({sentence: arg})
      const request = net.request({
        method: 'GET',
        url: 'http://78b3873f54a2.ngrok.io'
      })
      
      request.on('response', (response) => {
        response.on('data', (chunk) => {
          const text = chunk.toString('utf-8', 0, chunk.length)
          console.log("=========")
          console.log(text)
          console.log("=========")
          event.sender.send('reply', text)
        })
      })

      request.setHeader('Content-Type', 'application/json');
      request.write(body, 'utf-8');
      request.end();
  })
});

