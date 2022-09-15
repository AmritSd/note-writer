<script>
	// @ts-nocheck
	let files = [];
	let allFiles = [];
	import Editor from '@tinymce/tinymce-svelte';

	const conf = {
		toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
		menubar: false
	};

    const onImgClick = (e) => {
        // Change the css property for class 'img' to 'display: none'
        
    }

    $: allFiles = Array.from(allFiles).concat(Array.from(files))

</script>

<!--Add a browse file button to add images to the page-->
<input type="file" accept="image/*" bind:files multiple="multiple" />

<!-- Make a flex box with two side by side divs-->
<div class="flex">
	<!-- Left side div -->
	<div class="flex-1">
		<!-- Add a div to show the images -->
		<div class="image-grid">
			{#each allFiles as file}
                <div class = "image-container">
                    <img class = "grid-ele" src={URL.createObjectURL(file)} alt={file.name} on:click={onImgClick} />
                    <button on:click={() => {allFiles = allFiles.filter((f) => f !== file); files = [];}}> Delete </button>
                </div>
			{/each}
		</div>
	</div>

	<!-- Right side div -->
	<div class="flex-1">
		<Editor {conf} />
	</div>
</div>

<style>
	:global(.tox-notification) {
		display: none !important;
	}
	:global(.tox-statusbar) {
		display: none !important;
	}

	:global(.tox-tinymce) {
		border: none !important;
	}
	.flex {
		display: flex;
		/* span the whole page */
		height: 100vh;
	}
	.flex-1 {
		flex: 1;
	}

    .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-gap: 1rem;
    }

    .grid-ele {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .image-container {
        position: relative;
    }

    .image-container button {
        position: absolute;
        top: 0;
        right: 0;
        display: none;
    } 
</style>
