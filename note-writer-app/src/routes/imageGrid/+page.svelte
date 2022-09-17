<script>
    // @ts-nocheck
	import { onMount } from 'svelte';

    import Imagy from './image.svelte';

	let files = [];
	let allFiles = [];
    let grid_width = 100;
    let numPics = 0;

    const getHeightAndWidthFromDataUrl = dataURL => new Promise(resolve => {
        const img = new Image()
        img.onload = () => {
            resolve({
            height: img.height,
            width: img.width
            })
        }
        img.src = dataURL
    })



    $: allFiles = Array.from(allFiles).concat(Array.from(files));

</script>
<!--Add a browse file button to add images to the page-->
<input type="file" accept="image/*" bind:files multiple="multiple" />
<div class='grid' bind:clientWidth={grid_width}>
    {#each allFiles as file}
        <Imagy file={file}/>
    {/each}
</div>

<style>
.grid {
    display: flex;
    flex-wrap: wrap;
}

</style>