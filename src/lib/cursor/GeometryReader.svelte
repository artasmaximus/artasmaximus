<script lang="ts">
	import { onMount } from 'svelte';

	// Props
	let { children } = $props();

	// Reactive state for bounding box
	let contentRect = $state<DOMRect | null>(null);

	// Reference to the wrapper element
	let wrapper: HTMLElement;

	// Function to update bounding box
	function updateBoundingRect() {
		if (wrapper) {
			contentRect = wrapper.getBoundingClientRect();
		}
	}

	// Update bounding box on mount and window resize
	onMount(() => {
		updateBoundingRect();
		window.addEventListener('resize', updateBoundingRect);
		return () => window.removeEventListener('resize', updateBoundingRect);
	});
</script>

<div bind:this={wrapper} class="wrapper">
	{@render children({ contentRect })}
</div>

<style>
	.wrapper {
		position: relative;
		display: inline-block;
	}
</style>
