

<script>
	// @ts-nocheck
	import { onMount } from 'svelte';

	export let page = "Home";

	import Editor from '@tinymce/tinymce-svelte';
	import ImageGrid from './imageGrid/+page.svelte';
	import Title from './title/+page.svelte';
	import NotesList from './notesList/+page.svelte';
	import Icon from 'svelte-icons-pack/Icon.svelte';

	import Swal from 'sweetalert2';
	import FileEarmarkPlusFill from 'svelte-icons-pack/bs/BsFileEarmarkPlusFill';
	import VscOpenPreview from "svelte-icons-pack/vsc/VscOpenPreview";
	import VscSave from "svelte-icons-pack/vsc/VscSave";
	import LeftArrow from "svelte-icons-pack/vsc/VscChevronLeft";
	import RightArrow from "svelte-icons-pack/vsc/VscChevronRight";
	import VscSettingsGear from "svelte-icons-pack/vsc/VscSettingsGear";
	import VscTrash from "svelte-icons-pack/vsc/VscTrash";

	let titleText = "";
	let editorText = "";
	let gridStyle = "flex: 1;";
	let showMenu = "display : none;";
	let deleteConfirm = false;
	let notes = [];
	let allFiles = [];
	let numPics = 0;

	// Track unsaved changes using these variables ------------//
	let unSavedChanges = true;
	let prevTitle = "";
	let prevEditor = "";
	let prevMedia = JSON.stringify(allFiles);
	// --------------------------------------------------------//

	
	// set id to a 10 char random string
	let id = Math.random().toString(36).substring(2, 12);

	// Set default font to Segoe UI
	const conf = {
		toolbar: 'undo redo | fontsizeselect | outdent indent |  fontsize | h1 h2 h3 h4 h5 h6',
		fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
		menubar: false,
		plugins: 'autoresize',	
		min_height: 500,
		resize : 'both',
		body_id : 'editor',
		content_style: 'body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; line-height: 1.5; color: #1F2937;}',
		placeholder : "Write your note here...",
	};

	// On mount 
	onMount(async () => {
        // Attach listener for left and right arrow
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") {
                prevNote();
            } else if (e.key === "ArrowRight") {
                nextNote();
            }
        });
    });

	// Refresh Id, clear title and editor text
	function newNote() {
		id = Math.random().toString(36).substring(2, 12);
		titleText = "";
		editorText = " ";
		allFiles = [];

		updateChanges();
	}

	async function openMenu() {
		// Use the window.api.showNotes to get an array of {Id: string, Title: string}
		notes = JSON.parse(await window.api.showNotes());
		console.log(notes);
		// Display a list of note titles to the user
		console.log("Here");
		showMenu = "display : block;";
	}

	async function openNote(noteId) {
		console.log(noteId);
		const note = JSON.parse(await window.api.openDir(noteId));
		
		titleText = note.title;
		editorText = note.notes + " ";
		allFiles = (note.images) ? note.images : [];
		id = noteId;
		numPics = allFiles.length;
		console.log(allFiles);

		updateChanges();
	}

	// Write to file
	async function saveNote() {
		var data = {};
		data.title = titleText;
		data.notes = editorText;
		data.images = allFiles;
		// Write to file using window.api
		let p = await window.api.saveDir(id, data);
		console.log(p);

		updateChanges();
	}

	async function nextNote() {
		notes = JSON.parse(await window.api.showNotes());
		let index = notes.findIndex((note) => note.id == id);
		if(index == -1) {
			openNote(notes[0].id);
		}
		else if(index == notes.length - 1) {
			openNote(notes[0].id);
		}
		else {
			openNote(notes[index + 1].id);
		}
	}

	async function prevNote() {
		notes = JSON.parse(await window.api.showNotes());
		let index = notes.findIndex((note) => note.id == id);
		if(index == -1) {
			openNote(notes[notes.length - 1].id);
		}
		else if (index == 0) {
			openNote(notes[notes.length - 1].id);
		} else {
			openNote(notes[index - 1].id);
		}
	}

	function updateChanges() {
		prevTitle = titleText;
		prevEditor = editorText;
		prevMedia = JSON.stringify(allFiles);
	}

	function deleteNote() {
		window.api.deleteDir(id);
		prevNote();
	}

	$: unSavedChanges = (prevTitle != titleText || prevEditor != editorText || prevMedia != JSON.stringify(allFiles));
</script>

<!-- Create a panel that overlays the screen when openNotes button is clicked -->
<div class="panel" style={showMenu}>
	<NotesList notes={notes} openNote={openNote} bind:showMenu/>	
</div>

{#if deleteConfirm}
	<div class="panel">
		<div class="delete-confirmation-background">
			<h3>Are you sure you want to delete this note?</h3>
			<div class="buttons">
				<button on:click={() => deleteConfirm = false}>Cancel</button>
				<button on:click={() => {deleteNote(); deleteConfirm = false;}}>Delete</button>
			</div>
		</div>
	</div>
{/if}


<!-- Arrow 1 will be placed to the left edge of the page in the center. It will be used to go to the previous note -->
<button class="left-arrow" on:click={prevNote}>
	<Icon src={LeftArrow} size={25} className="icon" />
</button>

<!-- Arrow 2 will be placed to the right edge of the page in the center. It will be used to go to the next note -->
<button class="right-arrow" on:click={nextNote}>
	<Icon src={RightArrow} size={25} className="icon"/>
</button>

<!-- Unsaved changes notification in the bottom right-->
<div class="saved-changes {unSavedChanges ? ' unsaved' : ' saved'}">
	{#if unSavedChanges}
		Unsaved Changes
	{:else}
		All Changes Saved
	{/if}
</div>

<!--
	Make a flex box. On the left there will the title component.
	On the right there will be a toolbar with 3 buttons
	1. New
	2. Open
	3. Save
	4. Delete
	5. Settings

	The buttons should be icons using the svelte-icons library
	They shouldn't have a border or background

-->
<div style="display: flex; flex-direction: row; height: 100%; width: 100%;">
	<!-- Title -->
	<Title bind:titleText />

	<!-- Toolbar -->
	<div class="toolbar" style="display: flex; flex-direction: row; align-items: center; justify-content: center;">
		<button on:click={newNote}>
			<Icon src={FileEarmarkPlusFill} size={25} className="icon" />
		</button>

		<button on:click={openMenu}>
			<Icon src={VscOpenPreview} size={25} className="icon" />
		</button>

		<button on:click={saveNote} class="{(unSavedChanges) ? "unsaved" : ""}">
			<Icon src={VscSave} size={25} className="icon" />
		</button>

		<button on:click={() => deleteConfirm = true}>
			<Icon src={VscTrash} size={25} className="icon" />
		</button>

		<button on:click={() => {page = "settings"}}>
			<Icon src={VscSettingsGear} size={25} className="icon" />
		</button>

		<!-- Display id right corner-->
		<div id="id-div" style="position: fixed; bottom: 0; right: 0; margin: 10px; font-size: 10px;">{id}</div>
	</div>
</div>

<!-- Make a flex box with two side by side divs-->
<div class="flex">
	<!-- Left side div -->
	<div class="flex-1" style={gridStyle}>
		<ImageGrid bind:gridStyle={gridStyle} bind:allFiles bind:numPics editorId={id}/>
	</div>

	<!-- Right side div -->
	<div class="flex-2">
		<Editor bind:value={editorText}  id="editor" scriptSrc="tinymce.min.js" {conf}/>
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		letter-spacing: 0.075rem;
		font-size : 20px;
	}

	:global(.tox-tbtn) {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
		letter-spacing: 0.1em !important;

	}
	:global(.tox-notification) {
		display: none !important;
	}
	:global(.tox-statusbar) {
		display: none !important;
	}

	:global(.tox-tinymce) {
		border: none !important;
	}

	:global(.tox-editor-header) {
		/* border: 1px solid #ccc !important; */
		box-shadow: none !important;
	}

	/* Add space between buttons in toolbar */
	/* Buttons shouldn't have border or background */
	.toolbar button {
		border: none;
		background: none;
		cursor: pointer;
	}
	/* Make button image purple on hover */
	.toolbar button:hover :global(.icon), .right-arrow:hover :global(.icon), .left-arrow:hover :global(.icon) {
		fill: #6c63ff;
	}

	.flex {
		display: flex;
		/* span the whole page */
		height: 90vh;
	}

	.flex-2 {
		flex: 4;
	}

	.left-arrow {
		/* style="position: absolute; left: 0; top: 50%; transform: translateY(-50%);" */
		position: fixed;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		/* Remove border and background */
		border: none;
		background: none;
		z-index: 1;
	}


	.right-arrow {
		position: fixed;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		z-index: 1;
		/* Remove border and background */
		border: none;
		background: none;

	}

	.panel {
		position: fixed;
		right: 0;
		top: 0;
		left: 0;
		bottom: 0;
		background: rgba(255, 255, 255, 0.5);
		z-index: 2;
	}


	#id-div {
		/* Flash when text changes */
		animation: flash 1s;
	}

	.saved-changes {
		position: fixed;
		bottom: 1rem;
		right: 0;
		margin: 10px;
		font-size: 10px;
	}

	.saved {
		color: #6c63ff;
	}

	.unsaved :global(.icon), .unsaved {
		color: palevioletred;
	}

	.delete-confirmation-background {
		position: fixed;
		top: 50%;
		left: 50%;
		width: min(25rem, 100%);
		background-color: snow;
		transform: translate(-50%, -50%);
		padding: 2rem;
		padding-top: 1rem;
	}

	.delete-confirmation-background button {
		border: none;
		cursor: pointer;
	}

	.delete-confirmation-background button:hover {
		color: white;
		background-color: #6c63ff;
	}
</style>
