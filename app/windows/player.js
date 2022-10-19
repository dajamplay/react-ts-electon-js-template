const { join } = require("path")

const { app, BrowserWindow, ipcMain } = require('electron')

class PlayerWindow extends BrowserWindow {

    constructor(windows) {
        super({
            width: 800,
            // minWidth: 400,
            // maxWidth: 400,
            height: 900,
            // maxHeight: 1028,
            // minHeight: 232,
            // frame: false,
            // y: 0,
            // x: 1920 - 405,
            title: "Maks DisplayPlayer",
            resizable: true,
            // useContentSize: true,
            // transparent: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: join(__dirname , "preload.js")
            },
        });
        this.windows = windows;
        this.webContents.openDevTools()
        this.loadFile(join(__dirname ,".." ,"..", "build","index.html"))
        this.on('close', (event) => {
            event.preventDefault()
            this.closeWindow()
        })
        // this.on('move', (event: any) => {
        //     event.preventDefault()
        //     const x = this.getPosition()[0]
        //     const y = this.getPosition()[1]
        //     // windows.playlist.setPosition(x - 400, y)
        // })
        // this.removeMenu();
        this.webContents.on('before-input-event', (event,input) => {
            if (input.key.toLowerCase() === "p" || input.key.toLowerCase() === "з") {
                this.windows.analyser.show();
                event.preventDefault()
            }
        })

        ipcMain.on('playerWindow', (event, params) => {
            const action = params.action
            eval("this." + action + "()");
            // this.webContents.send('playerRenderer');
        })

        ipcMain.on('analyserWindow', (event, dataArray) => {
            if(this.windows.analyser) this.windows.analyser.webContents.send('BufferArray', dataArray)
        })
        ipcMain.on('test', (event, dataArray) => {
            console.log(dataArray)
        })
    }

    closeWindow() {
        ipcMain.removeAllListeners()
        app.exit()
    }

    minWindow() {
        this.minimize()
    }

    // maxWindow() {
    //     if (!this.isMaximized()) {
    //         this.maximize()
    //     } else {
    //         this.unmaximize()
    //     }
    // }
}

module.exports = PlayerWindow;