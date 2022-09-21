<script>
    // @ts-nocheck
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function deleteImg() {
        dispatch('delete', {
            text: 'kill me!'
        });
    }
    export let file = "";
    let display = "none";
</script>
<div on:mouseover={() => {display = "block";}} on:mouseleave={() => {display = "none";}} on:focus={() => {}} >
    <!-- File is image then display image otherwise display video-->
    {#if file.type.includes("image")}
        <img src={URL.createObjectURL(file)} alt={file.name}/>
    {:else}
        <!-- Display thumbnail-->

        <video controls preload="metadata">
            <source src={URL.createObjectURL(file) + "#t=0.1"} type={file.type}/>
            <track kind="captions"/>
        </video>
    {/if}

    <button style="--display : {display}" class="delete" on:click={() => {(display !== "none") && deleteImg()}}>X</button>
</div>

<style>
    div {
        position: relative;
    }
    img {
        display : block;
        height : 100%;  
        max-height: 20rem;
        width: auto;
        margin: 0.5rem;
        border-width: 0.1rem;
        border-style: solid;
        border-color: black;
    }

    video {
        display : block;
        height : 100%;  
        max-height: 20rem;
        width: auto;
        margin: 0.5rem;
        border-width: 0.1rem;
        border-style: solid;
        border-color: black;
    }
    .delete {
        --display: none;
        display : var(--display);
        position: absolute;
        top: 0;
        right: 0;
        background-color: tomato;
        color: white;
        border: 0.1rem solid black;
        border-radius: 1rem;
        padding: 0.3rem 0.4rem 0.3rem 0.4rem;
        cursor: pointer;
    }

</style>

