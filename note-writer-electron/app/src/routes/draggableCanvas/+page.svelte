<script>
    export let page = "draggableCanvas";
    import { onMount } from "svelte";

    let root;

    onMount(() => {
        // Make the grid-items draggable
        let draggables = root.querySelectorAll(".grid-item");
    console.log(draggables);
        draggables.forEach((draggable) => {
            draggable.addEventListener("dragstart", () => {
                draggable.classList.add("dragging");
                console.log("dragging");
            });

            draggable.addEventListener("dragend", () => {
                draggable.classList.remove("dragging");
                console.log("dragging ended");
            });
        });

        // Make grid container droppable. Grid item should be left in the nearest grid cell using grid-row and grid-column
        root.addEventListener("dragover", (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(root, e.clientY);
            const draggable = document.querySelector(".dragging");
            if (afterElement == null) {
                root.appendChild(draggable);
            } else {
                root.insertBefore(draggable, afterElement);
            }
        });
    });


    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(".grid-item:not(.dragging)")];

        return draggableElements.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            { offset: Number.NEGATIVE_INFINITY }
        ).element;
    }






</script>

<div class="grid-box" bind:this={root}>
    <div class="grid-item" draggable=True>1</div>
    <div class="grid-item" draggable=True>2</div>
    <div class="grid-item" draggable=True>3</div>
    <div class="grid-item" draggable=True>4</div>
    <div class="grid-item" draggable=True>5</div>
</div>


<style>
    .grid-box {
        display: grid;
        /* grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr); */
        grid-gap: 1rem;
        width: 100%;
        height: 90vh;
        /* Paint grid line */
        background-image:
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px);

        /* Grid 1rem columns */
        background-size: 1rem 1rem;
        grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
        grid-template-rows: repeat(auto-fill, minmax(10rem, 1fr));
    }


    .grid-item {
        background-color: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(0, 0, 0, 0.8);
        font-size: 30px;
        text-align: center;
    }
</style>