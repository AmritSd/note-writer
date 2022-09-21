<script>
    // @ts-nocheck
	import { onMount } from 'svelte';

    import Imagy from './image.svelte';
    import Icon from 'svelte-icons-pack/Icon.svelte';
    import PlusCircleFill from 'svelte-icons-pack/bs/BsPlusCircleFill';


	let files = [];
    let filesWithId = [];
	let allFiles = [];
    let numPics = 0;
    let inputs = "";

    let uploadStyle = "height : 50vh;";
    export let gridStyle = "flex: 1;";
    let iconSize = 35;

    const uploadFiles = (filesWithId) => {
        let formData = new FormData();
        filesWithId.forEach((file) => {
            formData.append("files", file.file);
        });
        fetch("/imageGrid/upload", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            });
    };
    
    $: allFiles = Array.from(allFiles).concat(Array.from(filesWithId));
    $: if(files !== []) {
        filesWithId = Array.from(files).map((file) => {
            return {
                file: file,
                id: numPics++
            }
        });
        files = [];
        if(inputs) {
            inputs.value = "";
        }
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
    $: uploadFiles(filesWithId);
</script>

<div class="upload" style={uploadStyle}>
    <label for="upload">
        <Icon src={PlusCircleFill} size={iconSize} className="icon"/>
        <!--Add a browse file button to add images to the page-->
        <input type="file" accept="image/*, video/mp4,video/x-m4v,video/*" id="upload" style="display:none" bind:files multiple="multiple" bind:this={inputs}/>
    </label> 
</div>


<div class='grid'>
    {#each allFiles as file (file.id)}
        <Imagy file={file.file} on:delete={() => {allFiles = allFiles.filter((f) => f !== file); files = []; filesWithId = [];}}/>
    {/each}
</div>

<style>

:global(.icon) {
    color: rgb(138, 137, 137);
}

/* center label vertically and horizontally*/
label {
    cursor: pointer;
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
}

</style>