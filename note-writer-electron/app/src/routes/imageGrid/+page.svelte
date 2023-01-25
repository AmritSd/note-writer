<script>
    // @ts-nocheck

    import Imagy from './image.svelte';
    import Icon from 'svelte-icons-pack/Icon.svelte';
    import PlusCircleFill from 'svelte-icons-pack/bs/BsPlusCircleFill';


	let files = [];
    let filesWithId = [];
    let inputs = "";

    let uploadStyle = "height : 50vh;";
    export let gridStyle = "flex: 1;";
    export let editorId = "";
    export let allFiles = [];
    export let numPics = 0;

    let iconSize = 35;
    

    $: if(files !== []) {
        filesWithId = Array.from(files).map((file) => {
            return {
                path: "media://" + file,
                id: ++numPics,
                size: 18
            }
        });
        files = [];
        if(inputs) {
            inputs.value = "";
        }

        allFiles = Array.from(allFiles).concat(Array.from(filesWithId));
        filesWithId = [];
    }

    $: if(allFiles.length > 0) {
        uploadStyle = "height: 5vh;";
        gridStyle = "flex: 2;";
        iconSize = 25;
    } else {
        uploadStyle = "height: 50vh;";
        gridStyle = "flex: 1;";
        iconSize = 35;
    }

    $: console.log(allFiles);
    $: console.log(files);
    // $: uploadFiles(filesWithId);
</script>

<div class="upload" style={uploadStyle}>
    <button class="upload-button" on:click={async () => {files = await window.api.openFile(editorId);}}>
        <Icon src={PlusCircleFill} size={iconSize} className="icon" />
    </button>

</div>


<div class='grid'>
    {#each allFiles as file (file.id)}
        <Imagy url={file.path} bind:maxHeight={file.size} on:delete={() => {allFiles = allFiles.filter((f) => f !== file); files = []; filesWithId = [];}}/>
    {/each}
</div>

<style>

:global(.icon) {
    color: rgb(138, 137, 137);
}



button {
    cursor: pointer;
    background: none;
    border: none;
    outline: none;
}
.upload {
    /* center contents vertically and horizontally */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
}

.grid {
    display: flex;
    flex-wrap: wrap;
    margin-left: 1rem;
}

</style>