<script>
    export let page = "settings";

    import Swal from 'sweetalert2';
    async function backup() {
		// Send toast notification saying backing up
		sendToast("Backing up...", "backup-toast", "info");
		let p = await window.api.backup();
		// Send toast notification saying backup complete
		if(p) {
			sendToast("Backup complete!", "backup-toast", "success", 2000);
		}
		else {
			sendToast("Backup failed!", "backup-toast", "error", 2000);
		}
	}

	async function restore() {
		// Send toast notification saying restoring
		sendToast("Restoring...", "restoring-toast", "info");
		let p = await window.api.restore();
		// Send toast notification saying restore complete
		if(p) {
			sendToast("Restore complete!", "restoring-toast", "success", 2000);
		}
		else {
			sendToast("Restore failed!", "restoring-toast", "error", 2000);
		}
	}

	async function sendToast(text, className, icon = "success", duration = 10000) {
		const Toast = Swal.mixin({
			toast: true,
			position: 'bottom-end',
			showConfirmButton: false,
			timer: duration,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener('mouseenter', Swal.stopTimer)
				toast.addEventListener('mouseleave', Swal.resumeTimer)
			}
		})

		Toast.fire({
			icon: icon,
			title: text,
			customClass: {
				popup: className
			}
		})
	}

</script>


<div class="centered-container">
    <button on:click={() => {page = "Home"}} class="back-button">&lt;Back</button>
    <h2>Settings</h2>
    <table>
        <tr>
            <td>Backup notes</td>
            <td><button on:click={backup}>Backup</button></td>
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