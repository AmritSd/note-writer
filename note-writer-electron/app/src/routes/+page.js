// export const ssr = false;

// Language: javascript
// Node Js

// This file is used to save a file to the server.
// The file is saved to the server using the file system module.
// The file system module is a part of the Node Js core modules.
fs = window.require('fs');

// This function is used to save a file to the server.
export const saveFile = (file, data) => {
    // This line of code is used to save the file to the server.
    fs.writeFile(file, data, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('File saved successfully');
        }
    });
}