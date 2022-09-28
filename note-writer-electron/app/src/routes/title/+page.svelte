<script>
    // @ts-nocheck
    export let titleText = "";
</script>
<!-- Add text area for titles-->
<input type="text" placeholder="Title" class="title" bind:value={titleText}/>
<style>
    .title {
        margin-left: 10px;
        margin-bottom: 0.5rem;
        width: calc(100% - 10px);
        height: 50px;
        font-size: 30px;
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        border: none;
        letter-spacing: 0.12em;
        outline: none;
    }
</style>
