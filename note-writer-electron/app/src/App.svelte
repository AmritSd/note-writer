<script>
	export let name;
    import Home from './routes/+page.svelte';
    import Settings from './routes/settings/+page.svelte';
    import Draggable from './routes/draggable/+page.svelte';
    let page = "Home";

    $: console.log(page);
</script>

<main>
    {#if page === "Home"}
        <Home bind:page/>
    {:else if page === "settings"}
        <Settings bind:page/>
    {:else if page === "draggable"}
        <Draggable bind:page/>
    {/if}
</main>

