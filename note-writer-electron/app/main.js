// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog , ipcMain, Menu} = require('electron');
const path = require('path');
const { protocol } = require('electron');
const fs = require('fs-extra');
const serve = require('electron-serve');
const loadURL = serve({ directory: 'public' });

const finalDir = path.join(app.getPath('appData'), 'media');
if (!fs.existsSync(finalDir)) {
    fs.mkdirSync(finalDir);
}


// Menu.setApplicationMenu(null);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function isDev() {
    return !app.isPackaged;
}

function createWindow() {    

    protocol.registerFileProtocol("media", (request, callback) => {
        const url = request.url.replace(`media://`, '')
        try {
          // Return toy image from public dir
            return callback(path.join(finalDir, url))
        }
        catch (error) {
          // Handle the error as needed
          console.error(error)
        }
    })

    // Create the browser window.
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: true,
            contextIsolation: true,
            webSecurity: true
        },
        icon: path.join(__dirname, 'public/favicon.png'),
        show: false
    });

    mainWindow.maximize();
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
        let mediaPath = finalDir
        mediaPath = path.join(mediaPath, arg);

        const destinationPath = path.join(mediaPath, fileName);

        if (!fs.existsSync(mediaPath)) {
            fs.mkdirSync(mediaPath);
        }

        // If filename already exists at destination skip copying
        try {
            if(!fs.existsSync(destinationPath)) {   
                fs.copyFileSync(filePath, destinationPath);
                destinationPaths.push(path.join(arg, fileName));
            }
        } catch (err) {
            console.error(err);
        }
    }
    return destinationPaths;
});

// Function will show the notes available in the media folder
// This can be done by reading the notes.json file in the media folder
ipcMain.handle("show-notes", async (event, arg) => {
    const mediaPath = finalDir
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
    const mediaPath = finalDir
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
    const mediaPath = finalDir

    const notesPath = path.join(mediaPath, 'notes.json');

    if (!fs.existsSync(notesPath)) {
        // Creat
        fs.writeFileSync(notesPath, JSON.stringify([]));
    }

    const notes = fs.readFileSync(notesPath, 'utf-8');
    const notesArray = JSON.parse(notes);
    

    // If the note id is not in the array, add it else update the title
    if (!notesArray.some(note => note.id === arg.id)) {
        let todaysDate = new Date();
        notesArray.push({ id: arg.id, title: arg.messages.title, date: todaysDate.toLocaleDateString()});
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

    // Get existing files in the folder
    let filePaths = fs.readdirSync(dirPath);
    let fileNames = [];

    filePaths.forEach(filePath => {
        fileNames.push(path.basename(filePath));
    });

    // Get files to keep 
    let filesToKeep = [];
    arg.messages.images.forEach(file => {
        filesToKeep.push(path.basename(file.path));
    });

    // Delete files that are not in the filesToKeep array
    fileNames.forEach(fileName => {
        if (!filesToKeep.includes(fileName)) {
            fs.unlinkSync(path.join(dirPath, fileName));
        }
    });

    fs.writeFileSync(messagesPath, JSON.stringify(arg.messages));
});

// Delete file from subfolder in mdia folder with given id
ipcMain.handle("delete-file", async (event, arg) => {
    const mediaPath = finalDir
    const dirPath = path.join(mediaPath, arg.id);
    const filePath = path.join(dirPath, arg.file);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
});

// Delete folder from media folder with given id
ipcMain.handle("delete-dir", async (event, arg) => {
    const mediaPath = finalDir
    const dirPath = path.join(mediaPath, arg);

    if (fs.existsSync(dirPath)) {
        fs.rm(dirPath, { recursive: true });
    }

    // Remove note form notes.json file
    const notesPath = path.join(mediaPath, 'notes.json');

    if (!fs.existsSync(notesPath)) {
        return;
    }

    const notes = fs.readFileSync(notesPath, 'utf-8');
    const notesArray = JSON.parse(notes);
    const filteredNotes = notesArray.filter(note => note.id !== arg);
    fs.writeFileSync(notesPath, JSON.stringify(filteredNotes));
});


// Backup the media folder
ipcMain.handle("backup", async (event, arg) => {
    // Ask the user to select a folder
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });

    if (result.canceled) {
        // Return failure status to renderer process
        return false;
    }

    const mediaPath = finalDir
    const backupPath = path.join(result.filePaths[0], 'media');

    if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath);
    }

    // Copy the media folder to the selected folder recursively
    try {
        await fs.copy(mediaPath, backupPath);
        // Sleep for 1 second to make sure the copy is complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    } catch (err) {
        return false;
    }
});

// Import the media folder
ipcMain.handle("restore", async (event, arg) => {
    // Ask the user to select a folder
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });

    if (result.canceled) {
        // Return failure status to renderer process
        return false;
    }

    const mediaPath = finalDir
    const importPath = result.filePaths[0];

    if (!fs.existsSync(importPath)) {
        return false;
    }

    // We want to merge the two notes.json files
    // So we need to read the notes.json file in the media folder and the notes.json file in the selected folder
    // Then we need to merge the two arrays and remove duplicates
    // Then we need to write the merged array to the notes.json file in the media folder

    const mediaNotesPath = path.join(mediaPath, 'notes.json');
    const importNotesPath = path.join(importPath, 'notes.json');

    if (fs.existsSync(mediaNotesPath) && fs.existsSync(importNotesPath)) {

        const mediaNotes = fs.readFileSync(mediaNotesPath, 'utf-8');
        const importNotes = fs.readFileSync(importNotesPath, 'utf-8');

        const mediaNotesArray = JSON.parse(mediaNotes);
        const importNotesArray = JSON.parse(importNotes);

        const mergedNotesArray = [...mediaNotesArray, ...importNotesArray];

        // Each note has an id and a title
        // We need to remove duplicates based on the id efficiently
        let uniqueNotesArray = [];
        let idMap = new Map();

        for (let i = 0; i < mergedNotesArray.length; i++) {
            const note = mergedNotesArray[i];

            if (!idMap.has(note.id)) {
                idMap.set(note.id, true);
                uniqueNotesArray.push(note);
            }
        }

        fs.writeFileSync(mediaNotesPath, JSON.stringify(uniqueNotesArray));
    }


    // Copy the folder/file to the media folder if it doesn't exist
    try {
        await fs.copy(importPath, mediaPath, {
            overwrite: false,
            errorOnExist: false,
            recursive: true
        });
        return true;
    }
    catch (err) {
        return false;
    }
});
