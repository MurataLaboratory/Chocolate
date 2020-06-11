// Electronの読み込み
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

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
  // 画面表示
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.executeJavaScript(`
    document.addEventListener("copy", e => {
      var copied = window.getSelection().toString();
      console.log(copied);
    })
  `)

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

