const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const net = require('net');

let client;

function createWindow() {
    const win = new BrowserWindow({
        fullscreen: true,
        width: 1720,
        minWidth:1720,
        height: 1000,
        webPreferences: { preload: __dirname + '/preload.js' }
    }); const template = [
        {
            label: 'View',
            submenu: [
                { label: 'Reload', role: 'reload' },
                { label: 'Toggle Developer Tools', role: 'toggleDevTools' },
                { label: 'Fullscreen', role: 'togglefullscreen' },
                { label: 'Exit', role: 'quit' },
            ]
        }
    ]; const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    win.loadFile('ui.html');
    win.on('close', () => {
        if (client) {
            client.end();  // Send FIN to server, graceful close
            client.destroy();  // Force close in case end doesn't work
            client = null;
        }
    });
}

app.whenReady().then(createWindow);

app.on('quit', () => {
    if (client) {
        client.end();
        client.destroy();
        client = null;
    }
});

ipcMain.on('connect', (event) => {
    client = net.createConnection({ host: 'freechess.org', port: 5000 }, () => { console.log('Connected to FICS'); });
    client.on('data', (data) => { event.sender.send('data', data.toString()); });
    client.on('end', () => { event.sender.send('data', '\nDisconnected from server.\n'); });
    client.on('error', (err) => {
        console.error('Socket error:', err);
        event.sender.send('telnet-data', `\nConnection error: ${err.message}\n`);
        client.destroy();
        client = null;
    });
});

ipcMain.on('command', (event, command) => { if (client) client.write(command + '\n'); });