// Electronの読み込み
var electron = require('electron');
var app = electron.app;
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

  // mainWindow.webContents.executeJavaScript(`
  //   document.addEventListener("copy", e => {
  //     var copied = window.getSelection().toString();
  //     console.log(copied);
  //   });
  // `);

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

  globalShortcut.register('Command+E', () => {
    dialog.showMessageBox("REQUEST", "Gonna send a request");
    const request = net.request('http://localhost:4000/')
    request.on('response', (response) => {
      console.log(response);
    })
    request.end();
  })

  globalShortcut.register('Command+G', async () => {
    //dialog.showMessageBox("Summarize", "Obtaining innerHTML");
    //console.log("command g is called up!");
    //console.log(mainWindow.webContents)
    const web = await mainWindow.webContents.executeJavaScript("document.body.innerHTML");
    console.log(web);
  })

  globalShortcut.register('Command+Q', () => {
    app.quit()
  })
});

