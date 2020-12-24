const { ipcRenderer } = require('electron')
const { net } = require('electron')

ipcRenderer.on('ping', (e, data) => {
  ipcRenderer.sendToHost('pong')
})

window.onload = (e) => {
  //ipcRenderer.sendToHost("!onload!")
  const bod = document.body
  bod.addEventListener('mouseup', (e) => {
    if(window.getSelection().toString().length) {
      const text = window.getSelection().toString()
      ipcRenderer.sendToHost(text)
      const body = JSON.stringify({sentence: text})
      const request = net.request({
        method: 'POST',
        url: 'http://3e2ae4368c2b.ngrok.io/'
      })
      
      request.on('response', (response) => {
        // console.log(response);
        alert(response)
        ipcRenderer.sendToHost(text)
      })

      request.setHeader('Content-Type', 'application/json');
      request.write(body, 'utf-8');
      request.end();
    }
  })
}

