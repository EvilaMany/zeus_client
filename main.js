const {
    app,
    BrowserWindow,
    Tray,
    Menu,
    remote,
    dialog
} = require('electron')

const fs = require('fs')



// Храните глобальную ссылку на объект окна, если вы этого не сделаете, окно будет
// автоматически закрываться, когда объект JavaScript собирает мусор.
let win, tray

let debug = false

let prefix;

if(debug) {
    global.debug = true
    global.server_url = 'http://zeuscp.fun'
    //global.server_url = 'http://bitcer.com'
    prefix = '.'
} else {
    global.debug = false
    global.server_url = 'http://zeuscp.fun'
    prefix = 'resources/app.asar'
}




function createWindow() {


    //создает tray-окошко
    tray = new Tray(prefix + '/resources/img/logo32.ico')
    const contextMenu = Menu.buildFromTemplate([{
            label: 'Развернуть',
            click: () => {
                win.show()
            }
        },
        {
            label: 'Выйти',
            click: () => {
                tray.destroy()
                win.close()
            }
        }
    ])
    tray.setToolTip('Развернуть')
    tray.setContextMenu(contextMenu)

    tray.on('double-click', () => {
        win.show()
    })



    app.setAppUserModelId(process.execPath)

    if (process.platform === 'win32') {}
    // Создаём окно браузера.
    win = new BrowserWindow({
        width: 900,
        height: 680,
        frame: false,
        transparent: false,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: false,
        icon: __dirname + prefix + '/resources/img/logo64.png',
        autoHideMenuBar: true,
        backgroundColor: "#092138"
    })

    // and load the index.html of the app.
    win.loadFile('index.html')

    //win.webContents.openDevTools()
    // Отображаем средства разработчика.
    //win.webContents.openDevTools()

    // Будет вызвано, когда окно будет закрыто.
    win.on('closed', () => {
        // Разбирает объект окна, обычно вы можете хранить окна
        // в массиве, если ваше приложение поддерживает несколько окон в это время,
        // тогда вы должны удалить соответствующий элемент.
        win = null
    })


    //win.webContents.openDevTools();
}

// Этот метод будет вызываться, когда Electron закончит
// инициализацию и готов к созданию окон браузера.
// Некоторые API могут использоваться только после возникновения этого события.

app.on('ready', () => {
    if (!fs.existsSync(prefix + '/resources/img/logo32.ico')) {
        dialog.showErrorBox('Not found required resources', 'Please, reinstall app or reunpack app files.')
        app.quit()
    }
    else
    {
        createWindow()
    }

})

// Выходим, когда все окна будут закрыты.
app.on('window-all-closed', () => {
    // Для приложений и строки меню в macOS является обычным делом оставаться
    // активными до тех пор, пока пользователь не выйдет окончательно используя Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('before-quit', () => {
    tray.destroy()
})

app.on('activate', () => {
    // На MacOS обычно пересоздают окно в приложении,
    // после того, как на иконку в доке нажали и других открытых окон нету.
    if (win === null) {
        createWindow()
    }
})
