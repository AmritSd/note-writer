<script>
	// @ts-nocheck
	import Editor from '@tinymce/tinymce-svelte';
	import ImageGrid from './imageGrid/+page.svelte';
	import Title from './title/+page.svelte';

	let titleText = "";
	let gridStyle = "flex: 1;";

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

	// Write to file using 

</script>

<!-- Make a flex box with two side by side divs-->
<Title bind:titleText={titleText}/>
<div class="flex">
	<!-- Left side div -->
	<div class="flex-1" style={gridStyle}>
		<ImageGrid bind:gridStyle={gridStyle}/>
	</div>

	<!-- Right side div -->
	<div class="flex-2">
		<Editor {conf}/>
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
	.flex {
		display: flex;
		/* span the whole page */
		height: 90vh;
	}



	.flex-2 {
		flex: 4;
	}

</style>
