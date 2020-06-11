// Electronの読み込み
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
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
  globalShortcut.register('Command+T', () => {
    dialog.showErrorBox("OMG", "CMD+T IS PRESSED");
  });

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

  mainWindow.webContents.executeJavaScript(`
    document.addEventListener("copy", e => {
      var copied = window.getSelection().toString();
      console.log(copied);
    });
  `);

  mainWindow.on('ready-to-show', function () {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

