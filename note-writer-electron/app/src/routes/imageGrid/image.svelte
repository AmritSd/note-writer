<script>
    // @ts-nocheck
    import { createEventDispatcher } from 'svelte';
    import Icon from 'svelte-icons-pack/Icon.svelte';
    import VscEyeClosed from "svelte-icons-pack/vsc/VscEyeClosed";
    import VscZoomIn from "svelte-icons-pack/vsc/VscZoomIn";
    import VscZoomOut from "svelte-icons-pack/vsc/VscZoomOut";

    export let maxHeight = 18;

    const dispatch = createEventDispatcher();

    function deleteImg() {
        dispatch('delete', {
            text: 'kill me!'
        });
    }
    export let url = "";
    let display = "none";

    $: if(maxHeight === undefined) {
        maxHeight = 18;
    }
</script>
<div on:mouseover={() => {display = "block";}} on:mouseleave={() => {display = "none";}} on:focus={() => {}} >
    <!-- File is image then display image otherwise display video-->
    {#if url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".jpeg") || url.endsWith(".gif") || url.endsWith(".svg") || url.endsWith(".webp") || url.endsWith(".bmp") || url.endsWith(".ico") || url.endsWith(".tiff") || url.endsWith(".jfif") || url.endsWith(".pjpeg") || url.endsWith(".pjp")}
        <img src={url} alt="someting" class="image" style={"max-height: " + maxHeight + "rem;"}/>
    {:else}
        <video controls class="video" style={"max-height: " + maxHeight + "rem;"}>
            <source src={url} type="video/mp4"/>
            <track kind="captions">
        </video>
    {/if}
    <!-- {#if file.type.includes("image")}
        <img src={url} alt={file.name}/>
    {:else}
        Display thumbnail

        <video controls preload="metadata">
            <source src={url + "#t=0.1"} type={file.type}/>
            <track kind="captions"/>
        </video>
    {/if} -->

    <button style="--display : {display}" class="delete" on:click={() => {(display !== "none") && deleteImg()}}>
        <Icon src={VscEyeClosed} size={25} className="icon-close" />
    </button>

    <!-- Add a plus zoom in button and a zoom out button -->
    <button style="--display : {display}" class="zoom-in" on:click={() => {maxHeight += 0.5}}>
        <Icon src={VscZoomIn} size={20} className="icon-close" />
    </button>

    <button style="--display : {display}" class="zoom-out" on:click={() => {maxHeight -= 0.5}}>
        <Icon src={VscZoomOut} size={20} className="icon-close" />
    </button>
</div>

<style>
    div {
        position: relative;
    }
    img {
        display : block;
        height : 100%;  
        max-height: 18rem;
        width: auto;
        margin: 0.5rem;
        border-width: 0.1rem;
        border-style: solid;
        border-color: black;
    }

    video {
        display : block;
        height : 100%;  
        max-height: 18rem;
        width: auto;
        margin: 0.5rem;
        /* border-width: 0.1rem;
        border-style: solid;
        border-color: black; */
    }
    .delete {
        --display: none;
        display : var(--display);
        position: absolute;
        top: 0;
        right: 0;
        border: none;
        background-color: white;
        opacity: 0.6;
        /* translate to center around corner */
        transform: translate(-22%, 21%);

        cursor: pointer;
    }
    .zoom-in, .zoom-out{
        --display: none;
        display : var(--display);
        position: absolute;
        bottom: 0;
        right: 25%;
        border: none;
        background-color: white;
        opacity: 0.6;
        /* translate to center around corner */
        transform: translate(-22%, 5%);

        cursor: pointer;
    }
    .zoom-in {
        right: 0;
    }

    :global(.icon-close) {
        fill: black;
    }
    .delete:hover, .zoom-in:hover, .zoom-out:hover {
        background-color: #6c63ff;
        opacity:0.7;
    }
    .delete:hover :global(.icon-close), .zoom-in:hover :global(.icon-close), .zoom-out:hover :global(.icon-close) {
        fill: white;
    }
</style>

