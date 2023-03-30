<script>
    export let page = "draggable";

</script>

<button on:click={() => page = "Home"}>Home</button>

<div>
    <div draggable="true">Hello</div>
</div>