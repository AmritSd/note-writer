
const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        openFile : (id) => ipcRenderer.invoke("open-file", id),
        showNotes : () => ipcRenderer.invoke("show-notes"),
        openDir : (id) => ipcRenderer.invoke("open-dir", id),
        saveDir : (id, messages) => ipcRenderer.invoke("save-dir", {id, messages}),
        deleteFile : (id, file) => ipcRenderer.invoke("delete-file", {id, file}),
        deleteDir : (id) => ipcRenderer.invoke("delete-dir", id),
        backup : () => ipcRenderer.invoke("backup"),
        restore : () => ipcRenderer.invoke("restore")
    }
);