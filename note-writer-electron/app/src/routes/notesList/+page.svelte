<script>
    export let page = "notesList";

    export let notes = [];

</script>


<div class="centered-container">
    <button on:click={() => {page = "Home"}} class="back-button">&lt;Back</button>
    <h2>Notes</h2>
    <table>
        <tr>
            <td>Backup notes</td>
            <td><button on:click={backup}></button></td>
        </tr>

        <tr>
            <td>Restore notes</td>
            <td><button on:click={restore}>Restore</button></td>
        </tr>
    </table>

</div>


<style>
.back-button {
    /* Add some basic styling */
    color: grey;
    text-decoration: underline;
    cursor: pointer;
    background-color: transparent;
    border: none;
    text-underline-offset: 2px;
}

/* Add hover effect */
.back-button:hover {
    color: #0f0f0f;
    text-decoration: underline;
    background-color: transparent;
}

/* Add active effect */
.back-button:active {
    color: black;
}

.centered-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
}

table {
    border-collapse: collapse;
    width: 100%;
}

tr {
    padding: 0 0.5rem;
    margin: 2rem 0;
}

td {
    /* vertically align content */
    vertical-align: middle;
}

td:first-child {
    /* min-width: 20rem; */
    width: 80%;
    padding-left: 1rem;
}

/* color even table rows grey */
tr:nth-child(even) {
    background-color: #f2f2f2;
}
button {
    margin: 0.5rem;
    padding: 0.5rem;
    border: none;
    background-color: #0f0f0f;
    color: white;
    border-radius: 0.25rem;
}

button:hover, button:active {
    background-color: #6c63ff;
}
</style>