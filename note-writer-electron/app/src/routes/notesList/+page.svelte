<script>
    export let notes = [];
    export let openNote = () => {};
    export let showMenu = "";

    let selectedNotes = [];
    let selectAll = false;

    function handleSelection(id) {
        // If id in selectedNotes, remove it
        // Else, add it
        if(selectedNotes.includes(id)) {
            selectedNotes = selectedNotes.filter((noteId) => noteId != id);
        } else {
            selectedNotes.push(id);
        }

        console.log("Returin")
    }
</script>


<div class="centered-container">
    <button on:click={() => {showMenu = "display: None;"}} class="back-button">&lt;Back</button>
    <h2>Notes</h2>
    {#if notes.length === 0}
        <p>No notes found</p>
    {/if}
    <table>
        {#each notes as note (note.id)}
            <tr class="note-row" on:click={() => handleSelection(note.id)}>
                <td>{note.title}</td>
                <td class="date">{note.date !== undefined ? note.date : ""}</td>
                <td><button on:click={() => {openNote(note.id); showMenu = "display: None;"}}>Open</button></td>
            </tr>
        {/each}
    </table>
</div>


<style>
/* Let's make the tr rows selectable */
.note-row {
    cursor: pointer;
}

.note-row:hover {
    background-color: #e6e6e6;
}

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
    background-color: snow;
    min-height: 100%;
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

tr.selected {
    background-color: #6c63ff;
    color: white;
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

.date {
    color: grey;
    font-size: 0.8rem;
}
</style>