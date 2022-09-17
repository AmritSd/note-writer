<script>
    // @ts-nocheck
	import { onMount } from "svelte";
    export let file = "";
    // export let boundingDim = {height: 0, width: 0};
    let img = "";

    // let color = "rgb(0, 0, 0);";

    // const updateHeight = (boundingDim) => {
    //     if(img != "") {
    //         return img.getBoundingClientRect().top;
    //     }
    // }
    // onMount(() => {
    //     updateHeight(boundingDim);
    // });

    // const heightToColor = (height) => {
    //     return "rgb(0, " + (300 - height / 4 ).toString() + ", 0);";
    // }

    // $: height = updateHeight(boundingDim);
    // $: color = heightToColor(height);


    let display = "none";

</script>
<div on:mouseover={() => {display = "block"; console.log("Block")}} on:mouseleave={() => {display = "none"; console.log("none")}} on:focus={() => {}} >
    <img bind:this={img} src={URL.createObjectURL(file)} alt={file.name} />
    <button style="--display : {display}" class="delete">X</button>
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

