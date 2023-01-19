

<script>
	// @ts-nocheck
	import { onMount } from 'svelte';

	import Editor from '@tinymce/tinymce-svelte';
	import ImageGrid from './imageGrid/+page.svelte';
	import Title from './title/+page.svelte';
	import Icon from 'svelte-icons-pack/Icon.svelte';

	import Swal from 'sweetalert2';
	import FileEarmarkPlusFill from 'svelte-icons-pack/bs/BsFileEarmarkPlusFill';
	import VscOpenPreview from "svelte-icons-pack/vsc/VscOpenPreview";
	import VscSave from "svelte-icons-pack/vsc/VscSave";
	import LeftArrow from "svelte-icons-pack/vsc/VscChevronLeft";
	import RightArrow from "svelte-icons-pack/vsc/VscChevronRight";

	let titleText = "";
	let editorText = "";
	let gridStyle = "flex: 1;";
	let showMenu = "display : none;";
	let notes = [];
	let allFiles = [];
	let numPics = 0;

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
		content_style: 'body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; line-height: 1; letter-spacing: 0.1em; }',
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
		editorText = "";
		allFiles = [];
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

	async function backup() {
		let p = await window.api.backup();
		console.log(p);
	}

</script>

<button on:click={backup}>Backup</button>

<!-- Create a panel that overlay the right side of the screen -->
<div class="panel" style={showMenu}>
	<!-- Close button in the top right of the panel-->
	<button style="position: absolute; top: 0; right: 0; background: none; border: none font-size: 1.5em; cursor: pointer;" on:click={() => {showMenu = "display: None"}}>X</button>

	{#each notes as note}
		<button class="note-menu-option" on:click={() => {openNote(note.id)}}>
			{note.title}
		</button>
	{/each}

</div>

<!-- Arrow 1 will be placed to the left edge of the page in the center. It will be used to go to the previous note -->
<button class="left-arrow" on:click={prevNote}>
	<Icon src={LeftArrow} size={25} className="icon" />
</button>

<!-- Arrow 2 will be placed to the right edge of the page in the center. It will be used to go to the next note -->
<button class="right-arrow" on:click={nextNote}>
	<Icon src={RightArrow} size={25} className="icon"/>
</button>


<!--
	Make a flex box. On the left there will the title component.
	On the right there will be a toolbar with 3 buttons
	1. New
	2. Open
	3. Save

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

		<button on:click={saveNote}>
			<Icon src={VscSave} size={25} className="icon" />
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
		<Editor bind:value={editorText}  id="editor" {conf}/>
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		letter-spacing: 0.1em;
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
		position: absolute;
		right: 0;
		top: 0;
		height: 100%;
		width: 25%;
		background: lightcyan;
		z-index: 2;
	}

	.note-menu-option {
		display : block;
		background: white;
		border-radius: 1em;
		border: none;
		width: 100%;
		cursor: pointer;
	}

	#id-div {
		/* Flash when text changes */
		animation: flash 1s;
	}

</style>
