// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog , ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');
const serve = require('electron-serve');
const loadURL = serve({ directory: 'public' });

const finalDir = 'src/media';


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function isDev() {
    return !app.isPackaged;
}

function createWindow() {    
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            // enableRemoteModule: true,
            // contextIsolation: false
            webSecurity: false
        },
        icon: path.join(__dirname, 'public/favicon.png'),
        show: false
    });

    // This block of code is intended for development purpose only.
    // Delete this entire block of code when you are ready to package the application.
    if (isDev()) {
        mainWindow.loadURL('http://localhost:5000/');
    } else {
        loadURL(mainWindow);
    }
    
    // Uncomment the following line of code when app is ready to be packaged.
    // loadURL(mainWindow);

    // Open the DevTools and also disable Electron Security Warning.
    // process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    // Emitted when the window is ready to be shown
    // This helps in showing the window gracefully.
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// function will open file (images and videos) and copy them over to the media folder (it will create one if it doesn't exist) and then send the path to the renderer process
ipcMain.handle("open-file", async (event, arg) => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
            { name: 'Videos', extensions: ['mkv', 'avi', 'mp4'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    if (result.canceled) {
        return [];
    }

    // For everypath in result
    // Copy the file to media folder
    let destinationPaths = [];
    for (const filePath of result.filePaths) {
        const fileName = path.basename(filePath);
        let mediaPath = path.join(__dirname, finalDir);
        mediaPath = path.join(mediaPath, arg);

        const destinationPath = path.join(mediaPath, fileName);

        if (!fs.existsSync(mediaPath)) {
            fs.mkdirSync(mediaPath);
        }

        fs.copyFileSync(filePath, destinationPath);
        destinationPaths.push(destinationPath);
    }
    return destinationPaths;
});

// Function will show the notes available in the media folder
// This can be done by reading the notes.json file in the media folder
ipcMain.handle("show-notes", async (event, arg) => {
    const mediaPath = path.join(__dirname, finalDir);
    const notesPath = path.join(mediaPath, 'notes.json');

    if (!fs.existsSync(notesPath)) {
        return;
    }

    const notes = fs.readFileSync(notesPath, 'utf-8');
    return notes;
});

// Function will open a dir with the media folder with given id
// It read the messages.json file within the folder and return the content
ipcMain.handle("open-dir", async (event, arg) => {
    const mediaPath = path.join(__dirname, finalDir);
    const dirPath = path.join(mediaPath, arg);
    const messagesPath = path.join(dirPath, 'messages.json');

    if (!fs.existsSync(messagesPath)) {
        return "empty";
    }

    const messages = fs.readFileSync(messagesPath, 'utf-8');
    return messages;
});


// Function will create a dir within  the media folder with given id if it doesn't exist
// It will then create a messages.json file within the folder if it doesn't exist, and then write contents to the file
// Upload the notes.json file in the media folder. Add the note id and title to array
ipcMain.handle("save-dir", async (event, arg) => {
    const mediaPath = path.join(__dirname, finalDir);

    const notesPath = path.join(mediaPath, 'notes.json');

    if (!fs.existsSync(notesPath)) {
        fs.writeFileSync(notesPath, JSON.stringify([]));
    }

    const notes = fs.readFileSync(notesPath, 'utf-8');
    const notesArray = JSON.parse(notes);
    
    // If the note id is not in the array, add it else update the title
    if (!notesArray.some(note => note.id === arg.id)) {
        notesArray.push({ id: arg.id, title: arg.messages.title });
    } else {
        notesArray.forEach(note => {
            if (note.id === arg.id) {
                note.title = arg.messages.title;
            }
        });
    }

    fs.writeFileSync(notesPath, JSON.stringify(notesArray));

    const dirPath = path.join(mediaPath, arg.id);
    const messagesPath = path.join(dirPath, 'messages.json');

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }

    fs.writeFileSync(messagesPath, JSON.stringify(arg.messages));
});

// Delete file from subfolder in mdia folder with given id
ipcMain.handle("delete-file", async (event, arg) => {
    const mediaPath = path.join(__dirname, finalDir);
    const dirPath = path.join(mediaPath, arg.id);
    const filePath = path.join(dirPath, arg.file);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
});

// Delete folder from media folder with given id
ipcMain.handle("delete-dir", async (event, arg) => {
    const mediaPath = path.join(__dirname, finalDir);
    const dirPath = path.join(mediaPath, arg);

    if (fs.existsSync(dirPath)) {
        fs.rmdirSync(dirPath, { recursive: true });
    }
});