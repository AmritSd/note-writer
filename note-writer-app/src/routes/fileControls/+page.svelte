<script>

// @ts-nocheck
// Define openFile function using the showOpenFilePicker API
// https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker
// https://web.dev/file-system-access/
let text = "";
const openFile = async () => {
  // Open a file and return the file handle
  const [handle] = await window.showOpenFilePicker();
  // Create a FileSystemFileHandle object
  const file = await handle.getFile();
  text = await textFromFile(file);
  // Return the file object

  console.log(JSON.stringify(handle));
  console.log(handle);
  return handle;
};

const textFromFile = async (file) => {
  // Create a new FileReader object
  const reader = new FileReader();
  // Return a promise that resolves with the file text
return new Promise((resolve) => {
    // Define the event listener
    reader.onload = () => {
    // Resolve the promise with the file text
    resolve(reader.result);
    };
    // Read the file as text
    reader.readAsText(file);
});
};

const readFileHandleFromJson = async () => {
    const f = await openFile();
    const text = await textFromFile(f);
    const json = JSON.parse(text);

    console.log(json);
}

// savefile take text as input
const saveFile = async (text) => {
  // Create a file handle
  const handle = await window.showSaveFilePicker({
    types: [
      {
        description: "Text file",
        accept: {
          "text/plain": [".txt"],
        },
      },
    ],
  });
  // Create a FileSystemWritableFileStream to write to
  const writable = await handle.createWritable();
  // Write the contents of the file to the stream
  await writable.write(text);
  // Close the file and write the contents to disk
  await writable.close();
};

const saveExistingFile = async (fileHandle, text) => {
  // Create a FileSystemWritableFileStream to write to
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream
  await writable.write(text);
  // Close the file and write the contents to disk
  await writable.close();
};
</script>


Add buttons to open a file and save a File
{text}
<button on:click={() => {openFile()}}>Open File</button>
<button on:click={() => {saveFile("Holy shite")}}>Save File</button>
<!-- Update file button -->
<button on:click={async () => {saveExistingFile(await openFile(), "Poop is good")}}>Update File</button>
<!-- Write file handle to a json file-->
<button on:click={async () => {saveFile(JSON.stringify(await openFile()))}}>Write File Handle to JSON</button>
<!-- Read file handle from a json file-->
<button on:click={() => {readFileHandleFromJson}}>Read File Handle from JSON</button>