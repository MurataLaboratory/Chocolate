const { ipcRenderer } = require('electron');

ipcRenderer.on('getContent', function() {
  body = document.body;
  console.log(body)
  ipcRenderer.sendToHost('hogehoge', body)
})