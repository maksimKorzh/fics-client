const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fics', {
    connect: () => ipcRenderer.send('connect'),
    sendCommand: (cmd) => ipcRenderer.send('command', cmd),
    onData: (callback) => ipcRenderer.on('data', (_, data) => callback(data))
});