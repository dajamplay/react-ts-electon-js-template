const { app, BrowserWindow } = require('electron');
const PlayerWindow = require("./windows/player");


class App {

    windows = {}

    run() {
        app.whenReady().then(() => {
            this.createWindows()

            app.on('activate', () => {
                if (BrowserWindow.getAllWindows().length === 0) {
                    this.createWindows()
                }
            })

        })
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit()
            }
        })
    }


    createWindows() {
        this.windows.player = new PlayerWindow(this.windows)
    }
}

module.exports = App;