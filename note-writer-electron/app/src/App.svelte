<script>
	export let name;
    import Home from './routes/+page.svelte';
    import Settings from './routes/settings/+page.svelte';
    import NotesList from './routes/notesList/+page.svelte';

    let page = "notesList";

    $: console.log(page);
</script>

<main>
    {#if page === "Home"}
        <Home bind:page/>
    {:else if page === "settings"}
        <Settings bind:page/>
    {:else if page === "notesList"}
        <NotesList bind:page/>
    {/if}
</main>

